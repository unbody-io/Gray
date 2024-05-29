import {Unbody} from "@unbody-io/ts-client";
import {categoriesPrompt} from "@/utils/prompt-templates/prompt.template.categories";
import {
    AutoFields,
    AutoFieldsRaw, Category,
    CategoryRaw, ImageBlock, MiniArticle, MiniTextBlock,
    QueryContextItem,
    ReadPageData,
    ReadPageResponse,
    SearchContextResponse,
    SiteContext,
    SiteContextConfig,
    SiteType
} from "@/types/data.types";
import {searchContextPrompt} from "@/utils/prompt-templates/prompt.template.topic";
import {IGoogleDoc, IVideoFile} from "@unbody-io/ts-client/build/core/documents";
import {readContextPrompt} from "@/utils/prompt-templates/prompt.template.read-blocks";
import {siteEssentialsPrompt} from "@/utils/prompt-templates/prompt.template.siteEssentials";
import {siteSummaryPrompt} from "@/utils/prompt-templates/prompt.template.intro";

if (!process.env.UNBODY_API_KEY || !process.env.UNBODY_PROJECT_ID) {
    throw new Error("UNBODY_API_KEY and UNBODY_PROJECT_ID must be set");
}

export const unbody = new Unbody({
    apiKey: process.env.UNBODY_API_KEY,
    projectId: process.env.UNBODY_PROJECT_ID,
})

export const getAutoFields = async (): Promise<AutoFields> => {
    const [googleDocsResponse, videoFilesResponse, imageBlocksResponse] = await Promise.all([
        unbody.get.googleDoc
            .select("autoKeywords", "autoEntities", "autoTopics")
            .group(0.1, "closest")
            .exec(),
        unbody.get.videoFile
            .select("autoKeywords", "autoEntities", "autoTopics")
            .group(0.1, "closest")
            .exec(),
        unbody.get.imageBlock
            .select("autoTypes")
            .group(0.1, "closest")
            .exec()
    ]);

    // Extract payloads
    const googleDocs = googleDocsResponse.data.payload;
    const videoFiles = videoFilesResponse.data.payload;
    const imageBlocks = imageBlocksResponse.data.payload;

    // Combine all entities
    const combinedData = [...googleDocs, ...videoFiles, ...imageBlocks] as AutoFieldsRaw[];

    // Extract and filter fields
    const extractAndFilter = (field: keyof AutoFieldsRaw) =>
        combinedData.flatMap(item => item[field] ?? []).filter(e => e && e.trim().length > 0);

    const entities = extractAndFilter("autoEntities");
    const topics = extractAndFilter("autoTopics");
    const keywords = extractAndFilter("autoKeywords");
    const types = extractAndFilter("autoTypes");


    const uniqueEntities = Array.from(new Set(entities));
    const uniqueTopics = Array.from(new Set(topics));
    const uniqueKeywords = Array.from(new Set(keywords));
    const uniqueTypes = Array.from(new Set(types));

    return {
        entities: uniqueEntities as string[],
        topics: uniqueTopics as string[],
        keywords: uniqueKeywords as string[],
        types: uniqueTypes as string[]
    };
}


const buildSiteContext = async (
    defaultContext: SiteContextConfig,
    siteContentSummary: string,
    availableContentTypes: string[],
): Promise<SiteContext> => {
    console.log("Building site context");
    console.log("1. Getting auto fields");
    const {topics, entities, keywords, types: imageTypes} = await unbodyService.getAutoFields();
    console.log(`Got ${topics.length} topics, ${entities.length} entities, ${keywords.length} keywords, ${imageTypes.length} image types`);

    console.log("3. Generating site context");
    console.log("3.1 Generating site essentials");
    const essentials: SiteContextConfig = await unbody.get
        .textBlock
        .limit(1)
        .generate
        .fromOne(
            siteEssentialsPrompt.create(
                topics,
                entities,
                siteContentSummary,
                availableContentTypes,
                defaultContext
            ),
        )
        .exec()
        .then(({data: {generate}}) => {
            return siteEssentialsPrompt.parse(generate[0].result) as SiteContextConfig;
        })
        .catch((e) => {
            console.error("Error generating site essentials", e);
            return {};
        });


    let context: SiteContext = {
        siteType: essentials.siteType || defaultContext.siteType || SiteType.BLOG,
        title: essentials.title||defaultContext.title||"Nexlog",
        autoEntities: entities,
        autoKeywords: keywords,
        autoTopics: topics,
        contributors: essentials.contributors || defaultContext.contributors || [],
        seoDescription: essentials.seoDescription || defaultContext.seoDescription || "",
        seoKeywords: essentials.seoKeywords || defaultContext.seoKeywords || [],
        autoSummary: "",
        contentSummary: siteContentSummary,
        availableContentTypes,
    };

    console.log("3.2 Generating site summary intro");
    const summary = await unbody.get
        .textBlock
        .limit(1)
        .generate
        .fromOne(
            siteSummaryPrompt.create(
                topics,
                entities,
                siteContentSummary,
                availableContentTypes,
                context
            ),
        )
        .exec()
        .then(({data: {generate}}) => generate[0].result)
        .catch((e) => {
            console.error("Error generating site summary intro", e);
            return "";
        });

    return {
        ...context,
        autoSummary: summary,
    };

}

