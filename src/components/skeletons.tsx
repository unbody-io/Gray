import React from "react";
import {Skeleton} from "@nextui-org/react";

export const LineSkeleton = ({className}: {className: string}) => (
    <Skeleton className={`${className} rounded-lg`}>
        <div className={`${className} rounded-lg bg-default-200`}/>
    </Skeleton>
)

export const ParagraphSkeleton = () => (
    <div className="space-y-3 w-full">
        <LineSkeleton className="w-4/5 h-4"/>
        <LineSkeleton className="w-5/5 h-4"/>
        <LineSkeleton className="w-3/5 h-4"/>
    </div>
)
