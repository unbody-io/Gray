import { Unbody } from "@unbody-io/ts-client";
import { introPrompt } from "@/utils/prompt-templates/prompt.template.intro";
import { categoriesPrompt } from "@/utils/prompt-templates/prompt.template.categories";
import {
  AutoFields,
  AutoFieldsRaw,
  CategoryRaw,
  QueryContextItem,
  ReadPageData,
  ReadPageResponse,
  SearchContextResponse,
} from "@/types/data.types";
import { searchContextPrompt } from "@/utils/prompt-templates/prompt.template.topic";
import { IGoogleDoc } from "@unbody-io/ts-client/build/core/documents";
import { TextBlock } from "@unbody-io/ts-client/build/types/TextBlock.types";
import { readContextPrompt } from "@/utils/prompt-templates/prompt.template.read-blocks";

if (!process.env.UNBODY_API_KEY || !process.env.UNBODY_PROJECT_ID) {
  throw new Error("UNBODY_API_KEY and UNBODY_PROJECT_ID must be set");
}

export const unbody = new Unbody({
  apiKey: process.env.UNBODY_API_KEY,
  projectId: process.env.UNBODY_PROJECT_ID,
});

export const getAutoFields = async (): Promise<AutoFields> => {
  const {
    data: { payload },
  } = await unbody.get.googleDoc
    .select("autoKeywords", "autoEntities", "autoTopics")
    .group(0.1, "closest")
    .exec();

  const entities = (payload as AutoFieldsRaw[])
    .flatMap(({ autoEntities }) => autoEntities)
    .filter((e) => e !== null);
  const uniqueEntities = Array.from(new Set(entities));

  // we exclude entities from topics
  const topics = (payload as AutoFieldsRaw[])
    .flatMap(({ autoTopics }) => autoTopics)
    .filter((t) => t && !uniqueEntities.includes(t));
  const uniqueTopics = Array.from(new Set(topics));

  // excluding both entities and topics from keywords
  const keywords = (payload as AutoFieldsRaw[])
    .flatMap(
      ({ autoKeywords }: { autoKeywords: string[] | null }) => autoKeywords
    )
    .filter(
      (k) => k && !uniqueEntities.includes(k) && !uniqueTopics.includes(k)
    );

  const uniqueKeywords = Array.from(new Set(keywords));

  return {
    entities: uniqueEntities as string[],
    topics: uniqueTopics as string[],
    keywords: uniqueKeywords as string[],
  };
};

const generateBlogIntro = async (
  entities: string[],
  topics: string[]
): Promise<string> => {
  const {
    data: {
      generate: { result },
    },
  } = await unbody.get.googleDoc
    .select("title")
    .limit(15)
    .generate.fromMany(introPrompt.create(entities, topics), [
      "title",
      "autoSummary",
    ])
    .exec();

  return introPrompt.parse(result);
};

const generateCategories = async (
  topics: string[],
  entities: string[]
): Promise<CategoryRaw[]> => {
  const {
    data: {
      generate: { result },
    },
  } = await unbody.get.googleDoc
    .select("title")
    .limit(15)
    .generate.fromMany(categoriesPrompt.create(topics, entities), [
      "title",
      "autoSummary",
    ])
    .exec();
  return categoriesPrompt.parse(result);
};

const searchAboutOnGoogleDocs = async <T>(
  q: string | undefined = "",
  entities: string[] = [],
  topics: string[] = [],
  keywords: string[] = [],
  select: (keyof IGoogleDoc)[] = [
    "title",
    "slug",
    "summary",
    "modifiedAt",
    "subtitle",
  ],
  minScore = 0.5
): Promise<T[]> => {
  let query = unbody.get.googleDoc.select(...select);

  const tags = [
    ...entities.map((e) => ({ value: e, type: "autoEntities" })),
    ...topics.map((t) => ({ value: t, type: "autoTopics" })),
    ...keywords.map((k) => ({ value: k, type: "autoKeywords" })),
  ];

  if (tags.length > 0) {
    // @ts-ignore
    query = query.where(({ Or, ContainsAny }) => {
      return Or(
        ...tags.map(({ value, type }) => ({
          [type]: ContainsAny(value),
        }))
      );
    });
  }

  if (q.trim().length > 0) {
    // @ts-ignore
    query = query.search.about(q, { certainty: minScore });
  }

  const {
    data: { payload },
  } = await query.exec();
  return payload;
};

const searchAboutOnTextBlocks = async <T>(
  q: string | string[],
  // @ts-ignore
  select: (keyof Omit<TextBlock, "__typename" | "_additional">)[] = [
    "order",
    "html",
    // ! error: not assignable to type '"html" | "remoteId" | "sourceId" | "text" | "footnotes" | "order" | "tagName" | "classNames" | "document"'.
    "document.GoogleDoc.slug",
  ],
  minScore = 0.6
): Promise<T[]> => {
  const query = unbody.get.textBlock
    .where(({ NotEqual, And, ContainsAny }) => {
      return And(
        { tagName: NotEqual("h1") },
        { tagName: NotEqual("h2") },
        { tagName: NotEqual("h3") },
        { classNames: NotEqual("title") }
      );
    })
    .select(...select)
    .search.about(q, { certainty: minScore });

  const {
    data: { payload },
  } = await query.exec();
  return payload;
};

