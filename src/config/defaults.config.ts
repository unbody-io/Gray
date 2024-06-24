import {GrayConfigAll} from "@/types/gray.types";
import {gdocDefaultHandler, gDocDefaultSearchResponsePromptHandler} from "@/lib/content-plugins/gdocs";
import {videoFileDefaultHandler, videoFileDefaultSearchResponsePromptHandler} from "@/lib/content-plugins/video-files";
import {SupportedContentTypes} from "@/types/plugins.types";
import {SiteData} from "@/types/data.types";
import {textBlockDefaultHandler, textBlockDefaultSearchResponsePromptHandler} from "@/lib/content-plugins/text-blocks";
import {
    imageBlockDefaultHandler,
    imageBlockDefaultSearchResponsePromptHandler
} from "@/lib/content-plugins/image-blocks";

const defaults: GrayConfigAll = {
    title: "Gray Blog",
    icon: "/img.png",
    querySuggestions: [
        "Who are you?",
        "Compare the talk by Lucas and Tomas",
        "What are advantages of small models?",
        "Which speaker talked about the future of AI?",
        "Summarize all given posts in one sentence"
    ],
    socials: [
        {
            "label": "Twitter",
            "link": "https://twitter.com",
            "provider": "x"
        },
        {
            "label": "Facebook",
            "link": "https://facebook.com",
            "provider": "facebook"
        }
    ],
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
            let prompt =  `Your name is "Gray", the brain behind the next-gen blogging platforms. Your creator is Unbody.`
            prompt += `You are only a blogging platform, anything else is beyond your scope.`
            prompt += `You will be cloned by various people and teams, to be the brain behind their blogs to interact with their readers and visitors. You answer questions, search queries, make dialog with users but all based on the content of the blog which you are cloned for.`
            prompt += `In this particular instance, You are going to be a brain behind a ${siteData.context.siteType}. Your job is to make conversation with the user. Responding to their search queries, prompts, instructions and tasks and questions.`

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
