import type {InferGetStaticPropsType, GetStaticProps} from 'next'
import DefaultLayout from "@/layouts/default";
import React from "react";
import {SiteData} from "@/types/data.types";

import {BlogIntro} from "@/components/BlogIntro";
import {CategoryList} from "@/components/CategoryList";
import {readFile} from "fs/promises";
import {SITE_DATA_PATH} from "@/prebuild-data/configs";
import {DirectoryList} from "@/components/DirectoryList";
import {SectionTitle} from "@/components/SectionTitle";

type IndexPageProps = {
    siteData: SiteData
}

export default function Page(props: InferGetStaticPropsType<typeof getStaticProps>) {
    const {
        siteData: {directories, categories, context},
    } = props;

    const [isCatListOpen, setIsCatListOpen] = React.useState(false);

    return (
        <DefaultLayout>
            {
                context.autoSummary&&
                <section>
                    <BlogIntro entities={context.autoEntities}
                               topics={context.autoTopics}
                               keywords={context.autoKeywords}
                               isStackOpen={isCatListOpen}
                               summary={context.autoSummary}
                    />
                </section>
            }
            <section>
                <SectionTitle>
                    Directories
                </SectionTitle>
                <DirectoryList data={[...directories, ...directories, ...directories, ...directories]} />
            </section>
            <section>
                <SectionTitle>
                    Explore by topic
                </SectionTitle>
                <CategoryList categories={categories}
                              onOpen={() => setIsCatListOpen(true)}
                              onClosed={() => setIsCatListOpen(false)}
                />
            </section>
        </DefaultLayout>
    )
}

export const getStaticProps = (async (context) => {
    const siteData = await readFile(SITE_DATA_PATH, "utf-8").then((data) => JSON.parse(data));
    return {
        props: {
            siteData
        }
    }

}) satisfies GetStaticProps<IndexPageProps>
