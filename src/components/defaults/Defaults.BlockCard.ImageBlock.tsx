import React from "react";

import {EnhancedImageBlock} from "@/types/custom.type";
import DefaultImageBlockCardBody from "@/components/defaults/Defaults.BlockCard.ImageBlock.body";
import DefaultsBlockCard from "@/components/defaults/Defaults.BlockCard";

const DefaultImageBlockCard = ({data}: { data: EnhancedImageBlock }) => (
    <DefaultsBlockCard>
        <DefaultImageBlockCardBody data={data}/>
    </DefaultsBlockCard>
)

export default DefaultImageBlockCard;
