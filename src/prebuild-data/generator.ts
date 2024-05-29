import dotenv from "dotenv";
dotenv.config();
dotenv.config({path: ".env.local", override: true});

import {existsSync, writeFileSync} from "fs";
import {join} from "path";
import {readFile} from "fs/promises";

import siteConfigs from "../../site.config.json";

import {unbodyService} from "@/services/unbody.service";

import {SiteData} from "@/types/data.types";
import {NexLogDefaultConfigs} from "@/config";
import {
    CATEGORY_DATA_PATH,
    POSTS_DATA_FOLDER_PATH,
    SITE_DATA_PATH
} from "@/prebuild-data/configs";
import {createPostsSummary, readExistingPosts, saveToPublicData} from "@/prebuild-data/utils";


(async () => {
    const records: {
        type: string;
        posts: any[];
        summary: string;
    }[]= await Promise.all(NexLogDefaultConfigs.contentPlugins.map(async plugin => {

        // read existing data
        const existingPosts = await readExistingPosts(plugin);

        console.log(`Fetching ${plugin.type}`);
        const rawPosts = await plugin.fetcher();
        console.log(`Got ${rawPosts.length} ${plugin.type}`);

        console.log(`Enhancing ${plugin.type}`);
        const posts = await Promise.all(
            rawPosts.map(async (newPost) => {
                const existingPost = existingPosts.find(
                    post => post[plugin.identifier] === newPost[plugin.identifier]
                );
                // if existing post is found, and it is same as new post, then skip
                if (existingPost && plugin.comparator(existingPost, newPost)) {
                    return existingPost;
                }
                return await plugin.enhancer(newPost);
            })
        );
        console.log(`Enhanced ${plugin.type}`);

        await saveToPublicData(
            join(POSTS_DATA_FOLDER_PATH, `${plugin.type}.json`),
            posts
        );

        return {
            type: plugin.type,
            posts: posts,
            summary: createPostsSummary(plugin, posts)
        };
    })).then(records => records.filter(record => record.posts.length > 0));

    const contentSummary = records.map(({summary}) => summary).join("\n\n");
    const availableContent = records.map(({type}) => type);

    const siteContext = await unbodyService.buildSiteContext(
        siteConfigs.siteData,
        contentSummary,
        availableContent,
    );

    const categories = await unbodyService.generateCategories(
        siteContext
    );
    const populatedCategories = await unbodyService.populateCategories(
        categories,
        siteContext
    );

    const siteData: SiteData = {
        categories: populatedCategories,
        context: siteContext,
        socials: siteConfigs.socials || [],
    };

    await saveToPublicData( CATEGORY_DATA_PATH, populatedCategories);
    await saveToPublicData(SITE_DATA_PATH, siteData);
})()
