import { Category } from '@/types/data.types';
import { Card, CardFooter, CardHeader } from '@nextui-org/react';
import clsx from 'clsx';
import { Button } from '@nextui-org/button';
import React, { PropsWithChildren } from 'react';
import { Article_CARD_HEIGHT } from '@/config/ui.config';
import { articleCardBaseClasses } from '@/components/ArticleCard';
import { LineSkeleton } from '@/components/skeletons';
import { LoadingIcon } from '@/components/icons';

type CategoryHeadCardProps = {
    data: Category;
    blur?: boolean;
    open: boolean;
    onClick?: () => void;
    index: number;
    delay: number;
};

export type UseCatHeadAnimationsState = {
    showText: boolean;
    showStatus: boolean;
};

const Status = ({ children }: PropsWithChildren) => (
    <div className='text-tiny text-gray-500 flex-row flex'>{children}</div>
);

const TitleSkeleton = () => <LineSkeleton className={'w-3/5 h-5 bg-gray-200'} />;

const FooterSkeleton = () => <LineSkeleton className={'w-4/5 h-3 bg-gray-200 mt-6'} />;

const useCatHeadAnimations = (
    index: number,
    delay: number
): UseCatHeadAnimationsState => {
    const [isMounted, setIsMounted] = React.useState<boolean>(false);
    const [state, setState] = React.useState<UseCatHeadAnimationsState>({
        showText: false,
        showStatus: false
    });

    React.useEffect(() => {
        setIsMounted(true);
    });

    React.useEffect(() => {
        if (!isMounted) {
            setTimeout(() => {
                setState((prev) => ({ ...prev, showText: true }));
            }, delay);
            setTimeout(() => {
                setState((prev) => ({ ...prev, showStatus: true }));
            }, 500 * (index + 1) + delay);
        }
    }, [index]);

    return state;
};

const NumbersSkeleton = () => (
    <LoadingIcon className={'animate-spin h-2 w-2 text-current'} />
);

export const CategoryHeadCard = (props: CategoryHeadCardProps) => {
    const {
        data: { title, summary, articles, blocks },
        onClick,
        open,
        index,
        delay
    } = props;
    const { showText, showStatus } = useCatHeadAnimations(index, delay);

    return (
        <Card
            className={clsx([
                articleCardBaseClasses,
                'cursor-pointer select-none',
                `${open ? 'bg-default-900 text-gray-300' : 'bg-default-200/100'}`,
                `${open ? 'hover:bg-default-900/90' : 'hover:bg-default-200/80'}`
            ])}
            style={{
                height: `${Article_CARD_HEIGHT}px`,
                zIndex: 100
            }}
        >
            <CardHeader className='flex-col items-start mb-0 pb-0' onClick={onClick}>
                <Status>
                    <div className={'flex flex-row gap-1 justify-center items-center'}>
                        <span>{showStatus ? articles.length : <NumbersSkeleton />}</span>
                        <span className={'text-gray-500'}> Articles</span>
                    </div>
                    <div className={'mr-1'}>,</div>
                    <div className={'flex flex-row gap-1 justify-center items-center'}>
                        <span>{showStatus ? blocks.length : <NumbersSkeleton />}</span>
                        <span className={'text-gray-500'}> Blocks</span>
                    </div>
                </Status>
                {showText ? (
                    <span className={'text-large capitalize animate-fadeIn'}>
                        {title}
                    </span>
                ) : (
                    <TitleSkeleton />
                )}
            </CardHeader>
            <CardFooter className={'justify-between'}>
                {showText ? (
                    <>
                        <span className={'text-sm text-gray-500 animate-fadeIn'}>
                            {summary}
                        </span>
                        <Button color={'default'} size={'sm'} onClick={onClick}>
                            {open ? 'Close' : 'Explore'}
                        </Button>
                    </>
                ) : (
                    <FooterSkeleton />
                )}
            </CardFooter>
        </Card>
    );
};

CategoryHeadCard.defaultProps = {
    blur: false,
    onClick: undefined
};
