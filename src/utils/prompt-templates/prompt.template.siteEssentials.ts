import {parseJsonOutput, renderPrompt} from "@/utils/prompt-templates/prompt.utils";
import {PromptTemplate, StructuredUserInput} from "@/types/prompt.types";
import {SiteContextConfig, SiteType} from "@/types/data.types";
import {getEnumValues} from "@/utils/data.utils";

type RequiredKeys = keyof Omit<SiteContextConfig,
    "autoSummary" |
    "autoKeywords" |
    "autoTopics" |
    "autoEntities" |
    "contentSummary" |
    "availableContentTypes"
>

const instructions: Record<RequiredKeys, any> = {
    contributors: "A list of contributors to the site",
    seoDescription: "A short description of the site",
    seoKeywords: "A list of SEO friendly keywords separated by commas",
    siteType: `One of these values: ${getEnumValues(SiteType).join(", ")}`,
    title: "The title of the site",
}

const examples: SiteContextConfig = {
    contributors: ["John Doe", "Jane Doe"],
    seoDescription: "A site about the latest tech news",
    seoKeywords: ["tech", "news", "latest"],
    siteType: SiteType.BLOG,
    title: "Tech News"
}

const types: Record<RequiredKeys, string> = {
    contributors: `string[]`,
    seoDescription: `string`,
    seoKeywords: `string[]`,
    siteType: `${getEnumValues(SiteType).join("|")}`,
    title: "string"
}

export const siteEssentialsPrompt: PromptTemplate<StructuredUserInput> = {
    create: (
        topics: string[],
        entities: string[],
        content: string,
        dataTypes: string[],
        defaultContext: SiteContextConfig
    ) => {

        let cleanTypes = {...types};
        let cleanInstructions = {...instructions};
        let cleanExamples = {...examples};

        for (const key of Object.keys(dataTypes)) {
            if (defaultContext[key as RequiredKeys]) {
                delete cleanTypes[key as RequiredKeys];
                delete cleanInstructions[key as RequiredKeys];
                delete cleanExamples[key as RequiredKeys];
            }
        }

        return renderPrompt(
            {
                introduction: `We're going to build a web platform which we still not sure what type it can be. Following is a list of all content we have including ${dataTypes.join(",")}. All the content is about or have something to do with the a list of topics (given bellow). Analyse the content and given topics and entities, then provide the required information in the specified format.`,
                instructions: [
                    `Topics: ${topics.join(", ")}`,
                    `Entities: ${entities.join(", ")}`,
                    `Content: ${content}\n`,
                    ...(
                        Object.keys(defaultContext).length > 0 ?
                            [
                                `Apart from this, we also know the following about the site:`,
                                JSON.stringify(defaultContext, null, 2)
                            ]
                            :
                            []
                    ),
                    `The following are the required:`,
                    JSON.stringify(cleanInstructions, null, 2),
                ],
                examples: [
                    JSON.stringify(cleanExamples, null, 2),
                ],
                output: `the output should be in the following JSON format: \`\`\`json\n${JSON.stringify(cleanTypes, null, 2)}\n\`\`\` \n ignore this line - {tagName}`,
            }
        )
    },
    parse: (rawResult: string) => {
        return parseJsonOutput<StructuredUserInput>(rawResult);
    }
}
