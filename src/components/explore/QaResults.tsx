import { TypeAnimation } from 'react-type-animation';
import { Divider, Progress, Spacer } from '@nextui-org/react';
import { Link } from '@nextui-org/link';
import React from 'react';
import { SWRResponse } from 'swr';
import { AskEndpointResponse } from '@/types/data.types';
import { useSearchBar } from '@/context/context.search-bar';
import { BlockCard } from '@/components/BlockCard';
import { ESearchMode } from '@/types/ui.types';

type QaResultsProps = {
    payload: SWRResponse<AskEndpointResponse, any>;
};
export const QaResults = (props: QaResultsProps) => {
    const {
        payload: { data, isLoading }
    } = props;
    const [showQAResult, setShowQAResult] = React.useState(false);
    const { setMode } = useSearchBar();

    const qaAnswer =
        !isLoading &&
        data &&
        data._additional.answer &&
        data._additional.answer.hasAnswer &&
        data._additional.certainty >= 0.7
            ? data!._additional.answer.result
            : null;

    return (
        <div className={''}>
            <TypeAnimation
                sequence={[
                    'Now, let me find an answer from the existing knowledge base:',
                    () => setShowQAResult(true)
                ]}
                speed={75}
                cursor={false}
                className={'text-default-600 mb-1'}
            />
            <Spacer y={4} />
            {showQAResult && isLoading && (
                <Progress
                    size='sm'
                    isIndeterminate
                    aria-label='Loading...'
                    className={'h-[1px]'}
                />
            )}
            {!isLoading && (
                <BlockCard>
                    <blockquote className={'p-6'}>
                        {qaAnswer ? (
                            <div className={'flex flex-col gap-4'}>
                                {data!.document[0].title && (
                                    <span className={'text-tiny'}>
                                        From{' '}
                                        <Link
                                            className={'text-gray-500 text-tiny'}
                                            href={`/posts/${data!.document[0].slug}`}
                                        >
                                            {data!.document[0].title as string}
                                        </Link>
                                    </span>
                                )}
                                <Divider />
                                <blockquote>
                                    <p
                                        className={
                                            'text-md font-medium leading-relaxed indent-6'
                                        }
                                    >
                                        "...{qaAnswer}"
                                    </p>
                                </blockquote>
                            </div>
                        ) : (
                            <div>
                                <span>
                                    It seems that there's not any exact answer match for
                                    your question. Probably you can try the
                                </span>
                                <Link
                                    className={
                                        'hover:text-white cursor-pointer text-gray-50 underline mr-1 ml-1 text-base'
                                    }
                                    onClick={() => setMode(ESearchMode.Read)}
                                >
                                    {ESearchMode.Read} mode
                                </Link>
                                <span>for a more interactive experience.</span>
                            </div>
                        )}
                    </blockquote>
                </BlockCard>
            )}
        </div>
    );
};
