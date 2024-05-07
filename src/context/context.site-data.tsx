import { SiteConfigs, SiteData } from '@/types/data.types';
import { createContext, ReactNode, useContext } from 'react';

import siteConfig from '../../site.config.json';
import siteData from '../../site.data.json';

type ContextSiteDataState = {
    siteData: SiteData | undefined;
    siteConfig: SiteConfigs | undefined;
};

const initialState: ContextSiteDataState = {
    // @ts-ignore
    siteData: siteData as SiteData,
    siteConfig: siteConfig as SiteConfigs
};

const SiteDataContext = createContext(initialState);

export const SiteDataProvider = ({ children }: { children: ReactNode }) => {
    return (
        <SiteDataContext.Provider value={initialState}>
            {children}
        </SiteDataContext.Provider>
    );
};

export const useSiteData = () => {
    const context = useContext(SiteDataContext);
    if (context === undefined) {
        throw new Error('useSiteData must be used within a SiteDataProvider');
    }
    return context;
};
