import React from "react";
import { Button, Card, Slider } from "@nextui-org/react";
import { CardBody } from "@nextui-org/card";
import {EnhancedVideoFile} from "@/types/custom.type";
import {VideoThumbnail} from "@/components/VideoThumbnail";
import {HeartIcon, NextIcon, PauseCircleIcon, PreviousIcon, RepeatOneIcon, ShuffleIcon} from "@/components/icons";
import {secondsToMinutes} from "@/utils/ui.utils";

type Props = {
  videoFile: EnhancedVideoFile;
}

export const VideoCardPlayer = ({ videoFile }: Props) => {
  return (
    <Card
      isBlurred
      className="border-none bg-background/10 dark:bg-default-100/10 max-w-[710px]"
      shadow="sm"
    >
      <CardBody>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
          <div className="relative col-span-6 md:col-span-4">
            <VideoThumbnail videoFile={videoFile} />
          </div>

          <div className="flex flex-col col-span-6 md:col-span-8">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-0">
                <h3 className="font-semibold text-foreground/90">{videoFile.speaker}</h3>
                <p className="text-small text-foreground/80">{secondsToMinutes(videoFile.duration as number)} min</p>
                <h1 className="text-large font-medium mt-2">{videoFile.title}</h1>
              </div>
              <Button
                isIconOnly
                className="text-default-900/60 data-[hover]:bg-foreground/10 -translate-y-2 translate-x-2"
                radius="full"
                variant="light"
                onPress={() => console.log("")}
              >
                <HeartIcon
                  className={true ? "[&>path]:stroke-transparent" : ""}
                  fill={true ? "currentColor" : "none"}
                />
              </Button>
            </div>

            <div className="flex flex-col mt-3 gap-1">
              <Slider
                aria-label="Music progress"
                classNames={{
                  track: "bg-default-500/30",
                  thumb: "w-2 h-2 after:w-2 after:h-2 after:bg-foreground",
                }}
                color="foreground"
                defaultValue={33}
                size="sm"
              />
              <div className="flex justify-between">
                <p className="text-small">1:23</p>
                <p className="text-small text-foreground/50">4:32</p>
              </div>
            </div>

            <div className="flex w-full items-center justify-center">
              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
              >
                <RepeatOneIcon className="text-foreground/80" />
              </Button>
              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
              >
                <PreviousIcon />
              </Button>
              <Button
                isIconOnly
                className="w-auto h-auto data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
              >
                <PauseCircleIcon size={54} />
              </Button>
              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
              >
                <NextIcon />
              </Button>
              <Button
                isIconOnly
                className="data-[hover]:bg-foreground/10"
                radius="full"
                variant="light"
              >
                <ShuffleIcon className="text-foreground/80" />
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
