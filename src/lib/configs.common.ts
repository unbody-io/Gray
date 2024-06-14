import {GrayConfigAll} from "@/types/gray.types";
import customConfigs from "../../gray.config";
import {grayDefaultConfigs} from "@/config";

export const getConfigs = (): GrayConfigAll => {
    const contentPlugins =
        customConfigs.contentPlugins ?
            grayDefaultConfigs.contentPlugins.map(defaultPlugin => {
                const customPlugin = customConfigs.contentPlugins?.find(
                    customPlugin => customPlugin.type === defaultPlugin.type
                );
                return customPlugin || defaultPlugin;
            })
            : grayDefaultConfigs.contentPlugins;

    const contentConfig =
        customConfigs.contentConfig ?
            {
                ...grayDefaultConfigs.contentConfig,
                ...customConfigs.contentConfig
            }
            : grayDefaultConfigs.contentConfig;

    const searchConfig =
        customConfigs.searchConfig ?
            {
                ...grayDefaultConfigs.searchConfig,
                prompts: [
                    ...grayDefaultConfigs.searchConfig.prompts.filter(p => {
                        return !customConfigs.searchConfig?.prompts.find(cp => cp.type === p.type);
                    }),
                    ...customConfigs.searchConfig.prompts
                ]
            }
            : grayDefaultConfigs.searchConfig;

    const personaConfig = {
        ...grayDefaultConfigs.copy,
        ...customConfigs.copy
    }

    return {
        contentPlugins,
        contentConfig,
        searchConfig,
        copy: personaConfig
    };
}
