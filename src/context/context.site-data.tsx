import {SiteContext, SiteData, SiteType} from "@/types/data.types";
import React, {ComponentType, createContext, ReactNode, useContext, useEffect, useState} from "react";

import initialStateNoType from "../../public/data/site-data.json"
import {SupportedContentTypes} from "@/types/plugins.types";
import {defaultGrayComponents} from "@/config/defaults.ui.configs";
import {loadPluginComponents, transformInitialState} from "@/lib/content-plugins/utils";

export enum GrayContentPluginComponentsKeys {
    list = "list",
    card = "card",
    card_with_refs = "card_with_refs"
}

export type GrayContentPluginComponents = {
    [key in GrayContentPluginComponentsKeys]?: ComponentType<any> | null
}

export type GrayContentPluginComponentsList = {
    [key in SupportedContentTypes]: GrayContentPluginComponents
}

const grayComponentsKeys = Object.keys(GrayContentPluginComponentsKeys).map(k => k.toLowerCase()) as GrayContentPluginComponentsKeys[];

type CustomUiComponentState = {
    component: ComponentType<any> | null,
    loading: boolean
}

export type GrayCustomComponents = {
    [key in SupportedContentTypes]: {
        list: CustomUiComponentState
        card: CustomUiComponentState
        card_with_refs: CustomUiComponentState
    }
}

export type ContextSiteDataState = Omit<SiteData, "context"> & {
    context: Omit<SiteContext, "siteType"> & {
        siteType: SiteType,
    }
    components: {
        perContentType: GrayCustomComponents
    };
};

const initialState = transformInitialState(
    initialStateNoType
);

const attachUiComponentsState = (state: ContextSiteDataState): ContextSiteDataState => {
    const {plugins} = state.configs;

    const components: ContextSiteDataState['components']['perContentType'] =
        Object.keys(SupportedContentTypes).reduce((acc, type) => {
            const contentType = type as SupportedContentTypes;
            const plugin = plugins.find(plugin => plugin.type === contentType);
            // @ts-ignore
            acc[contentType] = {};

            for (const key of grayComponentsKeys) {
                const component = plugin?.uiComponents?.[key];
                acc[contentType][key.toLowerCase() as GrayContentPluginComponentsKeys] = {
                    component: defaultGrayComponents[contentType][key] || null,
                    loading: component != null
                };
            }

            return acc;
        }, {} as ContextSiteDataState['components']["perContentType"]);

    return {
        ...state,
        components: {
            ...state.components,
            perContentType: components
        }
    };
};

const SiteDataContext = createContext<ContextSiteDataState>(
    attachUiComponentsState(initialState)
);

export const SiteDataProvider = ({children}: { children: ReactNode }) => {
    const [state, setState] = useState<ContextSiteDataState>(
        attachUiComponentsState(initialState)
    );

    useEffect(() => {
        const load = async () => {
            const customComponents = await Promise.all(
                state.configs.plugins.map(async (plugin) => {
                    const components = await loadPluginComponents(plugin);
                    if (!components) return;
                    return {type: plugin.type, components};
                })
            )

            for (const cc of customComponents) {
                if (!cc) continue;
                for (const key of grayComponentsKeys) {
                    const component = cc.components[key];
                    if (component) {
                        console.log("Setting component", cc.type, key, component, state)
                        state.components.perContentType[cc.type][key].component = component;
                    }
                    state.components.perContentType[cc.type][key].loading = false;
                }
            }
        };
        // load();
    }, []);

    if (!state) {
        return <div>Loading...</div>;
    }

    return (
        <SiteDataContext.Provider value={state}>
            {children}
        </SiteDataContext.Provider>
    );
};


export const useSiteData = () => {
    const context = useContext(SiteDataContext)
    if (context === undefined) {
        throw new Error('useSiteData must be used within a SiteDataProvider')
    }
    return context
}
