import React from "react";
import {Skeleton} from "@nextui-org/react";

export const LineSkeleton = ({className}: {className: string}) => (
    <Skeleton className={`${className} rounded-lg`}>
        <div className={`${className} rounded-lg bg-default-200`}/>
    </Skeleton>
)

export const ParagraphSkeleton = () => (
    <div className="space-y-2 w-full">
        <LineSkeleton className="w-4/5 h-5"/>
        <LineSkeleton className="w-5/5 h-5"/>
        <LineSkeleton className="w-3/5 h-5"/>
    </div>
)
