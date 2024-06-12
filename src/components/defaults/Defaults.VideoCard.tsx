import React from "react";

import {EnhancedVideoFile} from "@/types/custom.type";
import DefaultCard from "@/components/defaults/Defaults.Card";
import DefaultsVideoCardBody from "@/components/defaults/Defaults.VideoCard.Body";
import {CardProps} from "@nextui-org/react";

type Props = {
    data: EnhancedVideoFile;
} & CardProps;

const DefaultsVideoCard = ({data, ...rest}: Props) => (
    <DefaultCard className={"bg-default-200/100"}
                 {...rest}
    >
        <DefaultsVideoCardBody data={data}/>
    </DefaultCard>
)

export default DefaultsVideoCard;
