import {ContentHandler} from "@/lib/content-plugins";
import {HandlerPublicConfigs} from "@/lib/content-plugins/handler.class";
import {SearchConfig} from "@/types/plugins.types";
import {SiteData} from "@/types/data.types";
import {StructuredUserInput} from "@/types/prompt.types";

export type GrayConfigAll = {
    title: string;
    icon: string;
    querySuggestions: string[];
    socials: {
        label: string;
        link: string;
        provider: string;
    }[];
    contentPlugins: ContentHandler<any, any>[]
    contentConfig: {
        exclude: string[],
        postsPath: string,
    },
    searchConfig: SearchConfig
    copy: {
        personaPromptInstruction: (siteData: SiteData) => string;
        promptsOutputFormatInstruction: (input: StructuredUserInput) => string;
    }
};

export type GrayConfig = Partial<GrayConfigAll>;

export type GrayConfigData = {
    plugins: HandlerPublicConfigs[];
    contentConfig: {
        exclude: string[],
        postsPath: string,
    },
}

