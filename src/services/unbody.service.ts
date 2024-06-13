import {Unbody} from "@unbody-io/ts-client";
import {categoriesPrompt} from "@/utils/prompt-templates/prompt.template.categories";
import {
    AutoFields,
    AutoFieldsRaw,
    Category,
    CategoryRaw,
    ContentBlock,
    Directory,
    ImageBlock,
    MiniArticle,
    MiniTextBlock,
    PostRef,
    ReadPageData,
    ReadPageResponse,
    SiteContext,
    SiteContextConfig,
    SiteData,
    SiteType
} from "@/types/data.types";
import {IGoogleDoc, ISubtitleEntry, IVideoFile} from "@unbody-io/ts-client/build/core/documents";
import {readContextPrompt} from "@/utils/prompt-templates/prompt.template.read-blocks";
import {siteEssentialsPrompt} from "@/utils/prompt-templates/prompt.template.siteEssentials";
import {siteSummaryPrompt} from "@/utils/prompt-templates/prompt.template.intro";
import {SupportedContentTypes} from "@/types/plugins.types";
import {ContentHandler} from "@/lib/content-plugins";
import {groupBy} from "@/lib/content-plugins/utils";
import {ApiTypes} from "@/types/api.type";
import {NexlogConfigAll} from "@/types/nexlog.types";
import {StructuredUserInput, UserInputType} from "@/types/prompt.types";
import * as unbodyUtils from "@/services/unbody.utils";
import {QueryBuilder} from "@unbody-io/ts-client/build/core/query-builder";

if (!process.env.UNBODY_API_KEY || !process.env.UNBODY_PROJECT_ID) {
    throw new Error("UNBODY_API_KEY and UNBODY_PROJECT_ID must be set");
}

export const unbody = new Unbody({
    apiKey: process.env.UNBODY_API_KEY,
    projectId: process.env.UNBODY_PROJECT_ID,
})

export const getAutoFields = async (
    availableContentTypes: SupportedContentTypes[]
): Promise<AutoFields> => {

    let queries = [];
    let fields = {
        entities: [] as string[],
        topics: [] as string[],
        keywords: [] as string[],
        types: [] as string[],
    };

    if (availableContentTypes.includes(SupportedContentTypes.GoogleDoc)) {
        queries.push(
            unbody.get.googleDoc
                .select("autoKeywords", "autoEntities", "autoTopics")
                .group(0.1, "closest")
        );
    }

    if (availableContentTypes.includes(SupportedContentTypes.VideoFile)) {
        queries.push(
            unbody.get.videoFile
                .select("autoKeywords", "autoEntities", "autoTopics")
                .group(0.1, "closest")
        );
    }

    if (availableContentTypes.includes(SupportedContentTypes.ImageBlock)) {
        queries.push(
            unbody.get.imageBlock
                .select("autoTypes")
                .group(0.1, "closest")
        );
    }


    const {data} = await unbody.exec(...queries).catch(e => {
        console.error("Error getting auto fields", e);
        return {data: []}
    })

    // Flatten the payloads and map them to the AutoFields structure
    data
        .flatMap(({payload}) => payload as AutoFieldsRaw[])
        .forEach((autoFields) => {
            fields.entities.push(...(autoFields.autoEntities || []));
            fields.topics.push(...(autoFields.autoTopics || []));
            fields.keywords.push(...(autoFields.autoKeywords || []));
            fields.types.push(...(autoFields.autoTypes || []));
        });

    // Optionally, remove duplicates from each field
    fields.topics = Array.from(new Set(fields.topics));
    fields.entities = Array.from(new Set(fields.entities));
    fields.keywords = Array.from(new Set(fields.keywords));
    fields.types = Array.from(new Set(fields.types));

    return fields;
}

