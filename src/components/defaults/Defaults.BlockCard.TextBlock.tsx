import React from "react";

import {EnhancedTextBlock} from "@/types/custom.type";
import DefaultTextBlockCardBody from "@/components/defaults/Defaults.BlockCard.TextBlock.Body";
import DefaultsBlockCard from "@/components/defaults/Defaults.BlockCard";

export const DefaultTextBlockCard = ({data}: { data: EnhancedTextBlock }) => (
    <DefaultsBlockCard>
        <DefaultTextBlockCardBody data={data}/>
    </DefaultsBlockCard>
)
