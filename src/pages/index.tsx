import type { InferGetStaticPropsType, GetStaticProps } from 'next';
import DefaultLayout from '@/layouts/default';
import React from 'react';
import { SiteData } from '@/types/data.types';
import { BlogIntro } from '@/components/BlogIntro';
import { CategoryList } from '@/components/CategoryList';
import { readSiteData } from '@/services/data.service';

type IndexPageProps = {} & SiteData;

export default function Page(props: InferGetStaticPropsType<typeof getStaticProps>) {
    const { topics, entities, keywords, categories, intro } = props;
    const [isCatListOpen, setIsCatListOpen] = React.useState(false);

    return (
        <DefaultLayout>
            <section>
                <BlogIntro
                    entities={entities}
                    topics={topics}
                    keywords={keywords}
                    isStackOpen={isCatListOpen}
                    text={intro}
                />
            </section>
            <section>
                <CategoryList
                    categories={categories}
                    onOpen={(index) => setIsCatListOpen(true)}
                    onClosed={() => setIsCatListOpen(false)}
                />
            </section>
        </DefaultLayout>
    );
}

export const getStaticProps = (async (context) => {
    const siteData = await readSiteData();
    return {
        props: {
            ...siteData
        }
    };
}) satisfies GetStaticProps<IndexPageProps>;
