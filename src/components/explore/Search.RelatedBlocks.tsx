import { SWRResponse } from 'swr';
import { MiniTextBlock } from '@/types/data.types';
import React from 'react';
import { BlockCard } from '@/components/BlockCard';
import { TextBlockCardBody } from '@/components/TextBlockCard.Body';
import { Button } from '@nextui-org/button';

type ArticleListProps = {
    payload: SWRResponse<MiniTextBlock[], any>;
    pageSize?: number;
};

export const BlockList = (props: ArticleListProps) => {
    const {
        payload: { data, isLoading, error },
        pageSize = 3
    } = props;
    const [page, setPage] = React.useState(1);

    return (
        <div>
            {isLoading && <div>Loading...</div>}
            {error && <div>Error</div>}
            {data && !isLoading && (
                <div className={'flex flex-col gap-4'}>
                    <div className={'grid gap-6 grid-cols-2'}>
                        {data.slice(0, page * pageSize).map((block, index) => (
                            <BlockCard key={index} className={''}>
                                <TextBlockCardBody data={block as MiniTextBlock} />
                            </BlockCard>
                        ))}
                    </div>
                    <div className={'m-auto pt-4 flex gap-4'}>
                        {page * pageSize < data.length && (
                            <Button onClick={() => setPage(page + 1)}>More</Button>
                        )}
                        {page > 1 && (
                            <Button onClick={() => setPage(page - 1)}>Less</Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
