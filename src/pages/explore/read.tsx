import type { InferGetStaticPropsType, GetStaticProps } from 'next';
import DefaultLayout from '@/layouts/default';
import React, { useEffect } from 'react';
import { readSiteData } from '@/services/data.service';
import { ReadPageData, ReadPageResponse, SiteData } from '@/types/data.types';
import { useRouter } from 'next/router';
import { buildQueryUrl } from '@/utils/query.utils';
import { TextBlock } from '@unbody-io/ts-client/build/types/TextBlock.types';
import { Chip } from '@nextui-org/chip';
import { KeywordChip } from '@/components/keyword-chip';
import { getChipColor } from '@/utils/ui.utils';
import { Button } from '@nextui-org/button';
import { getSimilarityScore } from '@/utils/text.utils';
import { mapNumber } from '@/utils/general.utils';
import { Divider, Tooltip } from '@nextui-org/react';
import Link from 'next/link';
import { ParagraphSkeleton } from '@/components/skeletons';
import { CircularProgress } from '@nextui-org/progress';

type ReadPageProps = {} & SiteData;

const findMostSimilarBlock = (input: string, blocks: TextBlock[]): TextBlock => {
    return blocks.reduce(
        (acc, b) => {
            const score = getSimilarityScore(input, b.text as string);
            return score > acc.score ? { block: b, score } : acc;
        },
        { block: blocks[0], score: 0 }
    ).block;
};

const ReadPageBlock = (props: { block: string; page: ReadPageData }) => {
    const { block, page } = props;
    const mostSimilarBlock = findMostSimilarBlock(block, page.from);

    const sentencesInBlock: string[] = block.split('.');
    const sentencesInMostSimilarBlock = mostSimilarBlock.text.split('.');

    return (
        <p className={''}>
            {sentencesInBlock.map((sentence, i) => {
                // find the highest similarity score in the most similar block sentence
                const highestSimilarity = Math.max(
                    ...sentencesInMostSimilarBlock.map((s) =>
                        getSimilarityScore(sentence, s)
                    )
                );
                const opacity = mapNumber(highestSimilarity, 0, 1, 0.5, 1);

                return (
                    <Tooltip
                        key={i}
                        delay={500}
                        content={
                            <div className='px-1 py-2 text-gray-500'>
                                <div className={'text-tiny'}>
                                    <Chip
                                        color={'default'}
                                        size={'sm'}
                                        className={'text-tiny px-0.5 py-0'}
                                        variant={'dot'}
                                    >
                                        {(highestSimilarity * 100).toFixed()}%
                                    </Chip>
                                    <span> similarity to original text.</span>
                                </div>
                                <div className={'text-gray-500 mt-2'}>
                                    <span>
                                        From: {mostSimilarBlock.document[0].title}
                                    </span>
                                    <br />
                                    <div>
                                        <Link
                                            href={`/posts/${mostSimilarBlock.document[0].slug}#p-${mostSimilarBlock.order}`}
                                            className={'text-blue-500'}
                                        >
                                            Read more
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        }
                    >
                        <span
                            style={{ opacity }}
                            className={`transition-all hover:opacity-100 hover:bg-primary-100 rounded-2xl`}
                        >
                            {sentence}.
                        </span>
                    </Tooltip>
                );
            })}
        </p>
    );
};

type PageProps = {
    data: ReadPageData;
    loading?: boolean;
};

const Page = ({ data, loading = true }: PageProps) => {
    return (
        <div className={'w-full'}>
            {data.result
                .split('\n')
                .filter((b) => b.trim().length > 0)
                .map((block, i) => (
                    <ReadPageBlock block={block} page={data} key={`${i}`} />
                ))}
        </div>
    );
};

export default function ReadPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
    const { topics, entities, keywords } = props;
    const { query: queryParams } = useRouter();
    const [mounted, setMounted] = React.useState<boolean>(false);

    const [pages, setPages] = React.useState<ReadPageData[]>([]);
    const [pagesError, setPagesError] = React.useState<string | null>(null);
    const [pagesLoading, setPagesLoading] = React.useState<boolean>(false);

    const generatePage = async () => {
        if (pagesLoading || !mounted) return;
        setPagesLoading(true);
        setPagesError(null);

        try {
            const { data }: { data: ReadPageResponse | null } = await fetch(
                buildQueryUrl(`/api/read/page`, queryParams, [
                    'entities',
                    'topics',
                    'keywords',
                    'query'
                ]) || '/api/read/page',
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        prevPages: pages
                    })
                }
            ).then((res) => res.json());

            setPagesLoading(false);

            if (!data) {
                setPagesError('Error generating page. Please try again.');
                return;
            }

            console.log(data);
            setPages([...pages, data]);
        } catch (e) {
            setPagesError('Error generating page. Please try again.');
            console.log(e);
        }
    };

    useEffect(() => {
        setPages([]);
        setPagesError(null);
        setPagesLoading(false);
        generatePage();
    }, [queryParams]);

    useEffect(() => {
        if (!mounted) {
            setMounted(true);
        }
    }, []);

    console.log('pages', pages);

    return (
        <DefaultLayout>
            <div className={'flex flex-col gap-4 mt-6'}>
                <p className={'text-sm text-gray-500'}>
                    In this page you can read your own narrative of our blog. Start by
                    either entering a search prompt or selecting a topic of interest, or
                    both.
                </p>
                <div className={'flex flex-wrap gap-2'}>
                    {entities.slice(0, 3).map((e) => (
                        <KeywordChip
                            key={e}
                            color={getChipColor('entities')}
                            text={e}
                            link={`/explore/read?entities=${e}`}
                        />
                    ))}
                    {topics.slice(0, 3).map((t) => (
                        <KeywordChip
                            key={t}
                            color={getChipColor('topics')}
                            text={t}
                            link={`/explore/read?topics=${t}`}
                        />
                    ))}
                    {keywords.slice(0, 3).map((k) => (
                        <KeywordChip
                            key={k}
                            color={getChipColor('keywords')}
                            text={k}
                            link={`/explore/read?keywords=${k}`}
                        />
                    ))}
                </div>
            </div>
            <article
                className={
                    'prose mt-4 prose-img:rounded-xl prose-a:text-blue-600 max-w-screen-md pb-12'
                }
            >
                {pages.map((page, i) => (
                    <>
                        <Page data={page} loading={!mounted && pagesLoading} key={i} />
                        <Divider />
                    </>
                ))}
                <div>
                    {pagesError && <p className={'text-red-500'}>{pagesError}</p>}
                    {pagesLoading && (
                        <div className={'flex flex-col gap-4'}>
                            <div className={'flex flex-row gap-2 items-center'}>
                                <CircularProgress size={'sm'} />
                                <div className={'text-gray-500 text-sm'}>
                                    Crafting your narrative...
                                </div>
                            </div>
                            <div className={'flex flex-col gap-4'}>
                                <ParagraphSkeleton />
                                <ParagraphSkeleton />
                                <ParagraphSkeleton />
                            </div>
                        </div>
                    )}
                    <Button
                        onClick={() => generatePage()}
                        className={`mt-4 `}
                        variant={'flat'}
                        size={'sm'}
                    >
                        {pages.length === 0 ? 'Start Reading' : 'Keep Reading...'}
                    </Button>
                </div>
            </article>
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
}) satisfies GetStaticProps<ReadPageProps>;
