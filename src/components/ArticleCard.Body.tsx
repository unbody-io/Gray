import {MiniArticle} from "@/types/data.types";
import {ArticleIcon} from "@/components/icons";
import {CardFooter, CardHeader} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import React from "react";
import {formatDate} from "@/utils/date.utils";
import {getPostLink} from "@/utils/query.utils";
import {Link} from "@nextui-org/link";


type ArticleCardProps = {
    data: MiniArticle;
};


export const ArticleCardBody = (props: ArticleCardProps) => {
    const {data: article} = props;
    return (
        <div className={"flex max-w-md lg:max-w-full  flex-row overflow-hidden  align-top"}>
            <div className={"p-3 lg:mt-0 flex items-center justify-center"}>
                <ArticleIcon className={"text-black/50  fill-black/30"}
                             size={10}
                />
            </div>
            <div className={"w-full h-full "}>
                <CardHeader className="flex-col  items-start mb-0 pb-0">
                    <div
                        className="flex  gap-2 justify-center align-middle text-tiny text-gray-500">
                        {
                            article.modifiedAt &&
                            <span className={"text-tiny"}>
                                                           {
                                                               // @ts-ignore
                                                               formatDate(article.modifiedAt as string)
                                                           }
                                                        </span>
                        }
                    </div>
                    <h4 className="font-normal  text-md lg:max-w-full max-w-[220px] truncate mb-0 break-words  pb-0">
                        {article.title as string}
                    </h4>
                </CardHeader>
                <CardFooter className={"justify-between   mb-2 flex max-w-sm flex-col  lg:flex-row lg:max-w-full  pt-0 pb-0 lg:mb-0"}>
                    <p className="lg:overflow-clip  max-w-full text-gray-500 text-tiny lg:max-w-lg truncate">
                        {
                            (article.subtitle ? article.subtitle : article.summary) as string
                        }
                    </p>
                    <Button color={"default"}
                            size={"sm"}
                            href={getPostLink(article.slug as string)}
                            as={Link}
                    >
                        Read
                    </Button>
                </CardFooter>
            </div>
        </div>
    )
}
