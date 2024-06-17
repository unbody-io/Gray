import {Category} from "@/types/data.types";
import {Card, CardFooter, CardHeader} from "@nextui-org/react";
import clsx from "clsx";
import {Button} from "@nextui-org/button";
import React, {PropsWithChildren, useMemo} from "react";
import {Article_CARD_HEIGHT} from "@/config/ui.config";
import {LineSkeleton} from "@/components/skeletons";
import {LoadingIcon} from "@/components/icons";
import {SupportedContentTypes} from "@/types/plugins.types";
import {convertPostTypeToLabel} from "@/utils/copy.utils";
import {articleCardBaseClasses} from "@/components/defaults/Defaults.Card";

type HeadCardProps = {
    data: Category
    blur?: boolean
    open: boolean
    onClick?: () => void

    index: number
    delay: number
}

export type UseCatHeadAnimationsState = {
    showText: boolean
    showStatus: boolean
}


const Status = ({children}: PropsWithChildren) => (
    <div className="text-tiny text-gray-500 flex-row flex">
        {children}
    </div>
)

const StatusSkeleton = () => (
    <div className="flex flex-row gap-1 w-full mb-1">
        <LineSkeleton className={"w-[50px] h-[14px] bg-gray-200"}/>
        <LineSkeleton className={"w-[12px] h-[14px] bg-gray-200"}/>
        <LineSkeleton className={"w-[50px] h-[14px] bg-gray-200"}/>
    </div>
)

const TitleSkeleton = () => (
    <LineSkeleton className={"w-3/5 h-5 bg-gray-200"}/>
)

const FooterSkeleton = () => (
    <LineSkeleton className={"w-4/5 h-3 bg-gray-200 mt-6"}/>
)


const useCatHeadAnimations = (index: number, delay: number): UseCatHeadAnimationsState => {
    const [isMounted, setIsMounted] = React.useState<boolean>(false);
    const [state, setState] = React.useState<UseCatHeadAnimationsState>({
        showText: false,
        showStatus: false
    });

    React.useEffect(() => {
        setIsMounted(true)
    });

    React.useEffect(() => {
        if (!isMounted) {
            setTimeout(() => {
                setState(prev => ({...prev, showText: true}))
            }, delay);
            setTimeout(() => {
                setState(prev => ({...prev, showStatus: true}))
            }, 500 * (index + 1) + delay);
        }
    }, [index]);

    return state;
}

const NumbersSkeleton = () => (
    <LoadingIcon className={"animate-spin h-2 w-2 text-current"}/>
)

export const CategoryHeadCard = (props: HeadCardProps) => {
    const {
        data: {title, summary},
        onClick,
        open,
        index,
        delay
    } = props;

    const {showText, showStatus} = useCatHeadAnimations(index, delay);

    const counts: Record<SupportedContentTypes, number> = useMemo(() => {
        return props.data.items.reduce((acc, item) => {
            acc[item.__typename] = (acc[item.__typename] || 0) + 1;
            return acc;
        }, {} as Record<SupportedContentTypes, number>)
    }, [props.data.items]);

    return (
        <Card className={clsx([
            articleCardBaseClasses,
            "cursor-pointer select-none",
            `${open ? "bg-default-900 text-gray-300" : "bg-default-200/100"}`,
            `${open ? "hover:bg-default-900/90" : "hover:bg-default-200/80"}`,
        ])}
              style={{
                  height: `${Article_CARD_HEIGHT}px`,
                  zIndex: 100,
              }}
        >
            <CardHeader className="flex-col items-start mb-0 pb-0" onClick={onClick}>
                <Status>
                    {
                        Object.keys(counts).map((key, i) => (
                            <div key={i} className={"flex flex-row gap-1 justify-center items-center"}>
                            <span className={"text-gray-500"}>
                                {counts[key as SupportedContentTypes]} {convertPostTypeToLabel(key as SupportedContentTypes)}
                            </span>
                                {
                                    i < Object.keys(counts).length-1 && (
                                        <span
                                            className={"text-medium text-gray-500 mr-1 inline-block -translate-y-1"}>.</span>
                                    )
                                }
                            </div>
                        ))
                    }
                </Status>
                {
                    showText ?
                        <span className={"text-large capitalize animate-fadeIn"}>
                                {title}
                            </span>
                        :
                        <TitleSkeleton/>
                }
            </CardHeader>
            <CardFooter className={"justify-between"}>
                {
                    showText ?
                        <>
                            <span className={"text-sm text-gray-500 animate-fadeIn first-letter:capitalize"}>{summary}</span>
                            <Button color={"default"}
                                    size={"sm"}
                                    onClick={onClick}
                            >
                                {open ? "Close" : "Explore"}
                            </Button>
                        </>
                        :
                        <FooterSkeleton/>
                }
            </CardFooter>
        </Card>
    )
}
