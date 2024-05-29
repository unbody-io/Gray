import {ParagraphSkeleton} from "@/components/skeletons";
import {TypeAnimation} from "react-type-animation";
import React, {useEffect, useState} from "react";
import {SearchContextResponse} from "@/types/data.types";
import {SWRResponse} from "swr";
import {TypeEffect} from "@/components/TypeEffect";
import {InteractiveParagraph} from "@/components/InteractiveParagraph";
import {TextReveal} from "@/components/TextReveal";


type SearchContextProps = {
    onAnimationDone?: () => void;
    payload: SWRResponse<SearchContextResponse, any>;
}

export const SearchContextPanel = (props: SearchContextProps) => {
    const {
        onAnimationDone = () => {},
        payload: {data, isLoading, error}
    } = props;

    return (
        <div className={"text-default-600 min-h-[130px]"}>
            {
                <TextReveal withDefaultSkeleton={true}
                            onTransitionEnd={onAnimationDone}
                >
                    <InteractiveParagraph text={data&&!isLoading? data.introduction : ""}
                                          tags={[]}
                                          alwaysActive={true}
                    />
                </TextReveal>
            }
        </div>
    )
}
