import {CardBody, CardFooter, CardHeader} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import React from "react";
import {getPostLink} from "@/utils/query.utils";
import {Link} from "@nextui-org/link";
import {EnhancedVideoFile} from "@/types/custom.type";
import {VideoThumbnail} from "@/components/VideoThumbnail";
import {Article_CARD_HEIGHT} from "@/config/ui.config";
import {useSiteData} from "@/context/context.site-data";
import {SupportedContentTypes} from "@/types/plugins.types";
import clsx from "clsx";

type CardProps = {
    data: EnhancedVideoFile | null;
    loading?: boolean;
    error?: Error | null;
};

const DefaultsVideoCardBody = (props: CardProps) => {
    const {data, loading, error} = props;
    const {configs: {plugins}} = useSiteData();
    const videoPlugin = plugins.find((plugin) => plugin.type === SupportedContentTypes.VideoFile);

    if (error) return <div>Error: {error.message}</div>;
    if (loading) return <div>Loading...</div>;
    if (!data) return null;
    if (!videoPlugin) return null;

    const backgroundImageUrl = data.thumbnailUrl?.webp as string;

    // @ts-ignore
    const id = data[videoPlugin?.identifier||"remoteId"] as string;

    return (
        <div className={"relative"}>
            <div className={"absolute top-0 left-0 w-full h-full z-0 opacity-20"}
                style={{
                    backgroundImage: `url(${backgroundImageUrl})`,
                    backgroundSize: "cover",
                    backgroundColor: "rgba(255, 255, 255, 1)",
                    opacity: 0.1,
                    filter: "grayscale(100%)"
                }}
            />
            <CardBody className={clsx(
                "w-full h-full backdrop-blur-xl grid align-top",
                `md:grid-cols-12`
            )}>
                <div className={"col-span-3"}>
                    <VideoThumbnail
                        videoFile={data}
                        height={Article_CARD_HEIGHT-20}
                    />
                </div>
                <div className={"w-full col-span-8"}>
                    <CardHeader className={clsx(
                        'flex-col items-start mb-0 pb-0',
                        'max-w-full'
                    )}>
                        <div className="flex gap-2 justify-center align-middle text-tiny text-gray-500">
                            <span>{data.speaker as string}</span>
                        </div>
                        <h4 className="max-w-xs md:max-w-md md:truncate capitalize pt-1 pb-1">
                            {data.title as string}
                        </h4>
                    </CardHeader>
                    <CardFooter className={"justify-between pt-0 pb-0 mb-0"}>
                        <p className="overflow-clip text-gray-400 text-tiny max-w-lg first-letter:capitalize">
                            {
                                (data.autoSummary) as string
                            }
                        </p>
                    </CardFooter>
                </div>
                <div className={"col-span-1"}>
                    <Button size={"sm"}
                            variant={"shadow"}
                            href={getPostLink(`/video/${id}` as string)}
                            as={Link}
                    >
                        Watch
                    </Button>
                </div>
            </CardBody>

        </div>
    )
}

export default DefaultsVideoCardBody;
