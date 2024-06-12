import {NexlogConfigAll} from "@/types/nexlog.types";
import customConfigs from "../../nexlog.config";
import {nexLogDefaultConfigs} from "@/config";

export const getConfigs = (): NexlogConfigAll => {
    const contentPlugins =
        customConfigs.contentPlugins ?
            nexLogDefaultConfigs.contentPlugins.map(defaultPlugin => {
                const customPlugin = customConfigs.contentPlugins?.find(
                    customPlugin => customPlugin.type === defaultPlugin.type
                );
                return customPlugin || defaultPlugin;
            })
            : nexLogDefaultConfigs.contentPlugins;

    const contentConfig =
        customConfigs.contentConfig ?
            {
                ...nexLogDefaultConfigs.contentConfig,
                ...customConfigs.contentConfig
            }
            : nexLogDefaultConfigs.contentConfig;

    const searchConfig =
        customConfigs.searchConfig ?
            {
                ...nexLogDefaultConfigs.searchConfig,
                prompts: [
                    ...nexLogDefaultConfigs.searchConfig.prompts.filter(p => {
                        return !customConfigs.searchConfig?.prompts.find(cp => cp.type === p.type);
                    }),
                    ...customConfigs.searchConfig.prompts
                ]
            }
            : nexLogDefaultConfigs.searchConfig;

    const personaConfig = {
        ...nexLogDefaultConfigs.copy,
        ...customConfigs.copy
    }

    return {
        contentPlugins,
        contentConfig,
        searchConfig,
        copy: personaConfig
    };
}
