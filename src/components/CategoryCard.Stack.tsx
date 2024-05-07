import React, { useEffect } from 'react';
import { Category, MiniTextBlock } from '@/types/data.types';
import { Article_CARD_HEIGHT } from '@/config/ui.config';
import { CategoryHeadCard } from '@/components/CategoryCard.Header';
import { ArticleCard } from '@/components/ArticleCard';
import { ArticleCardBody } from '@/components/ArticleCard.Body';
import { CardStack } from '@/components/CardStack';
import { BlockList } from '@/components/explore/Search.RelatedBlocks';
import { SWRResponse } from 'swr';

type Props = {
    data: Category;
    onOpen?: () => void;
    openIndex: number;
    index: number;
    delay?: number;
};

export const CategoryCardStack = (props: Props) => {
    const {
        data: { articles, blocks },
        onOpen,
        openIndex = -1,
        index,
        delay = 1000
    } = props;

    const isOneOfStacksOpen = openIndex > -1;
    const isOpen = openIndex === index;

    const onStackClicked = () => {
        if (onOpen) {
            // Only toggle if either no stack is open or the clicked stack is already open
            if (!isOneOfStacksOpen || index === openIndex) {
                onOpen();
            }
        }
    };

    useEffect(() => {}, [isOpen]);

    return (
        <CardStack
            onOpen={onOpen}
            openIndex={openIndex}
            index={index}
            height={Article_CARD_HEIGHT}
            maxStackSize={Math.min(5, articles.length + 2)}
        >
            <CategoryHeadCard
                data={props.data}
                blur={isOneOfStacksOpen && !isOpen}
                open={isOpen}
                onClick={onStackClicked}
                index={index}
                delay={delay}
            />
            {articles.map((article, i) => (
                <ArticleCard
                    key={`a-${i}`}
                    className={`${isOpen ? 'bg-gray-200' : 'bg-default-200/100'}`}
                >
                    {isOpen && <ArticleCardBody data={article} />}
                </ArticleCard>
            ))}
            <ArticleCard
                className={`p-6 ${isOpen ? 'bg-content1' : 'bg-default-200/100'}`}
                style={{
                    height: isOpen ? 'auto' : 'auto',
                    overflow: isOpen ? 'auto' : 'hidden'
                }}
            >
                {isOpen && (
                    <div>
                        <div className={'text-sm pb-4'}>Related content blocks</div>
                        <BlockList
                            payload={
                                {
                                    data: blocks,
                                    isLoading: false,
                                    error: undefined
                                } as SWRResponse<MiniTextBlock[], any>
                            }
                            pageSize={2}
                        />
                    </div>
                )}
            </ArticleCard>
        </CardStack>
    );
};
