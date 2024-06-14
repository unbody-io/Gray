import {ImageBlock} from "@/types/data.types";
import {windowScrollY} from "@/utils/ui.utils";
import Image from "next/image";

type PreviewImageProps = {
    data: ImageBlock
    height?: number
}

export const PreviewImage = ({data, height = 500}: PreviewImageProps) => {
    const scrollY = windowScrollY()
    return (
        <div className={`rounded-xl overflow-hidden relative w-full`}
             style={{height: `${height}px`}}
        >
            <Image src={`${data.url}?w=1.0&h=${height}&fit=crop&crop=faces,entropy,edges`}
                   alt={data.alt}
                // width={data.width}
                // height={100}
                   fill={true}
                   objectFit={"cover"}
                   objectPosition={"center"}
                   style={{
                       transform: `scale(${1 + (scrollY / 2500)})`,
                   }}
            />
        </div>
    )
}
