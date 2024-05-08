import React from 'react';
import { SearchContextResponse } from '@/types/data.types';
import { SWRResponse } from 'swr';
import { InteractiveParagraph } from '@/components/InteractiveParagraph';
import { TextReveal } from '@/components/TextReveal';

type SearchContextProps = {
    onAnimationDone?: () => void;
    payload: SWRResponse<SearchContextResponse, any>;
};

export const SearchContextPanel = (props: SearchContextProps) => {
    const {
        payload: { data, isLoading }
    } = props;

    return (
        <div className={'text-default-600 min-h-[130px]'}>
            {
                <TextReveal withDefaultSkeleton={true}>
                    <InteractiveParagraph
                        text={data && !isLoading ? data.introduction : ''}
                        tags={[]}
                        alwaysActive={true}
                    />
                </TextReveal>
            }
        </div>
    );
};

SearchContextPanel.defaultProps = {
    onAnimationDone: () => {}
};