const populateCategories = async (categories: CategoryRaw[], siteContext: SiteContext): Promise<Category[]> => {
    return Promise.all(categories.map(async (category) => {
        const relatedArticles = await unbodyService.searchAboutOnGoogleDocs<MiniArticle>(
            category.title,
            category.entities,
            category.topics,
            [],
            undefined,
            0.6
        );

        const relatedVideos = await unbodyService.searchAboutOnVideoFiles<IVideoFile>(
            category.title,
            category.entities,
            category.topics,
            [],
            undefined,
            0.6
        );

        const relatedBlocks = await Promise.all([
            unbodyService.searchAboutOnTextBlocks<MiniTextBlock>(
                [
                    category.title,
                    ...category.topics,
                    ...category.entities
                ].join(",")
            ),
            unbodyService.searchAboutOnImageBlocks<ImageBlock>(
                category.title,
                category.entities,
                category.topics,
                [],
                undefined,
                0.6
            )
        ])
            .then((results) =>
                results
                    .flat()
                    .sort((a: ImageBlock | MiniTextBlock, b: ImageBlock | MiniTextBlock) =>
                        b._additional?.certainty - a._additional?.certainty
                    ))

        return {
            ...category,
            articles: relatedArticles,
            videos: relatedVideos,
            blocks: relatedBlocks
        }
    }));
}

const generateCategories = async (siteContext: SiteContext): Promise<CategoryRaw[]> => {
    try {
        const {data: {generate, errors}} = await unbody.get
            .textBlock
            .limit(1)
            .generate
            .fromOne(
                categoriesPrompt.create(siteContext),
            )
            .exec();

        if (errors){
            console.log(errors);
            return []
        }

        if (generate) {
            return categoriesPrompt.parse(generate[0].result);
        } else {
            console.log("No data received");
            return [];
        }
    } catch (e) {
        console.error("Error in generating initial categories", e);
        return [];
    }
}

const searchAboutOnVideoFiles = async <T>(
    q: string | undefined = "",
    entities: string[] = [],
    topics: string[] = [],
    keywords: string[] = [],
    select: any[] = ["remoteId", "autoSummary", "autoKeywords", "autoTopics", "autoEntities"],
    minScore = 0.5
): Promise<T[]> => {
    let query = unbody.get.videoFile.select(...select);

    const tags = [
        ...entities.map(e => ({value: e, type: "autoEntities"})),
        ...topics.map(t => ({value: t, type: "autoTopics"})),
        ...keywords.map(k => ({value: k, type: "autoKeywords"}))
    ]

    if (tags.length > 0) {
        // @ts-ignore
        query = query.where(({Or, ContainsAny}) => {
            return Or(
                ...tags.map(({value, type}) => ({
                    [type]: ContainsAny(value)
                }))
            )
        })
    }

    if (q.trim().length > 0) {
        // @ts-ignore
        query = query.search.about(q, {certainty: minScore})
    }

    const {data: {payload}} = await query.exec();
    return payload as T[];
}


const searchAboutOnGoogleDocs = async <T>(
    q: string | undefined = "",
    entities: string[] = [],
    topics: string[] = [],
    keywords: string[] = [],
    select: any = ["title", "slug", "autoSummary", "modifiedAt", "subtitle"],
    minScore = 0.5
): Promise<T[]> => {
    let query = unbody.get.googleDoc.select(...select);

    const tags = [
        ...entities.map(e => ({value: e, type: "autoEntities"})),
        ...topics.map(t => ({value: t, type: "autoTopics"})),
        ...keywords.map(k => ({value: k, type: "autoKeywords"}))
    ]

    if (tags.length > 0) {
        // @ts-ignore
        query = query.where(({Or, ContainsAny}) => {
            return Or(
                ...tags.map(({value, type}) => ({
                    [type]: ContainsAny(value)
                }))
            )
        })
    }

    if (q.trim().length > 0) {
        // @ts-ignore
        query = query.search.about(q, {certainty: minScore})
    }

    const {data: {payload}} = await query.exec();
    return payload as T[];
}

const searchAboutOnTextBlocks = async <T>(
    q: string | string[],
    select: any[] = ["order", "html", "document.GoogleDoc.slug"],
    minScore = 0.6
): Promise<T[]> => {
    const query = unbody.get
        .textBlock
        .where(({NotEqual, And, ContainsAny}) => {
            return And(
                {tagName: NotEqual("h1")},
                {tagName: NotEqual("h2")},
                {tagName: NotEqual("h3")},
                {classNames: NotEqual("title")},
            )
        })
        .select(...select)
        .search
        .about(q, {certainty: minScore});

    const {data: {payload}} = await query.exec();
    return payload as T[];
}