const buildSiteContext = async (
    defaultContext: SiteContextConfig,
    siteContentSummary: string,
    availableContentTypes: SupportedContentTypes[],
): Promise<SiteContext> => {
    console.log("Building site context");
    console.log("1. Getting auto fields");
    const {topics, entities, keywords, types: imageTypes} = await unbodyService.getAutoFields(
        availableContentTypes
    );
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
            if (!generate || generate.length === 0 || !generate[0].result) {
                throw new Error("Error generating site essentials: no data received");
            }
            const json = siteEssentialsPrompt.parse(generate[0].result) as SiteContextConfig;

            if (!json) {
                throw new Error("Error parsing site essentials");
            }

            console.log("3.2 Got site essentials", json);
            return json;
        })
        .catch((e) => {
            console.error("Error generating site essentials", e);
            return {};
        });


    let context: SiteContext = {
        siteType: essentials.siteType || defaultContext.siteType || SiteType.BLOG,
        title: essentials.title || defaultContext.title || "Nexlog",
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
        .then(({data: {generate}}) => {
            if (!generate || generate.length === 0 || !generate[0].result) {
                throw new Error("Error generating site summary intro: no data received");
            }

            const result = siteSummaryPrompt.parse(generate[0].result);

            if (!result) {
                throw new Error("Error generating site summary intro");
            }

            console.log("3.3 Got site summary intro", result);
            return result;
        })
        .catch((e) => {
            console.error("Error generating site summary intro", e);
            return null;
        });

    return {
        ...context,
        autoSummary: summary,
    };

}

const createDirectories = async (
    allPosts: Array<MiniArticle | IVideoFile>,
    contentPlugins: ContentHandler<any, any>[],
): Promise<Directory[]> => {
    const directoryGroups = groupBy(allPosts,
        ({pathString}) => {
            if (!pathString) return "";
            return (pathString as string).split("/")[1];
        }
    );

    return Promise.all(Object.entries(directoryGroups).map(async ([directory, posts]) => {
        if (directory.trim().length === 0) return null;
        if (posts.length === 0) return null;

        const postRefs = posts.map((post) => {
            const plugin = contentPlugins.find(p => p.type === post.__typename);
            return plugin?.getPostReference(post) as PostRef;
        });

        // The direct file in directory which has the same name as the directory is the directory document
        const directoryDoc = await unbody.get
            .googleDoc
            .where(({
                pathString: `/${directory}/${directory}`
            }))
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
                "blocks.TextBlock.order",
                "blocks.TextBlock.html",
                "blocks.TextBlock.text",
                "blocks.TextBlock.tagName",
                "blocks.TextBlock.classNames",
                "blocks.ImageBlock.order",
                "blocks.ImageBlock.width",
                "blocks.ImageBlock.height",
                "blocks.ImageBlock.url",
                // @ts-ignore
                "blocks.ImageBlock.title",
                "blocks.ImageBlock.alt",
                "blocks.ImageBlock.__typename",
                "blocks.TextBlock.__typename",
                "mentions"
            )
            .exec()
            .then(({data: {payload}}) => payload[0] as IGoogleDoc | null)
            .catch(e => {
                console.error("Error getting directory document", e);
                return null;
            })

        let cover = await unbody.get
            .imageBlock
            .where(({Like}) => ({
                pathString: Like(`/${directory}`)
            }))
            .exec()
            .then(({data: {payload}}) => payload[0])
            .catch(e => {
                console.error("Error getting directory cover", e);
                return null;
            })

        // in case there was not direct image block in the directory, try to get the first image block in the directory
        // @ts-ignore
        cover = cover || directoryDoc?.blocks?.find(b => b.__typename === "ImageBlock");

        return {
            name: directory,
            title: directoryDoc?.title || directory,
            text: directoryDoc?.text || "",
            html: directoryDoc?.html || "",
            autoEntities: directoryDoc?.autoEntities || [],
            autoTopics: directoryDoc?.autoTopics || [],
            autoKeywords: directoryDoc?.autoKeywords || [],
            autoSummary: directoryDoc?.autoSummary || "",
            cover: cover || null,
            items: postRefs,
        }
    })).then((directories) => directories.filter((d) => !!d)) as Promise<Directory[]>;

}

