import React from 'react';
import {NameEntity, Topic} from "@/types/data.types";
import {TypeEffect} from "@/components/TypeEffect";
import {TextReveal} from "@/components/TextReveal";
import {InteractiveParagraph} from "@/components/InteractiveParagraph";
import {ESearchMode} from "@/types/ui.types";
import {transformTag} from "@/utils/data.utils";

type Props = {
    isStackOpen: boolean
    text: string
    topics: string[]
    entities: string[]
    keywords: string[]
}

export const BlogIntro = (props: Props) => {
    const {topics, text, keywords, entities, isStackOpen} = props;
    return (
        <div className={`${isStackOpen ? "blur-md" : ""} transition-all max-w-sm p-4 lg:max-w-full sm:max-w-full text-left leading-relaxed  text-center  ease-linear duration-1000 min-h-[160px]`}>
            <TextReveal>
                <InteractiveParagraph  text={text}
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
