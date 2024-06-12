import {ArticleIcon} from "@/components/icons";
import {Card, CardBody, CardHeader, Divider, Spacer} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import React from "react";
import {formatDate} from "@/utils/date.utils";
import {getPostLink} from "@/utils/query.utils";
import {Link} from "@nextui-org/link";
import {EnhancedGDoc, EnhancedImageBlock, EnhancedTextBlock} from "@/types/custom.type";
import {Badge} from "@nextui-org/badge";
import clsx from "clsx";

type ArticleCardProps = {
    data: EnhancedGDoc|null,
    postRefs: (EnhancedTextBlock|EnhancedImageBlock)[]
    loading?: boolean;
    error?: Error|null;
};

const DefaultsArticleCardBodyWithRefs = (props: ArticleCardProps) => {
    const {data: article, postRefs, loading, error} = props;

    const [showRefs, setShowRefs] = React.useState<boolean>(false);

    if (error) return <div>Error: {error.message}</div>;
    if (loading) return <div>Loading...</div>;
    if (!article) return null;

    return (
        <div className={""}>
            <CardHeader className="grid grid-cols-12 items-start gap-4">
                <div className={"col-span-1"}>
                    <ArticleIcon className={"text-black/50 fill-black/30"}
                                 size={10}
                    />
                </div>
                <div className={"items-start col-span-9"}>
                    <div className="p-0 m-0 flex-col mb-0 pb-0 text-tiny text-gray-500">
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
                            ((article?.subtitle ? article?.subtitle : article?.autoSummary) as string).split(".")
                        }
                        ...
                    </p>
                </div>
                <div className={"col-span-2 relative"}>
                    <Button size={"sm"}
                            href={getPostLink(article?.slug as string)}
                            as={Link}
                            className={"absolute right-0 top-0"}
                            variant={"shadow"}
                    >
                        Read
                    </Button>
                </div>
            </CardHeader>
            <CardBody className={"grid grid-cols-12 gap-4"}>
                <div className={"col-span-1"}/>
                <div className={"col-span-11"}>
                    {
                        postRefs.length > 0 &&
                        <Button size={"sm"}
                                variant={"shadow"}
                                color={"default"}
                                startContent={(
                                    <div className={"rounded-2xl bg-gray-800 text-white"}
                                         style={{padding: "4px 8px"}}
                                    >
                                        {postRefs.length}
                                    </div>
                                )}
                                onClick={() => setShowRefs(!showRefs)}
                        >
                            Highlighted Paragraphs...
                        </Button>
                    }
                    {
                        showRefs&&
                        <div className={"flex flex-col gap-4 mt-6"}>
                            {
                                postRefs.map((ref, i) => {
                                    return (
                                        <div className={clsx(
                                            // 'pr-4',
                                            // "text-small"
                                        )}
                                             key={i}
                                        >
                                            <div className={`border-l-1 border-white pl-4`}
                                            >
                                                <div dangerouslySetInnerHTML={{
                                                    __html: `${ref.html}`
                                                }}
                                                     className={"bg-gray-500 text-gray-50 p-4 rounded-2xl"}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </div>
            </CardBody>
        </div>
    )
}


export default DefaultsArticleCardBodyWithRefs;
