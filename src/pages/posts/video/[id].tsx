import {GetStaticPaths, GetStaticProps} from "next";
import DefaultLayout from "@/layouts/default";
import {getConfigs} from "@/lib/configs.common";
import {SupportedContentTypes} from "@/types/plugins.types";
import {EnhancedVideoFile, EnhancedVideoFileWithContent} from "@/types/custom.type";
import React, {useEffect} from "react";
import clsx from "clsx";

import {DefaultVideoPlayer} from "@/components/defaults/Defaults.VideoPlayer";
import {chunkEntriesSentenceAware} from "@/utils/data.utils";
import {secondsToMinutes} from "@/utils/ui.utils";
import {ReactRef} from "@nextui-org/react-utils";
import {VideoLiveCaption, VideoLiveCaptionChunk} from "@/components/defaults/Defaults.VideoPlayer.Captions";
import {Link} from "@nextui-org/link";
import {Divider, Modal, ModalBody, ModalContent, Progress} from "@nextui-org/react";
import {DefaultsTag} from "@/components/defaults/content-blocks/Defaults.Tag";
import {useSearchBar} from "@/context/context.search-bar";
import {DefaultsVideoPostHeader} from "@/components/defaults/Defaults.VideoPost.Header";
import {DefaultVideoPlayerMini} from "@/components/defaults/Defaults.VideoPlayer.Mini";
import {useApiPost} from "@/services/api.service";
import {ApiTypes} from "@/types/api.type";
import {ISubtitleEntry} from "@unbody-io/ts-client/build/core/documents";
import {useSiteData} from "@/context/context.site-data";
import {ParagraphSkeleton} from "@/components/skeletons";
import {BlogIntro} from "@/components/BlogIntro";

type PostPageProps = {
    data: EnhancedVideoFileWithContent
}

const PostPage = ({data}: PostPageProps) => {
    const {setScopeLabel, query, isFocused} = useSearchBar();
    const {configs: {plugins}, context} = useSiteData();

    const id = plugins.find((plugin) => plugin.type === SupportedContentTypes.VideoFile)?.identifier as string;


    const playerRef = React.useRef<HTMLDivElement>(null);
    const [now, setNow] = React.useState<number>(0);
    const [playing, setPlaying] = React.useState<boolean>(false);

    const videoWHRatio = (data.height as number) / (data.width as number);
    const headerHeight = 220;

    const structuredInput = useApiPost<ApiTypes.Rq.ParsedQuery, ApiTypes.Rs.ParsedQuery>(
        "/api/parse-query"
    );
    const summary = useApiPost<ApiTypes.Rq.Search, ApiTypes.Rs.AISearchSummary<ISubtitleEntry[]>>(
        "/api/search/videos/search-summary",
    );
    const results = useApiPost<ApiTypes.Rq.Search, ApiTypes.Rs.SearchResults<ISubtitleEntry[]>>(
        '/api/search/videos/subtitles'
    );

    useEffect(() => {
        setScopeLabel(data.title as string);
    }, [data])

    useEffect(() => {
        structuredInput.exec({
            input: query,
        })
    }, [query]);

    useEffect(() => {
        if (structuredInput.data && query) {
            const requestPayload = {
                input: structuredInput.data,
                // @ts-ignore
                filters: [data[id] as string]
            }
            summary.exec(requestPayload);
            results.exec(requestPayload);
        }
    }, [structuredInput.data]);

    return (
        <DefaultLayout containerMaxWidth={`max-w-screen-md relative`}>
            {
                (isFocused || query) && (
                    <DefaultVideoPlayerMini videoFile={data as EnhancedVideoFile}/>
                )
            }
            {
                (isFocused || (query&&query.length>0)) && (
                    <>
                        <div className={"pt-4"}>
                            {
                                (summary.isLoading || structuredInput.isLoading) ?
                                    <ParagraphSkeleton/>
                                    :
                                    <article
                                        className={"prose prose-gray dark:prose-dark"}
                                        dangerouslySetInnerHTML={{
                                            __html: summary.data?.summary || ""
                                        }}
                                    />
                            }
                        </div>
                        {
                            (results.isLoading||structuredInput.isLoading) ?
                                <Progress
                                    size="sm"
                                    isIndeterminate
                                    aria-label="Loading..."
                                    label={structuredInput.isLoading ? "Understanding what you asked..." : "Finding relevant results..."}
                                />
                                :
                                <div>
                                    {
                                        results.error && (
                                            <div>
                                                Error
                                            </div>
                                        )
                                    }
                                    {
                                        results.data &&
                                        chunkEntriesSentenceAware(results.data[0].data, 10)
                                            .map((chunk, i) => (
                                                <VideoLiveCaptionChunk key={i}
                                                                       chunk={chunk}
                                                                       isCurrent={false}
                                                                       now={now}
                                                />
                                            ))
                                    }
                                </div>
                        }
                    </>
                )
            }
            <div className={clsx(
                "transition-all duration-1500",
                (query || isFocused) && "filter blur-md transition-all duration-1500",
            )}>
                <div className={clsx(
                    "relative z-10 transition-all duration-1000",
                    (query || isFocused) && "opacity-25",
                )}
                     ref={playerRef}
                >
                    <DefaultVideoPlayer data={data as EnhancedVideoFile}
                                        onTimeUpdate={setNow}
                                        onPlay={() => setPlaying(true)}
                                        onPause={() => setPlaying(false)}
                    />
                </div>
                <div className={clsx(
                    "fixed bottom-0 left-0 w-full h-[100px]",
                    "bg-gradient-to-t from-gray-100 via-gray-50/50 to-transparent",
                    "z-1"
                )}/>
                <DefaultsVideoPostHeader data={data}
                                         headerHeight={headerHeight}
                />

                <article className={clsx(
                    `absolute top-0 left-0 w-full transition-all duration-1000 ease-in-out`,
                )}
                         style={{
                             paddingTop: `calc(${videoWHRatio * 100}% + ${headerHeight}px)`,
                             transform: `${playing ? `translateY(-${headerHeight}px)` : "translateY(100px)"}`,
                             zIndex: playing ? 9 : -1,
                         }}
                >
                    <VideoLiveCaption data={data}
                                      now={now}
                                      playerRef={playerRef}
                    />
                </article>
            </div>
        </DefaultLayout>
    )
}

export const getStaticPaths = (async () => {
    const {contentPlugins, contentConfig} = getConfigs();
    const plugin = contentPlugins.find((plugin) => plugin.type === SupportedContentTypes.VideoFile);

    const posts = await plugin?.fetcher(contentConfig.postsPath);

    return {
        paths: posts!.map((post) => ({params: {id: post[plugin!.identifier]}})),
        fallback: false
    }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
    if (!context.params) {
        return {props: {}, notFound: true}
    }

    const plugin = getConfigs().contentPlugins.find((plugin) => plugin.type === SupportedContentTypes.VideoFile);

    if (!plugin) {
        return {props: {}, notFound: true}
    }

    const id = context.params.id as string;
    const enhancedPosts = await plugin.cacheReader();
    const post = await plugin.getPost(id);
    const enhancedPost = enhancedPosts.find((post) => post[plugin.identifier] === id);

    if (!post) {
        return {props: {}, notFound: true}
    }

    return {
        props: {
            data: {
                ...post,
                ...enhancedPost
            }
        }
    }

}) satisfies GetStaticProps<PostPageProps>


export default PostPage
