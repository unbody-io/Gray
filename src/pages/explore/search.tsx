import DefaultLayout from '@/layouts/default';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import {
    AskEndpointResponse,
    MiniArticle,
    MiniTextBlock,
    SearchContextResponse
} from '@/types/data.types';

import { Spacer } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { QaResults } from '@/components/explore/QaResults';
import { SearchContextPanel } from '@/components/explore/Search.Context';

import { SearchResultsList } from '@/components/SearchResult.List';
import { buildQueryUrl } from '@/utils/query.utils';

export default function ExplorePage() {
    const { query: queryParams } = useRouter();
    const [showQaLabel, setShowQaLabel] = React.useState(false);
    const [showRelatedObjects, setShowRelatedObjects] = React.useState(false);

    const [refactoredQueryForArticles, setRefactoredQueryForArticle] = useState(
        queryParams.query
    );
    const [refactoredQueryForBlocks, setRefactoredQueryForBlocks] = useState(
        queryParams.query
    );

    const ask = useSWR<AskEndpointResponse>(
        buildQueryUrl(`/api/search/ask`, queryParams, ['query'])
    );
    const context = useSWR<SearchContextResponse>(
        buildQueryUrl(`/api/search/context`, queryParams, [
            'query',
            'entities',
            'topics',
            'keywords'
        ])
    );

    const relatedArticles = useSWR<MiniArticle[]>(
        buildQueryUrl(
            `/api/search/articles`,
            { ...queryParams, query: refactoredQueryForArticles || queryParams.query },
            ['query', 'entities', 'topics', 'keywords']
        )
    );
    const relatedBlocks = useSWR<MiniTextBlock[]>(
        buildQueryUrl(
            `/api/search/blocks`,
            { ...queryParams, query: refactoredQueryForBlocks || queryParams.query },
            ['query', 'entities', 'topics', 'keywords']
        )
    );

    useEffect(() => {
        // When context data is available, check for conditions to update articleQuery
        if (context.data && context.data.concepts) {
            if (
                !relatedArticles.isLoading &&
                relatedArticles.data &&
                relatedArticles.data.length === 0
            ) {
                setRefactoredQueryForArticle(context.data.concepts);
            }

            if (
                !relatedBlocks.isLoading &&
                relatedBlocks.data &&
                relatedBlocks.data.length === 0
            ) {
                setRefactoredQueryForBlocks(context.data.concepts);
            }
        }
    }, [context.data, relatedArticles.data, relatedArticles.isLoading]);

    return (
        <DefaultLayout>
            <div className={'min-h-[100px]'}>
                {
                    <SearchContextPanel
                        payload={context}
                        onAnimationDone={() => {
                            setShowQaLabel(true);
                            setTimeout(() => {
                                setShowRelatedObjects(true);
                            }, 1000);
                        }}
                    />
                }
                <Spacer y={4} />
                {showQaLabel && context.data && context.data.isQuestion && (
                    <QaResults payload={ask} />
                )}
            </div>
            {<SearchResultsList articles={relatedArticles} blocks={relatedBlocks} />}
        </DefaultLayout>
    );
}
