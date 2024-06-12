import React, { useRef, useState, useCallback, useEffect } from "react";
import MuxPlayer, {MuxPlayerProps} from "@mux/mux-player-react";
import clsx from "clsx";
import { PauseIcon, PlayIcon } from "@/components/icons";
import { Button } from "@nextui-org/button";
import {secondsToMinutes, useHover} from "@/utils/ui.utils";
import {EnhancedVideoFile} from "@/types/custom.type";

type Props = {
    data: EnhancedVideoFile;
    className?: string;
    onTimeUpdate?: (time: number) => void;
    onPlay?: () => void;
    onPause?: () => void;
    muxOptions?: MuxPlayerProps;
};

const PlayButton = ({ playing, onClick }: { playing: boolean, onClick: () => void }) => (
    <Button
        isIconOnly
        className={clsx(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-500",
            { "opacity-0": playing, "opacity-100": !playing }
        )}
        onClick={onClick}
    >
        {playing ? <PauseIcon /> : <PlayIcon />}
    </Button>
);

const ShadowOverlay = ({ show }: { show: boolean }) => (
    <div
        className={clsx(
            "absolute left-0 w-full h-full bg-gradient-to-t from-gray-100 to-transparent rounded-lg z-9 transition-opacity duration-500",
            { "opacity-0": show, "opacity-100": !show }
        )}
        style={{ bottom: "7px" }}
    />
);

const VideoWrapper = ({ children }: { playing: boolean, isHovering: boolean, children: React.ReactNode }) => (
    <div
        className="w-full overflow-hidden transition-all duration-500 rounded-lg"
        style={{
            // filter: `blur(${playing || isHovering ? 0 : 3}px)`,
            height: `calc(100% - 7px)`
    }}
    >
        {children}
    </div>
);

type UseVideoPlayerCoreProps = {
    onPlay?: () => void;
    onPause?: () => void;
} & Props;

// Custom hook to handle the core video player logic
const useVideoPlayer = (props: UseVideoPlayerCoreProps) => {
    const [playing, setPlaying] = useState(false);
    const playerRef = useRef<HTMLDivElement | null>(null);
    const [wrapperRef, isHovering] = useHover<HTMLDivElement>();

    const togglePlay = useCallback(() => {
        if (playerRef.current) {
            const player = playerRef.current as any;
            if (playing) {
                player.pause();
            } else {
                player.play();
            }
        }
    }, [playing]);

    const handleTimeUpdate = useCallback(() => {
        if (playerRef.current) {
            const player = playerRef.current as any;
            const currentTime = player.currentTime;
            if (props.onTimeUpdate) {
                props.onTimeUpdate(currentTime);
            }
        }
    }, [props.onTimeUpdate]);

    useEffect(() => {
        if (playerRef.current) {
            const player = playerRef.current as any;
            const onPlay = () => {
                setPlaying(true);
                if (props.onPlay) {
                    props.onPlay();
                }
            }
            const onPause = () => {
                setPlaying(false);
                if (props.onPause) {
                    props.onPause();
                }
            }
            player.addEventListener("play", onPlay);
            player.addEventListener("pause", onPause);
            player.addEventListener("timeupdate", handleTimeUpdate);

            return () => {
                player.removeEventListener("play", onPlay);
                player.removeEventListener("pause", onPause);
                player.removeEventListener("timeupdate", handleTimeUpdate);
            };
        }
    }, [handleTimeUpdate]);

    return {
        playing,
        playerRef,
        wrapperRef,
        isHovering,
        togglePlay
    };
};

type VideoPlayerCoreProps = {
    playerRef: React.RefObject<any>
} & Props

export const VideoPlayerCore = (props: VideoPlayerCoreProps) => {
    const {
        data,
        playerRef,
        muxOptions = {},
    } = props;
    // @ts-ignore
    const placeholder = data.animatedImageUrl?.gif ?? "";

    return (
        <MuxPlayer
            style={{ height: '100%', maxWidth: '100%' }}
            playbackId={data.playbackId as string}
            metadata={{
                video_id: data.assetId,
                video_title: data.title,
            }}
            placeholder={placeholder}
            streamType="on-demand"
            poster={placeholder}
            ref={playerRef}
            defaultHiddenCaptions={true}
            {...muxOptions}
        />
    );
};

export const DefaultVideoPlayer = ({ data, className = "", muxOptions={}, onTimeUpdate, ...rest }: Props) => {
    const { playing, playerRef, wrapperRef, isHovering, togglePlay } =
        useVideoPlayer({
            data,
            onTimeUpdate,
            onPlay: rest.onPlay || (() => {}),
            onPause: rest.onPause || (() => {})
        });

    return (
        <div
            className={clsx("relative w-full rounded-lg overflow-hidden", className)}
            {...rest}
            ref={wrapperRef}
        >
            <PlayButton playing={playing} onClick={togglePlay} />
            <VideoWrapper playing={playing} isHovering={isHovering}>
                <VideoPlayerCore data={data}
                                 playerRef={playerRef}
                                 muxOptions={muxOptions}
                />
            </VideoWrapper>
            <div className={clsx(
                "transition-all duration-1000 animate-fade-in-out",
                "w-full h-full absolute top-0 left-0",
                "backdrop-blur-sm bg-gray-100/10 saturate-0",
                "text-white",
                "shadow-inner",
                `z-9`,
                `${playing||isHovering ? "opacity-0" : "opacity-100"}`,
                "p-4"
            )}>
                <div className={"mb-2"}>
                    <span className={"text-xs"}>
                        {secondsToMinutes(data.duration as number)} minutes
                    </span>
                </div>
            </div>
        </div>
    );
};
