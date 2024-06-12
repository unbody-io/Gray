import React, {PropsWithChildren} from "react";
import DefaultCard from "@/components/defaults/Defaults.Card";

const DefaultsBlockCard = ({children}: PropsWithChildren) => (
    (
        <DefaultCard className={"bg-default-200/100 pb-3"}
        >
            {
                children
            }
        </DefaultCard>
    )
)

export default DefaultsBlockCard;
