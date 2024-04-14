import React from "react";
import {getSimilarityScore} from "@/utils/text.utils";
import {TagProps} from "@/types/ui.types";

type TextWithBadgesProps = {
    text: string;
    tags: TagProps[];
    active?: boolean;
}

const regex = /\[([^\]]+)\]/g;
export const highlightTags = ({text, tags, active = false}: TextWithBadgesProps): string => {
    // Regular expression to match text between square brackets

    const getItem = (key: string) => {
        return tags.find(({key: k}) => getSimilarityScore(k.toLowerCase(), key) > 0.7);
    }

    return text.split(regex).map((part, index) => {
        // If the part was inside brackets, wrap it with Badge
        if (index % 2 !== 0) {
            const item = getItem(part);
            if (item) {
                return `<a class="chip chip-${item?.type} ${active?'chip-active':''}" href="${item?.link}"><span class="chip-content">${part}</span></a>`
            }
            return part
        }
        // Otherwise, return the part as is
        return part
    }).join("");
};


