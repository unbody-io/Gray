import Imgix from "react-imgix";
import {ImageBlock} from "@/types/custom.type";

type Props = {
    data: ImageBlock
}

export const UnbodyImage = ({data}: Props) => {
    const ratio = data.width / data.height;

    return (
        <div className={"relative my-8 w-full bg-gray-200"}
             style={{
                 paddingTop: `${100 / ratio}%`
             }}
        >
            <Imgix src={data.url as string}
                   htmlAttributes={{
                       alt: data.alt||data.autoCaption as string,
                       title: data.alt as string,
                       src: `${data.url}?w=20&blur=100fm=webp&q=75`,
                       style: {
                           position: "absolute",
                           top: 0,
                           left: 0,
                           width: "100%",
                           height: "100%",
                           margin: 0,
                           padding: 0
                       }
                   }}
                   width={data.width}
                   height={data.height}
            />
        </div>
    )
}
