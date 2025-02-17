import dotenv from "dotenv";

dotenv.config();
dotenv.config({path: ".env.local", override: true});

import {unbodyService} from "@/services/unbody.service";
import {SiteContextConfig, SiteData} from "@/types/data.types";

import {
    CATEGORY_DATA_PATH,
    SITE_DATA_PATH
} from "@/prebuild-data/configs";

import {
    saveToPublicData
} from "@/prebuild-data/utils";

import {InitialPostsData} from "@/types/plugins.types";
import {getConfigs} from "@/lib/configs.common";

(async () => {
    // override default configs with custom configs
    const {contentPlugins, contentConfig, ...defaults} = getConfigs();

    const records: InitialPostsData<any>[] = await Promise.all(
        contentPlugins
            .filter(p => p.prefetch)
            .map(async (plugin) => {
                return await plugin.fetchPosts(contentConfig.postsPath);
            }));

    const contentSummary = records.map(({summary}) => summary).join("\n\n");
    const availableContent = records.map(({type}) => type);

    const defaultContext: SiteContextConfig = {
        title: defaults.title,
    }

    const siteContext = await unbodyService.buildSiteContext(
        defaultContext,
        contentSummary,
        availableContent,
    );

    console.log("creating directories")
    const directories = await unbodyService.createDirectories(
        records.flatMap(({posts}) => posts),
        contentPlugins,
        {
            context: siteContext
        } as SiteData
    );
    console.log(`directories: ${directories.length}`)

    const categories = await unbodyService.generateCategories(
        siteContext
    );

    console.log("populating categories");
    const populatedCategories = await unbodyService.populateCategories(
        categories,
        siteContext,
        contentPlugins,
        contentConfig.postsPath
    );

    console.log(populatedCategories.map(({title, items}) => (`${title}: ${items.length}`)));

    const siteData: SiteData = {
        icon: defaults.icon,
        categories: populatedCategories,
        context: siteContext,
        socials: defaults.socials || [],
        directories: directories,
        configs: {
            plugins: contentPlugins.map(plugin => plugin.configs),
            contentConfig: {
                exclude: contentConfig.exclude,
                postsPath: contentConfig.postsPath
            }
        }
    };

    await saveToPublicData(CATEGORY_DATA_PATH, populatedCategories);
    await saveToPublicData(SITE_DATA_PATH, siteData);
})();
