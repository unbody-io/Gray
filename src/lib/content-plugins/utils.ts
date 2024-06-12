import {ComponentType} from "react";
import {HandlerPublicConfigs, UiComponents} from "@/lib/content-plugins/handler.class";
import dynamic from "next/dynamic";
import {ContextSiteDataState, NexlogContentPluginComponents} from "@/context/context.site-data";
import {SiteType} from "@/types/data.types";

export const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
    list.reduce((previous, currentItem) => {
        const group = getKey(currentItem);
        if (!previous[group]) previous[group] = [];
        previous[group].push(currentItem);
        return previous;
    }, {} as Record<K, T[]>);



export const loadPluginComponents = async (plugin: HandlerPublicConfigs)
    : Promise<NexlogContentPluginComponents> => {
    const components: { [key in keyof UiComponents<string>]: ComponentType<any> | null } =
        Object.keys(plugin.uiComponents || {}).reduce((acc, key) => {
            acc[key as keyof UiComponents<string>] = null;
            return acc;
        }, {} as any);

    if (!plugin.uiComponents) return {};

    const keys = Object.keys(plugin.uiComponents) as (keyof UiComponents<string>)[];
    if (keys.length === 0) return {};

    for (const key of keys as (keyof UiComponents<string>)[]) {
        const componentPath = plugin.uiComponents[key];
        if (!componentPath) continue;
        try {
            components[key] = await dynamic(() => import(componentPath).then((module) => module.default)) as ComponentType<any>;
        } catch {
            console.error(`Failed to load component for ${plugin.type} ${key}`);
            console.log("Skipped, going with default component.");
        }
    }

    return components;
};


export const transformInitialState = (data: any): ContextSiteDataState => {
    return {
        ...data,
        context: {
            ...data.context,
            siteType: data.context.siteType as SiteType,
        }
    };
};
