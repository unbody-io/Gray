import {Directory} from "@/types/data.types";
import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import clsx from "clsx";
import {useHover} from "@/utils/ui.utils";
import Link from "next/link";
import {DefaultsTag} from "@/components/defaults/content-blocks/Defaults.Tag";
import {DateIcon, LocationIcon} from "@/components/icons";

type Props = {
    data: Directory
}

export const DirectoryCard = ({data: directory}: Props) => {
    const [ref, isHover] = useHover<HTMLDivElement>();
    const {customData} = directory;

    return (
        <div className={clsx(
            "relative",
            "hover:scale-105 transition-transform duration-300 ease-in-out",
            "w-full h-full",
        )}
             ref={ref}
        >
            <div className={clsx(
                "transition-all duration-300 ease-in-out",
                "rounded-2xl",
                "w-full h-full",
                `absolute`,
                `${isHover? "top-6":"top-0"} left-0`,
                `${isHover? "scale-90": ""}`,
            )}
                 style={{
                     background: `#C6C8CD`
                 }}
            />
            <Card className={clsx(
                "shadow-xl opacity-100",
            )}
                  style={{
                      background: `#C6C8CD`
                    }}
            >
                <CardHeader className={"flex flex-col items-start gap-4"}>
                    {
                        (customData&&customData.type)&&
                        <div className={"absolute top-2 right-2"}>
                            <DefaultsTag data={{
                                type: customData.type,
                                key: customData.type,
                            }}
                                         withLink={false}
                            />
                        </div>
                    }
                    <small className={"text-small text-gray-500"}>
                        {directory.items.length} posts
                    </small>
                    <h3 className={"text-large capitalize text-white leading-6 w-4/5"}
                        style={{
                            height: "100px",
                            overflow: "hidden",
                        }}
                    >
                        {directory.title}
                    </h3>
                    {
                        (customData)&& (
                            <div className={"flex flex-col text-gray-500"}>
                                {
                                    customData.dateValue&&
                                    <div className={"flex items-center gap-2"}>
                                        <DateIcon size={16}
                                                  fill={"gray"}
                                        />
                                        <small>
                                            {customData.dateValue}
                                        </small>
                                    </div>
                                }
                                {
                                    customData.location&&
                                    <div className={"flex items-center gap-2"}>
                                        <div style={{width: "16px"}}
                                             className={"flex items-center justify-center"}
                                        >
                                            <LocationIcon size={13}
                                                          fill={"gray"}
                                            />
                                        </div>
                                        <small>
                                            {customData.location}
                                        </small>
                                    </div>
                                }
                            </div>
                        )
                    }
                </CardHeader>
                <CardBody>
                    <p className={"text-gray-600 text-tiny"}>
                        {directory.autoSummary.split(".").slice(0,1) + "..."}
                    </p>
                </CardBody>
                <CardFooter className={"justify-end"}>
                    <Link href={`/directory/${directory.name}`}>
                        <Button>
                            View
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
