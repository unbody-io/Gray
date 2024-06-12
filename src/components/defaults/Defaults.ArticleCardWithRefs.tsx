import React from "react";

import {EnhancedGDoc, EnhancedImageBlock, EnhancedTextBlock} from "@/types/custom.type";
import DefaultCard from "@/components/defaults/Defaults.Card";
import DefaultsArticleCardBodyWithRefs from "@/components/defaults/Defaults.ArticleCard.BodyWithRefs";

type Props = {
    data: EnhancedGDoc|null
    postRefs: (EnhancedTextBlock|EnhancedImageBlock)[]
}

const DefaultsArticleCardWithRefs = ({data, postRefs}: Props) => (
    <DefaultCard className={"bg-default-200/100"}>
        <DefaultsArticleCardBodyWithRefs data={data}
                                         postRefs={postRefs}
        />
    </DefaultCard>
)

export default DefaultsArticleCardWithRefs;
