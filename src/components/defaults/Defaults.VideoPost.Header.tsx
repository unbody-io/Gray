import {Link} from "@nextui-org/link";
import {DefaultsTag} from "@/components/defaults/content-blocks/Defaults.Tag";
import React from "react";
import {EnhancedVideoFile} from "@/types/custom.type";
import {Card, Divider} from "@nextui-org/react";
import DefaultsVideoCard from "@/components/defaults/Defaults.VideoCard";
import DefaultCard from "@/components/defaults/Defaults.Card";
import clsx from "clsx";

type Props = {
    data: EnhancedVideoFile;
    headerHeight: number;
}

export const DefaultsVideoPostHeader = ({data, headerHeight}: Props) => (
    <div
        className={clsx(
            "flex flex-col gap-4",
            "p-2 mt-6"
        )}
        style={{
            height: `${headerHeight}px`,
        }}
    >
        <div className={"flex gap-3 items-center"}>
            <DefaultsTag data={{
                type: "entity",
                key: data.speaker as string
            }}
                         withLink={true}
            />
            <Divider orientation={"vertical"}/>
            <div className={"flex gap-1"}>
                {
                    data.autoTopics?.slice(0, 3).map((topic, index) => (
                        <DefaultsTag key={index}
                                     data={{key: topic, type: "topic"}}
                                     withLink={true}
                        />
                    ))
                }
            </div>
        </div>
        <h1 className={"text-xl font-semibold first-letter:capitalize"}>
            {data.title}
        </h1>
        <blockquote className={"text-gray-500 text-xl first-letter:capitalize prose-blockquote"}>
            {data.autoSummary as string}
        </blockquote>
    </div>
)
