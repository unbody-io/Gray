import {NexlogConfigAll} from "@/types/nexlog.types";
import {gdocDefaultHandler, gDocDefaultSearchResponsePromptHandler} from "@/lib/content-plugins/gdocs";
import {videoFileDefaultHandler, videoFileDefaultSearchResponsePromptHandler} from "@/lib/content-plugins/video-files";
import {SupportedContentTypes} from "@/types/plugins.types";
import {SiteData} from "@/types/data.types";
import {textBlockDefaultHandler, textBlockDefaultSearchResponsePromptHandler} from "@/lib/content-plugins/text-blocks";
import {
    imageBlockDefaultHandler,
    imageBlockDefaultSearchResponsePromptHandler
} from "@/lib/content-plugins/image-blocks";

const defaults: NexlogConfigAll = {
    contentPlugins: [
        gdocDefaultHandler,
        videoFileDefaultHandler,
        textBlockDefaultHandler,
        imageBlockDefaultHandler
    ],
    contentConfig: {
        exclude: [],
        postsPath: "/*/posts/*",
    },
    copy:{
        promptsOutputFormatInstruction: (input) => {
            return `
            **System prompt for the final output**
            - Structured the response in HTML blocks, each block can be paragraphs, code blocks, lists, tables etc.
            - In each block use typographic elements and semantic tags (<a>, <i>, <s> etc)
            - Highlight the relevant keywords, topics and name entities using [] brackets.
            `;
        },
        personaPromptInstruction: (siteData: SiteData) => {
            // here you define the characteristics of the persona of the AI behind your site
            // you can define, tone of voice, the type of responses it should give, etc.
            let prompt =  `You are a ${siteData.context.siteType}. Your job is to make conversation with the user. Responding to their search queries, prompts, instructions and tasks and questions.`

            prompt += `\n
            **Tone of Voice:**\n
            - You always refer to the user as "you" and yourself as "I" or "me".".
            - keep it natural, right to the point yet human.
            - Do not include any of given query or prompt or instruction in the response, For example you should not start the response with "Here is a response to the user's query" or "Here is a response to the user's prompt" etc.`;

            return prompt;
        }
    },
    searchConfig: {
        prompts: [
            {
                type: SupportedContentTypes.VideoFile,
                handler: videoFileDefaultSearchResponsePromptHandler
            },
            {
                type: SupportedContentTypes.GoogleDoc,
                handler: gDocDefaultSearchResponsePromptHandler
            },
            {
                type: SupportedContentTypes.TextBlock,
                handler: textBlockDefaultSearchResponsePromptHandler
            },
            {
                type: SupportedContentTypes.ImageBlock,
                handler: imageBlockDefaultSearchResponsePromptHandler
            }
        ]
    }
}

export default defaults;
