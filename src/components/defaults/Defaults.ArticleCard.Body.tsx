import {ArticleIcon} from "@/components/icons";
import {CardBody, CardHeader} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import React from "react";
import {formatDate} from "@/utils/date.utils";
import {getPostLink} from "@/utils/query.utils";
import {Link} from "@nextui-org/link";
import {EnhancedGDoc} from "@/types/custom.type";


type ArticleCardProps = {
    data: EnhancedGDoc|null;
    loading?: boolean;
    error?: Error|null;
};

const DefaultsArticleCardBody = (props: ArticleCardProps) => {
    const {data: article, loading, error} = props;

    if (error) return <div>Error: {error.message}</div>;
    if (loading) return <div>Loading...</div>;
    if (!article) return null;

    return (
        <div>
            <CardBody className={"grid grid-cols-12 items-start gap-4"}>
                <div className={"col-end-1"}>
                    <ArticleIcon className={"text-black/50 fill-black/30"}
                                 size={10}
                    />
                </div>
                <CardHeader className="p-0 m-0 flex-col items-start col-span-10 mb-0 pb-0">
                    <div className="align-middle text-tiny text-gray-500">
                        {
                            // @ts-ignore
                            article!.modifiedAt &&
                            <span className={"text-tiny"}>
                                                           {
                                                               // @ts-ignore
                                                               formatDate(article.modifiedAt as string)
                                                           }
                                                        </span>
                        }
                    </div>
                    <h4 className="font-normal text-md truncate pt-1 pb-1 max-w-fit whitespace-break-spaces">
                        {article?.title as string}
                    </h4>
                    <p className="overflow-clip text-gray-400 text-tiny max-w-lg">
                        {
                            (article?.subtitle ? article.subtitle : article?.autoSummary) as string
                        }
                    </p>
                </CardHeader>

                <div className={"col-span-2 relative"}>
                    <Button size={"sm"}
                            href={getPostLink(
                                `article/${article?.slug as string}`
                            )}
                            as={Link}
                            className={"absolute right-0 top-0"}
                    >
                        Read
                    </Button>
                </div>
            </CardBody>

        </div>
    )
}


export default DefaultsArticleCardBody;