const populateCategories = async (
    categories: CategoryRaw[],
    siteContext: SiteContext,
    plugins: ContentHandler<any, any>[],
    postsPath: string
): Promise<Category[]> => {
    return Promise.all(categories.map(async (category) => {
        const articlesId = plugins.find(p => p.type === SupportedContentTypes.GoogleDoc)?.identifier;
        const videosId = plugins.find(p => p.type === SupportedContentTypes.VideoFile)?.identifier;

        const relatedArticles = await unbodyService.searchAboutOnGoogleDocs<MiniArticle>(
            category.title,
            category.entities,
            category.topics,
            [],
            ["remoteId", "__typename", ...(articlesId ? [articlesId] : [])],
            0.6,
            postsPath
        )
            .catch(e => {
                console.error("Error getting related articles", e);
                return [];
            })

        const relatedVideos = await unbodyService.searchAboutOnVideoFiles<IVideoFile>(
            category.title,
            category.entities,
            category.topics,
            [],
            ["remoteId", "__typename", ...(videosId ? [videosId] : [])],
            0.6,
            postsPath
        )
            .catch(e => {
                console.error("Error getting related videos", e);
                return [];
            })

        const posts = [
            ...relatedArticles,
            ...relatedVideos,
        ];

        return {
            ...category,
            items: posts.map((post) => {
                const plugin = plugins.find(p => p.type === post.__typename);
                return plugin?.getPostReference(post) as PostRef;
            }).filter((p) => !!p)
        } as Category;
    }));
}

const generateCategories = async (siteContext: SiteContext): Promise<CategoryRaw[]> => {
    console.log("Generating categories");
    try {
        const {data: {generate, errors}} = await unbody.get
            .textBlock
            .limit(1)
            .generate
            .fromOne(
                categoriesPrompt.create(siteContext),
            )
            .exec();

        if (errors) {
            console.log(errors);
            return []
        }

        if (generate) {
            const cats = categoriesPrompt.parse(generate[0].result);
            if (cats) return cats;
        } else {
            console.log("No data received");
        }
    } catch (e) {
        console.error("Error in generating initial categories", e);
    }
    return [];
}

const searchAboutOnVideoFiles = async <T>(
    q: string | undefined = "",
    entities: string[] = [],
    topics: string[] = [],
    keywords: string[] = [],
    select: any[] = ["remoteId", "autoSummary", "autoKeywords", "autoTopics", "autoEntities"],
    minScore = 0.5,
    postsPath?: string
): Promise<T[]> => {
    let query = unbody.get.videoFile.select(...select);

    const tags = [
        ...entities.map(e => ({value: e, type: "autoEntities"})),
        ...topics.map(t => ({value: t, type: "autoTopics"})),
        ...keywords.map(k => ({value: k, type: "autoKeywords"}))
    ]

    if (tags.length > 0 || postsPath) {
        // @ts-ignore
        query = query.where(({Or, And, Like, ContainsAny}) => {
            const tagsFilter = Or(
                ...tags.map(({value, type}) => ({
                    [type]: ContainsAny(value)
                }))
            );

            const postsPathFilter = postsPath ? {
                pathString: Like(postsPath)
            } : {};

            if (tagsFilter && postsPathFilter) {
                return And(
                    tagsFilter,
                    postsPathFilter
                )
            } else {
                return tagsFilter || postsPathFilter;
            }
        })
    }

    if (q.trim().length > 0) {
        // @ts-ignore
        query = query.search.about(q, {certainty: minScore})
    }

    const {data: {payload}} = await query.exec();
    return payload as T[];
}


