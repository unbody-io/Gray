import Image from 'next/image';
import { PlayIcon } from "@/components/icons";
import {EnhancedVideoFile} from "@/types/custom.type";

type Props = {
  videoFile: EnhancedVideoFile;
  height?: number;
}

export const VideoThumbnail = ({ videoFile, height = 210}: Props) => {
  // @ts-ignore
  const webp = videoFile.animatedImageUrl!.webp as string;
  // @ts-ignore
  const gif = videoFile.animatedImageUrl!.gif as string;

  return (
    <div className={`relative w-full shadow-xl drop-shadow-2xl rounded-large overflow-hidden transition-transform duration-300`}
          style={{height: `${height}px`}}
    >
      <Image
        src={(videoFile.thumbnailUrl!.webp || videoFile.thumbnailUrl!.jpeg) as string}
        alt={videoFile.originalName as string}
        width={videoFile.width as unknown as number}
        height={height}
        className="object-cover h-full w-full shadow-black/5 rounded-large"
      />
      <div className="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100">
        <Image
          src={(webp||gif) as string}
          alt={videoFile.originalName as string}
          width={videoFile.width as number}
          height={height}
          className="object-cover h-full shadow-black/5 rounded-large"
        />
      </div>
      <div>
        <PlayIcon className="absolute bottom-1 left-1"
                  fill={"white"}
        />
      </div>
    </div>
  );
}
