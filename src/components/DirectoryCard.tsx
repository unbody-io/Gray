import {Directory} from "@/types/data.types";
import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import clsx from "clsx";
import {useHover} from "@/utils/ui.utils";

type Props = {
    data: Directory
}

export const DirectoryCard = ({data: directory}: Props) => {
    const [ref, isHover] = useHover<HTMLDivElement>();
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
                // `gradient-xy bg-gradient-to-r from-gray-400 to-gray-100/10 animate-gradient-xy`,
                // `blur`,
                // "bg-[length:20px_20px] bg-repeat",
                // "py-2",
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
                    <small className={"text-small text-gray-500"}>
                        {directory.items.length} posts
                    </small>
                    <h3 className={"text-large capitalize text-white leading-6 w-4/5"}>
                        {directory.title}
                    </h3>
                </CardHeader>
                <CardBody>
                    <p className={"text-gray-600 text-tiny"}>
                        {directory.autoSummary}
                    </p>
                </CardBody>
                <CardFooter>
                    <Button>
                        View
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
