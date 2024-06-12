import {Chip} from "@nextui-org/chip";
import React from "react";
import {TagProps} from "@/types/ui.types";
import Link from "next/link";
import clsx from "clsx";

type Props = {
    onDelete?: () => void;
    withLink?: boolean;
    data: TagProps
}


const Tag = ({data, withLink, ...rest}: Props) => (
    <Chip size={"sm"}
          variant={"bordered"}
          className={clsx(
              "border-small",
              "backdrop-blur-sm",
              "hover:bg-gray-800 hover:text-gray-100 transition-all",
          )}
          onClose={rest.onDelete}
          {...rest}
    >
        {data.key}
    </Chip>
)

export const DefaultsTag = ({data, withLink, ...rest}: Props) => {
    if (withLink){
        return (
            <Link href={`/explore/search?filters=${encodeURIComponent(data.key)}`}>
                <Tag data={data}{...rest}/>
            </Link>
        )
    }

    return (
        <Tag data={data}{...rest}/>
    )
}
