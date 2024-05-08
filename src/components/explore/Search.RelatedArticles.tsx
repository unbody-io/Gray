import { SWRResponse } from 'swr';
import { MiniArticle } from '@/types/data.types';
import React from 'react';
import { ArticleCardBody } from '@/components/ArticleCard.Body';
import { ArticleCard } from '@/components/ArticleCard';

type ArticleListProps = {
    payload: SWRResponse<MiniArticle[], any>;
};

export const ArticleList = (props: ArticleListProps) => {
    const {
        payload: { data, isLoading, error }
    } = props;
    return (
        <div>
            {isLoading && <div>Loading...</div>}
            {error && <div>Error</div>}
            {data && (
                <div className={'flex flex-col gap-2 pt-8'}>
                    {data.map((article, index) => (
                        <ArticleCard key={index} className={`animate-fadeIn`}>
                            <ArticleCardBody data={article} />
                        </ArticleCard>
                    ))}
                </div>
            )}
        </div>
    );
};