const searchAboutOnImageBlocks = async <T>(
    q: string | undefined = "",
    entities: string[] = [],
    topics: string[] = [],
    keywords: string[] = [],
    select: any[] = ["order", "html", "document.GoogleDoc.slug"],
    minScore = 0.5
): Promise<T[]> => {
    let query = unbody.get.imageBlock.select(...select);

    const tags = [
        ...entities.map(e => ({value: e, type: "autoEntities"})),
        ...topics.map(t => ({value: t, type: "autoTopics"})),
        ...keywords.map(k => ({value: k, type: "autoKeywords"}))
    ]

    if (tags.length > 0) {
        // @ts-ignore
        query = query.where(({Or, ContainsAny}) => {
            return Or(
                ...tags.map(({value, type}) => ({
                    [type]: ContainsAny(value)
                }))
            )
        })
    }

    const {data: {payload}} = await query.exec();
    return payload as T[];
}

const generateSearchContext = async (contextItems: QueryContextItem[] = [], q?: string): Promise<SearchContextResponse> => {
    const searchMethod = contextItems.length === 0 ? "hybrid" : "hybrid";
    const searchQuery = contextItems.length === 0 && q ? q : contextItems.map(({value}) => value).join(", ");

    const query = unbody.get
        .textBlock
        .select("remoteId", "text")
        .search[searchMethod](searchQuery)
        .limit(10)
        .generate
        .fromMany(
            searchContextPrompt.create(contextItems, q),
            ["text"]
        );

    const {data: {generate: {result}}} = await query.exec();
    return searchContextPrompt.parse<SearchContextResponse>(result);
}


const generateReadPage = async (contextItems: QueryContextItem[] = [], prevPages: ReadPageData[] = [], q: string = ""): Promise<ReadPageResponse> => {
    const searchMethod = contextItems.length === 0 ? "about" : "about";
    const searchQuery = contextItems.length === 0 && q ? q : contextItems.map(({value}) => value).join(", ");
    const emptyQuery = searchQuery.trim().length === 0;

    let query = unbody.get
        .textBlock
        // @ts-ignore
        .select("text", "document.GoogleDoc.slug", "document.GoogleDoc.title", "order", "tagName", "classNames")
        .where(({And, NotEqual}) => {
            return And(
                {tagName: NotEqual("h1")},
                {tagName: NotEqual("h2")},
                {tagName: NotEqual("h3")},
                {classNames: NotEqual("title")},
                {classNames: NotEqual("subtitle")},
                ...prevPages.flatMap(({from}) => {
                    return from.map(({order, document}) => {
                        return And(
                            {order: NotEqual(order)},
                            {document: {GoogleDoc: {slug: NotEqual(document[0].slug)}}}
                        )
                    })
                })
            )
        })

    if (!emptyQuery) {
        // @ts-ignore
        query = query.search[searchMethod](searchQuery)
    }


    const lastPage = prevPages.length > 0 ? prevPages[prevPages.length - 1] : null;
    const lastBlock = lastPage ? lastPage.from[lastPage.from.length - 1] : null;

    const {data: {generate}} = await query
        .limit(3)
        .generate
        .fromMany(
            readContextPrompt.create(contextItems, q, lastBlock, prevPages.length === 0),
            ["text"]
        )
        .exec();
    return generate as any;
}


const askOnGoogleDocs = async (question: string): Promise<any> => {
    const query = await unbody.get
        .googleDoc
        .ask(question);

    const {data: {payload}} = await query.exec();
    return payload;
}

const askOnTextBlocks = async <T>(
    question: string,
    select: any[] = ["order", "html", "document.GoogleDoc.slug", "document.GoogleDoc.title"],
    minScore = 0.7
): Promise<T | null> => {
    const query = await unbody.get
        .textBlock
        .select(...select)
        .additional("certainty")
        .ask(question);

    const {data: {payload}} = await query.exec();
    if (payload.length === 0) return null;
    if (!payload[0]._additional) return null;

    return (
        payload[0]._additional.answer
        && payload[0]._additional.answer.hasAnswer
    ) ? payload[0] as T : null;
}

const getPost = async (slug: string): Promise<IGoogleDoc | null> => {
    const query = unbody.get
        .googleDoc
        .where({slug})
        .select(
            "title",
            "autoTopics",
            "autoSummary",
            "autoKeywords",
            "autoEntities",
            "title",
            "slug",
            "subtitle",
            "toc",
            // @ts-ignore
            "modifiedAt",
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
        )
    const {data: {payload}} = await query.exec();
    return payload[0] as IGoogleDoc || null;
}

const getPostSlugs = async (): Promise<string[]> => {
    const query = unbody.get.googleDoc.select("slug");
    const {data: {payload}} = await query.exec();
    return (payload as IGoogleDoc[]).map(({slug}) => slug as string);
}


export const unbodyService = {
    generateCategories,
    searchAboutOnGoogleDocs,
    searchAboutOnVideoFiles,
    searchAboutOnTextBlocks,
    searchAboutOnImageBlocks,
    generateSearchContext,
    askOnGoogleDocs,
    askOnTextBlocks,
    getPost,
    getPostSlugs,
    getAutoFields,
    generateReadPage,
    buildSiteContext,
    populateCategories
}
