import React, {useRef} from "react";
import {Button, Card, Slider} from "@nextui-org/react";
import {CardBody} from "@nextui-org/card";
import {
    HeartIcon,
    NextIcon,
    PauseCircleIcon,
    PlayIcon,
    PreviousIcon,
    RepeatOneIcon,
    ShuffleIcon
} from "@/components/icons";
import {VideoThumbnail} from "@/components/VideoThumbnail";
import {EnhancedVideoFile} from "@/types/custom.type";
import {secondsToMinutes} from "@/utils/ui.utils";
import {VideoPlayerCore} from "@/components/defaults/Defaults.VideoPlayer";
import clsx from "clsx";
import {formatTime, formatTimeFromSeconds} from "@/utils/date.utils";

type Props = {
    videoFile: EnhancedVideoFile;
}

export const DefaultVideoPlayerMini = ({videoFile}: Props) => {
    console.log(videoFile)
    const playerRef = useRef<HTMLDivElement | null>(null);
    const [now, setNow] = React.useState<number>(0);
    const [past, setPast] = React.useState<number>(0);
    const [playing, setPlaying] = React.useState<boolean>(false);

    const onTimeUpdate = (time: number) => {
        if (playerRef.current) {
            const player = playerRef.current as any;
            setPast(player.currentTime);
        }
    }

    const togglePlay = () => {
        const player = playerRef.current as any;
        if (player.paused) {
            player.play();
        } else {
            player.pause();
        }
    }

    const onSeek = (time: number) => {
        const player = playerRef.current as any;
        player.currentTime = time;
    }

    return (
        <Card
            isBlurred
            className={clsx(
                "border-none bg-gray-800 dark:bg-default-100/10",
                "animate-fadeIn"
            )}
            shadow="sm"
        >
            <CardBody>
                <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
                    <div className={clsx(
                        "relative col-span-6 md:col-span-4",
                        "rounded-md overflow-hidden h-full",
                        "saturate-0"
                    )}>
                        <VideoPlayerCore data={videoFile}
                                         playerRef={playerRef}
                                         muxOptions={{
                                             onTimeUpdate: onTimeUpdate as any,
                                             onPlay: () => setPlaying(true),
                                             onPause: () => setPlaying(false),
                                             className: "VideoPlayerMini",
                                             style:{
                                                 height: "165px"
                                            }
                                         }}
                        />
                    </div>

                    <div className="flex flex-col col-span-6 md:col-span-8 h-full">
                        <div className={"mb-6 pt-2"}>
                            <h3 className={"text-gray-100"}>
                                {videoFile.title}
                            </h3>
                        </div>
                        <div className="flex flex-col mt-3 gap-1">
                            <Slider
                                classNames={{
                                    track: "bg-default-500",
                                    thumb: "w-2 h-2 after:w-2 after:h-2 after:bg-gray-100",
                                    filler: "bg-gray-100",
                                }}
                                color={"foreground"}
                                defaultValue={0}
                                // value={now}
                                maxValue={videoFile.duration as number}
                                minValue={0}
                                size="sm"
                                onChange={(v) => onSeek(v as number)}
                            />
                            <div className="flex justify-between">
                                <p className="text-small text-gray-100">{
                                    formatTimeFromSeconds(past)
                                }</p>
                                <p className="text-small text-gray-100">{
                                    formatTimeFromSeconds(videoFile.duration as number)
                                }</p>
                            </div>
                        </div>

                        <div className="flex w-full items-center justify-center">
                            <Button
                                isIconOnly
                                className="data-[hover]:bg-gray-100/10"
                                radius="full"
                                variant="light"
                            >
                                <PreviousIcon fill={"white"}/>
                            </Button>
                            <Button
                                isIconOnly
                                className="w-auto h-auto data-[hover]:bg-gray-100/10"
                                radius="full"
                                variant="light"
                                onClick={togglePlay}
                            >
                                {
                                    playing ?
                                        <PauseCircleIcon fill={"white"}/> :
                                        <PlayIcon fill={"white"}/>
                                }
                            </Button>
                            <Button
                                isIconOnly
                                className="data-[hover]:bg-gray-100/10"
                                radius="full"
                                variant="light"
                            >
                                <NextIcon fill={"white"}/>
                            </Button>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}
