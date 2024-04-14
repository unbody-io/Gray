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
        <div className={"flex flex-row align-top"}>
            <div className={"p-3"}>
                <ArticleIcon className={"text-black/50 fill-black/30"}
                             size={10}
                />
            </div>
            <div className={"w-full"}>
                <CardHeader className="flex-col items-start mb-0 pb-0">
                    <div
                        className="flex gap-2 justify-center align-middle text-tiny text-gray-500">
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
                    <h4 className="font-normal text-md max-w-md truncate mb-0 pb-0">
                        {article.title as string}
                    </h4>
                </CardHeader>
                <CardFooter className={"justify-between pt-0 pb-0 mb-0"}>
                    <p className="overflow-clip text-gray-500 text-tiny max-w-lg truncate">
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
