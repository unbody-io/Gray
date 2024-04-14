import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

import {unbodyService} from "@/services/unbody.service";
import {EMiniArticleKeys, EMiniTextBlockKeys, MiniArticle, MiniTextBlock} from "@/types/data.types";
import {writeFileSync} from "fs";
import {join} from "path";

(async () => {
    const {topics, entities, keywords} = await unbodyService.getAutoFields();
    // Generative data
    const intro = await unbodyService.generateBlogIntro(topics, entities);
    const categories = await unbodyService.generateCategories(topics, entities);

    const categoriesPopulated = await Promise.all(categories.map(async (category) => {
        return {
            ...category,
            articles: await unbodyService.searchAboutOnGoogleDocs<MiniArticle>(
                category.title,
                category.entities,
                category.topics,
                []
            ),

            blocks: await unbodyService.searchAboutOnTextBlocks<MiniTextBlock>(
                [category.title, ...category.topics, ...category.entities].join(",")
            )
        }
    }));

    const siteData = {
        topics,
        entities,
        keywords,
        intro,
        categories: categoriesPopulated
    };


    writeFileSync(join(__dirname, "../../site.data.json"), JSON.stringify(siteData));
})()