const searchAboutMixed = async ({siteData, siteConfig, input, filters = [], types = []}: {
    siteData: SiteData,
    siteConfig: NexlogConfigAll,
    input: StructuredUserInput,
    filters: string[],
    types?: SupportedContentTypes[]
}): Promise<ApiTypes.Rs.SearchResults> => {
    const queries = siteConfig.contentPlugins
        .filter(p => types.length === 0 || types.includes(p.type))
        .map((plugin) => {
            if (!plugin.searcherQ) {
                console.log("Could not create unbody search query, SearcherQ not available for plugin", plugin.type)
                return null;
            }
            return plugin.searcherQ({
                siteConfig,
                siteData,
                input: {
                    ...input,
                    type: UserInputType.SearchQuery,
                },
                filters
            })
        });

    return unbody
        .exec(...queries)
        .then(({data}) => {
            return data.map(({_original: {data: {Get}}}) => {
                const typeName = Object.keys(Get)[0];
                return {
                    type: typeName,
                    data: Get[typeName]
                }
            }) as ApiTypes.Rs.SearchResults;
        })
}


const searchAboutOnGoogleDocs = async <T>(
    q: string | undefined = "",
    entities: string[] = [],
    topics: string[] = [],
    keywords: string[] = [],
    select: any = ["title", "slug", "autoSummary", "modifiedAt", "subtitle"],
    minScore = 0.5,
    postsPath?: string
): Promise<T[]> => {
    let query = unbody.get.googleDoc.select(...select);

    const tags = [
        ...entities.map(e => ({value: e, type: "autoEntities"})),
        ...topics.map(t => ({value: t, type: "autoTopics"})),
        ...keywords.map(k => ({value: k, type: "autoKeywords"}))
    ]

    if (tags.length > 0 || postsPath) {
        // @ts-ignore
        query = query.where(({And, Or, Like, ContainsAny}) => {
            const tagsFilter = tags.length > 0 ? Or(
                ...tags.map(({value, type}) => ({
                    [type]: ContainsAny(value)
                }))
            ) : null

            const postsPathFilter = !!postsPath ? {
                pathString: Like(postsPath)
            } : null

            if (tagsFilter && postsPathFilter) {
                return And(tagsFilter, postsPathFilter);
            } else {
                return tagsFilter || postsPathFilter;
            }
        })
    }

    if (q.trim().length > 0) {
        // @ts-ignore
        query = query.search.about(q, {certainty: minScore})
    }

    const {data: {payload}} = await query.exec();
    return payload as T[];
}

const searchAboutOnBlocks = async <T>(
    concepts: string | string[],
    selectFieldsForText?: string[],
    selectFieldsForImage?: string[],
    minScore = 0.6,
    postsPath?: string,
): Promise<ContentBlock[]> => {
    return Promise.all([
        unbodyService.searchAboutOnTextBlocks<MiniTextBlock>(
            concepts,
            selectFieldsForText,
            minScore,
            postsPath
        )
            .catch(e => {
                console.error("Error getting related text blocks", e);
                return [];
            }),
        unbodyService.searchAboutOnImageBlocks<ImageBlock>(
            concepts,
            [],
            selectFieldsForImage,
            minScore,
            postsPath
        )
            .catch(e => {
                console.error("Error getting related image blocks", e);
                return [];
            })
    ])
        .then((results) => {
            return results
                .flat()
                .sort((a: ContentBlock, b: ContentBlock) =>
                    b._additional?.certainty - a._additional?.certainty
                ) as ContentBlock[];
        })
}

const searchAboutOnTextBlocks = async <T>(
    q: string | string[],
    select: any[] = ["order", "html", "document.GoogleDoc.slug", "__typename"],
    minScore = 0.6,
    postsPath?: string
): Promise<T[]> => {
    const query = unbody.get
        .textBlock
        .where(({NotEqual, And, Like}) => {
            return And(
                {tagName: NotEqual("h1")},
                {tagName: NotEqual("h2")},
                {tagName: NotEqual("h3")},
                {classNames: NotEqual("title")},
                ...(
                    postsPath ? [{document: {GoogleDoc: {pathString: Like(postsPath)}}}] : []
                )
            )
        })
        .select(...select)
        .search
        .about(q, {certainty: minScore});

    const {data: {payload}} = await query.exec();
    return payload as T[];
}


