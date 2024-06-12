import {renderPrompt} from "@/utils/prompt-templates/prompt.utils";
import {PromptTemplate} from "@/types/prompt.types";
import {SiteContextConfig} from "@/types/data.types";

export const siteSummaryPrompt: PromptTemplate<string> = {
    create: (
        topics: string[],
        entities: string[],
        content: string,
        dataTypes: string[],
        context: SiteContextConfig
    ) => {
        const intro = [
            `We're making a ${context.siteType} which is about following topics and name entities.`,
            `The content comes from ${dataTypes.length>1? `multiple formats and files including ${dataTypes.join(", ")}.`: `${dataTypes[0]}`}.`,
            `Besides that, here is a list of all the posts and articles we have.`,
            `Analyse the content and given topics and entities, then provide follow the instructions bellow to create a short introduction for the site.`
        ]

        return renderPrompt(
            {
                introduction: intro.join(" "),
                instructions: [
                    `Provided data: ${Object.entries(context).map(([key, value]) => `- ${key}: "${value}"`).join("\n")}`,
                    `Content summary:\n"""\n${content}\n\n"""\n\n`,
                    "Instructions:",
                    "Step 1: Use topics & entities and compose a fluid & engaging short(280-380 chars) paragraph with a smart tone, akin to an editor’s note that invites readers into the blog.",
                    "Step 2: Once you created the intro, then identify all topics and entities as well as their synonyms and related terms and highlight all of them in the introduction by wrapping them in square brackets.",
                ],
                examples: [
                    // "For cohesive and similar topics: \"This blog post is where [topic-1] and [topic-2] come together...\"",
                    // "For numerous and diverse topics: \"Dive into a world where [topic-1, e.g., 'Technology'] meets [topic-2, e.g., 'Art'], [topic-3, e.g., 'Culture'], and beyond...\""
                ],
                output: "output the result in plan text format.\n ignore this line - {tagName}"
            }
        )
    },
    parse: (rawResult: string): string => {
        return rawResult as unknown as string;
    }
}
