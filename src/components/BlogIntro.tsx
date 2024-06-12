import React from 'react';
import {TextReveal} from "@/components/TextReveal";
import {InteractiveParagraph} from "@/components/InteractiveParagraph";
import {ESearchMode} from "@/types/ui.types";
import {transformTag} from "@/utils/data.utils";
import clsx from "clsx";

type Props = {
    isStackOpen: boolean
    topics: string[]
    entities: string[]
    keywords: string[]
    summary: string
}

export const BlogIntro = (props: Props) => {
    const {topics, summary, keywords, entities, isStackOpen} = props;
    return (
        <div className={clsx(
            `${isStackOpen ? "blur-md" : ""} transition-all ease-linear duration-1000 min-h-[160px]`,
            "text-gray-800 text-small leading-6",
            "prose"
        )}>
            <TextReveal>
                <InteractiveParagraph text={summary}
                                      alwaysActive={true}
                                      tags={[
                                          ...topics.map((topic) => transformTag(topic, 'topics', ESearchMode.Search)),
                                          ...entities.map((entity) => transformTag(entity, 'entities', ESearchMode.Search)),
                                          ...keywords.map((keyword) => transformTag(keyword, 'keywords', ESearchMode.Search)),
                                      ]}
                />
            </TextReveal>
        </div>
    );
}