const searchAboutOnImageBlocks = async <T>(
    q: string | string[] | undefined = "",
    types: string[],
    select: any[] = ["url", "width", "height", "order", "autoCaption", "autoOCR", "document.GoogleDoc.slug", "__typename"],
    minScore = 0.5,
    postsPath?: string
): Promise<T[]> => {
    let query = unbody.get
        .imageBlock
        .search
        .about(q, {certainty: minScore})
        .select(...select);

    if (types.length > 0 || postsPath) {
        // @ts-ignore
        query = query.where(({Or, And, Like, ContainsAny}) => {
            const typesFilter = types.length > 0 ?
                Or(
                    ...types.map((t) => ({
                        autoTypes: ContainsAny(t)
                    }))
                ) : null;

            const postsPathFilter = !!postsPath ? {
                document: {GoogleDoc: {pathString: Like(postsPath)}}
            } : null

            if (typesFilter && postsPathFilter) {
                return And(typesFilter, postsPathFilter)
            } else {
                return typesFilter || postsPathFilter;
            }
        })
    }

    const {data: {payload}} = await query.exec();
    return payload as T[];
}


const searchSubtitles = async ({input, siteConfigs, siteData, filters}: {
    input: StructuredUserInput,
    siteConfigs: NexlogConfigAll,
    siteData: SiteData,
    filters: string[],
}): Promise<ApiTypes.Rs.SearchResults<ISubtitleEntry[]>> => {
    const plugin = siteConfigs.contentPlugins.find(p => p.type === SupportedContentTypes.VideoFile);
    const idKey = plugin?.identifier || "remoteId";

    const {data: {payload}} = await unbody.get
        .subtitleEntry
        .where({
            document: {
                SubtitleFile: {
                    media: {
                        VideoFile: {
                            [idKey]: filters[0]
                        }
                    }
                }
            }
        })
        .limit(100)
        .search
        .about(input.subject_topic)
        .exec();

    return [{
        type: "" as SupportedContentTypes,
        data: payload as ISubtitleEntry[]
    }]
}


const searchSummaryVideo = async ({input, siteConfigs, siteData, filters}: {
    input: StructuredUserInput,
    siteConfigs: NexlogConfigAll,
    siteData: SiteData,
    filters: string[],
}): Promise<ApiTypes.Rs.AISearchSummary<ISubtitleEntry[]>> => {

    const plugin = siteConfigs.contentPlugins.find(p => p.type === SupportedContentTypes.VideoFile);
    const idKey = plugin?.identifier || "remoteId";

    let prompt = siteConfigs.copy.personaPromptInstruction(siteData);
    const outputFormat = input.output_format.length > 0
        ? input.output_format
        : siteConfigs.copy.promptsOutputFormatInstruction(input);

    const subjectTopic = typeof input.subject_topic === "string"
        ? input.subject_topic.split(",")
        : input.subject_topic;


    let query = unbody.get
        .subtitleEntry
        .where({
            document: {
                SubtitleFile: {
                    media: {
                        VideoFile: {
                            [idKey]: filters[0]
                        }
                    }
                }
            }
        })
        .limit(100);

    if(input.requires_search) {
        // @ts-ignore
        query = query.search.about(input.concepts_key_terms.join(", "))
    }

    prompt += `These are a set of subtitles from a video which are related to following keywords:\n`;
    prompt += input.concepts_key_terms.join(", ") + ".\n";
    prompt += `Your task is to: \n`

    if (input.type === UserInputType.SearchQuery) {
        prompt += "Generate a concise overview summary of this search based solely on the provided info. Do not use general knowledge or make assumptions:\n";
    } else if (input.type === UserInputType.Question) {
        prompt += `Answer the following question based on the provided subtitles:\n`;
        prompt += `**Question:** ${input.core_question}\n`;
        prompt += "Use specific information from the records only. If the records do not provide enough information, indicate that more details are needed:\n";
    } else if (input.type === UserInputType.Instruction) {
        prompt += `Follow this instruction using the provided subtitles:\n`;
        prompt += `**Task:** ${input.specific_task}\n`;
        prompt += `**Subject/Topic:** ${subjectTopic}\n`;
        prompt += `**Output Format:** ${outputFormat}\n`;
    } else if (input.type === UserInputType.ComplexTask) {
        prompt += `Complete this complex task using the provided records:\n`;
        prompt += `**Task:** ${input.specific_task}\n`;
        prompt += `**Core Question:** ${input.core_question}\n`;
        prompt += `**Subject/Topic:** ${subjectTopic}\n`;
        prompt += `**Output Format:** ${outputFormat}\n`;
    }

    // prompt += `**additional information about entire ${siteData.context.siteType}**:\n${siteData.context.contentSummary}`;

    const {data: {generate, payload}} = await query
        .generate
        .fromMany(prompt, ["text", "start", "end"])
        .exec();

    return {
        summary: generate.result,
        results: payload
    } as ApiTypes.Rs.AISearchSummary<ISubtitleEntry[]>
}

