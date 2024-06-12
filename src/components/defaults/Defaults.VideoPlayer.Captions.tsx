import {EnhancedVideoFileWithContent} from "@/types/custom.type";
import React, {RefObject, useEffect, useMemo} from "react";
import {chunkEntriesSentenceAware} from "@/utils/data.utils";
import {ISubtitleEntry} from "@unbody-io/ts-client/build/core/documents";
import {Chip} from "@nextui-org/chip";
import {SubtitleChunk} from "@/types/ui.types";
import {formatTime, timeToSeconds} from "@/utils/date.utils";
import clsx from "clsx";


type VideoLiveCaptionProps = {
    data: EnhancedVideoFileWithContent,
    now: number,
    playerRef: RefObject<HTMLDivElement>
}


type VideoLiveCaptionChunkProps = {
    chunk: SubtitleChunk,
    isCurrent: boolean
    now: number
}

type VideoLiveCaptionEntryProps = {
    entry: ISubtitleEntry,
    isCurrent: boolean
}

const VideoLiveCaptionEntry = ({entry, isCurrent}: VideoLiveCaptionEntryProps) => {
    return (
        <span className={clsx(
            `transition-all duration-500`,
            `${isCurrent ? "text-black" : "text-gray-500/50"}`
        )}>
            {entry.text + " "}
        </span>
    )
}

const isCurrentEntry = (entry: ISubtitleEntry, now: number) => {
    const start = timeToSeconds(entry.start + "");
    const end = timeToSeconds(entry.end + "");
    return now >= start && now <= end;
}

export const VideoLiveCaptionChunk = ({chunk: {entries}, isCurrent, now}: VideoLiveCaptionChunkProps) => {
    return (
        <div className={clsx(
            "pt-4 pb-2 pl-8",
            `transition-all duration-500`,
        )}>
            <Chip size="sm" className="mb-2 ml-8">
                {formatTime(entries[0].start + "")}
            </Chip>
            <p className={"border-l-1 border-gray-500 pl-8 py-0"}>
                {
                    entries.map((entry, j) => (
                        <VideoLiveCaptionEntry key={j}
                                               entry={entry}
                                               isCurrent={isCurrentEntry(entry, now)}
                        />
                    ))
                }
            </p>
        </div>
    )
}


export const VideoLiveCaption = ({data, now, playerRef}: {
    data: EnhancedVideoFileWithContent,
    now: number,
    playerRef: RefObject<HTMLDivElement>
}) => {
    const [currentChunk, setCurrentChunk] = React.useState<number>(0);

    const chunks: SubtitleChunk[] = useMemo(() => {
        return chunkEntriesSentenceAware(data.subtitles[0].entries, data.subtitles[0].entries.length / 21)
    }, [data.subtitles[0].entries]);

    const chunksRefs = React.useRef<HTMLDivElement[]>([]);
    const captionListRef = React.useRef<HTMLDivElement>(null);

    const onTimeUpdate = (time: number) => {
        if (currentChunk < chunks.length - 1) {
            if (timeToSeconds(chunks[currentChunk + 1].entries[0].start + "") < time) {
                setCurrentChunk(currentChunk + 1);
            }
        }
    }


    useEffect(() => onTimeUpdate(now), [now]);

    useEffect(() => {
        if (captionListRef.current && chunksRefs.current[currentChunk] && playerRef && playerRef.current) {
            console.log(",move to ", chunksRefs.current[currentChunk].offsetTop , playerRef.current.offsetHeight);
            captionListRef.current.scrollTo({
                behavior: "smooth",
                top: (
                    chunksRefs.current[currentChunk].offsetTop
                )
            });
        }
    }, [currentChunk]);


    return (
        <div className={clsx(
            "flex flex-col gap-6",
            "overflow-x-hidden",
            "w-full",
            `backdrop-blur-xl`
        )}>
        <div
            className={clsx(
                "max-h-screen overflow-y-auto",
            )}
            style={{
                paddingRight: "20px",
                width: "calc(100% + 20px)",
            }}
            ref={captionListRef}
        >
            {
                chunks.map((chunk, index) => (
                    <div key={index}
                         ref={(c) => {
                             chunksRefs.current[index] = c as HTMLDivElement
                         }}
                    >
                        <VideoLiveCaptionChunk chunk={chunk}
                                               isCurrent={index === currentChunk}
                                               key={index}
                                               now={now}
                        />
                    </div>
                ))
            }
        </div>
        </div>
    )
}
