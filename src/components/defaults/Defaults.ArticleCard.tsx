import React from "react";

import {EnhancedGDoc} from "@/types/custom.type";
import DefaultsArticleCardBody from "@/components/defaults/Defaults.ArticleCard.Body";
import DefaultCard from "@/components/defaults/Defaults.Card";

type Props = {
    data: EnhancedGDoc;
}

const DefaultsArticleCard = ({data}: Props) => (
    <DefaultCard className={"bg-default-200/100 pb-3"}>
        <DefaultsArticleCardBody data={data}/>
    </DefaultCard>
)

export default DefaultsArticleCard;