const searchAIResponse = async (
    siteData: SiteData,
    siteConfig: NexlogConfigAll,
    input: StructuredUserInput,
    minScore?: number,
): Promise<ApiTypes.Rs.AISearchSummary<any>> => {
    const responses = await Promise.all(
        siteConfig.contentPlugins.map(async (plugin) => {
            return plugin.searcher({
                siteConfig,
                siteData,
                input: input,
                forceGenerate: true,
            }).catch((e) => {
                console.error("Error in search plugin", e);
                return null;
            })
        })
    ).then((results) => results.filter((r) => (
        !!r
        && !!r.data
        && !!r.data.generate
        && r.data.generate.result
        && r.data.generate.result.trim().length > 0
    )));

    if (responses.length === 0) {
        return {
            summary: "Sorry but it seems that I could not find any relevant information for your query. Please try again with a different query.",
            results: []
        }
    }

    const intro = siteConfig.copy.personaPromptInstruction(siteData);

    let prompt = `${intro}\n\n`;
    prompt += `In this case, you've already generated multiple responses to the same user input, based on different content types.\n\n`;
    prompt += `**Generated Responses:**\n`;
    prompt += responses.map(({data: {payload, generate}}, i) => {
        const count = payload.length;
        const typeOfDocs = payload[0].__typename;
        return `- Response ${i + 1} (based on ${count} ${typeOfDocs}s): "${generate.result}"`;
    }).join("\n");

    prompt += `Your task is to merge these responses into a concise, single, coherent response. Like a summary\n\n`;
    prompt += `**FYI:** Here is the original user input data in json format:\n`;
    prompt += `${JSON.stringify(input, null, 2)}`;
    prompt += `**additional information about entire ${siteData.context.siteType}**:\n${siteData.context.contentSummary}`;

    // prompt += `**Output Format:** ${outputFormat}\n`;
    prompt += `**Generated Merged Response: (max one short paragraph)**:\n`

    const summary = await unbodyUtils.generate(prompt);

    return {
        summary: summary,
        results: responses.flatMap(({data: {payload}}) => payload)
    }
}

const generateReadPage = async (contextItems: any[] = [], prevPages: ReadPageData[] = [], q: string = ""): Promise<ReadPageResponse> => {
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
    askOnGoogleDocs,
    askOnTextBlocks,
    getPost,
    getPostSlugs,
    getAutoFields,
    generateReadPage,
    buildSiteContext,
    populateCategories,
    createDirectories,
    searchAboutOnBlocks,
    searchAIResponse,
    searchAboutMixed,
    searchSummaryVideo,
    searchSubtitles
}