const generateSearchContext = async (
  contextItems: QueryContextItem[] = [],
  q?: string
): Promise<SearchContextResponse> => {
  //   const searchMethod = contextItems.length === 0 ? "hybrid" : "hybrid";
  const searchMethod = "hybrid";
  const searchQuery =
    contextItems.length === 0 && q
      ? q
      : contextItems.map(({ value }) => value).join(", ");

  const query = unbody.get.textBlock
    .select("remoteId", "text")
    .search[searchMethod](searchQuery)
    .limit(10)
    .generate.fromMany(searchContextPrompt.create(contextItems, q), ["text"]);

  const {
    data: {
      generate: { result },
    },
  } = await query.exec();
  return searchContextPrompt.parse<SearchContextResponse>(result);
};

const generateReadPage = async (
  contextItems: QueryContextItem[] = [],
  prevPages: ReadPageData[] = [],
  q: string = ""
): Promise<ReadPageResponse> => {
  //   const searchMethod = contextItems.length === 0 ? "about" : "about";
  const searchMethod = "about";
  const searchQuery =
    contextItems.length === 0 && q
      ? q
      : contextItems.map(({ value }) => value).join(", ");
  const emptyQuery = searchQuery.trim().length === 0;

  let query = unbody.get.textBlock
    // @ts-ignore
    .select(
      "text",
      // ! error: not assignable to parameter of type 'keyof ITextBlock'.
      "document.GoogleDoc.slug",
      "document.GoogleDoc.title",
      "order",
      "tagName",
      "classNames"
    )
    .where(({ And, NotEqual }) => {
      return And(
        { tagName: NotEqual("h1") },
        { tagName: NotEqual("h2") },
        { tagName: NotEqual("h3") },
        { classNames: NotEqual("title") },
        { classNames: NotEqual("subtitle") },
        ...prevPages.flatMap(({ from }) => {
          return from.map(({ order, document }) => {
            return And(
              { order: NotEqual(order) },
              { document: { GoogleDoc: { slug: NotEqual(document[0].slug) } } }
            );
          });
        })
      );
    });

  if (!emptyQuery) {
    // @ts-ignore
    query = query.search[searchMethod](searchQuery);
  }

  const lastPage =
    prevPages.length > 0 ? prevPages[prevPages.length - 1] : null;
  const lastBlock = lastPage ? lastPage.from[lastPage.from.length - 1] : null;

  const {
    data: { generate },
  } = await query
    .limit(3)
    .generate.fromMany(
      readContextPrompt.create(
        contextItems,
        q,
        lastBlock,
        prevPages.length === 0
      ),
      ["text"]
    )
    .exec();
  return generate;
};

const askOnGoogleDocs = async (question: string): Promise<string> => {
  const query = await unbody.get.googleDoc.ask(question);

  const {
    data: { payload },
  } = await query.exec();
  return payload;
};

const askOnTextBlocks = async <T>(
  question: string,
  // @ts-ignore
  select: (keyof Omit<TextBlock, "__typename" | "_additional">)[] = [
    "order",
    "html",
    "document.GoogleDoc.slug",
    "document.GoogleDoc.title",
  ],
  minScore = 0.7
): Promise<T | null> => {
  // ! error:  unbody.get.googleDoc.ask is marked as not promise.
  const query = await unbody.get.textBlock
    .select(...select)
    .additional("certainty")
    .ask(question);

  const {
    data: { payload },
  } = await query.exec();
  const topAnswer = payload[0]._additional?.answer?.hasAnswer
    ? payload[0]
    : null;

  return topAnswer || null;
};

const getPost = async (slug: string): Promise<IGoogleDoc | null> => {
  const query = unbody.get.googleDoc.where({ slug }).select(
    "title",
    "autoTopics",
    "autoSummary",
    "autoKeywords",
    "autoEntities",
    "title",
    "slug",
    "subtitle",
    "toc",
    "modifiedAt",
    //@ts-ignore
    "blocks.TextBlock.order",
    "blocks.TextBlock.html",
    "blocks.TextBlock.text",
    "blocks.TextBlock.tagName",
    "blocks.TextBlock.classNames",
    "blocks.ImageBlock.order",
    "blocks.ImageBlock.width",
    "blocks.ImageBlock.height",
    "blocks.ImageBlock.url",
    "blocks.ImageBlock.title",
    "blocks.ImageBlock.alt",
    "blocks.ImageBlock.__typename",
    "blocks.TextBlock.__typename",
    "mentions"
  );
  const {
    data: { payload },
  } = await query.exec();
  return payload[0] || null;
};

const getPostSlugs = async (): Promise<string[]> => {
  const query = unbody.get.googleDoc.select("slug");
  const {
    data: { payload },
  } = await query.exec();
  return (payload as IGoogleDoc[]).map(({ slug }) => slug as string);
};

export const unbodyService = {
  generateBlogIntro,
  generateCategories,
  searchAboutOnGoogleDocs,
  searchAboutOnTextBlocks,
  generateSearchContext,
  askOnGoogleDocs,
  askOnTextBlocks,
  getPost,
  getPostSlugs,
  getAutoFields,
  generateReadPage,
};
