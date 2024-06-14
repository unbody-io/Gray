import {formatDate} from "@/utils/date.utils";
import {Divider} from "@nextui-org/react";
import {IGoogleDoc} from "@unbody-io/ts-client/build/core/documents";
import {PreviewImage} from "@/components/post/GDoc.Post.PreviewImage";
import {ImageBlock} from "@/types/data.types";

type Props = {
    data: IGoogleDoc
    previewImage?: ImageBlock
}
export const GDocPostHeader = ({data, previewImage}: Props) => (
    <header className={"w-full flex items-center flex-col"}>
        {
            previewImage &&
            <PreviewImage data={previewImage}/>
        }
        <div className={"max-w-screen-md flex-col flex gap-4 my-6"}>
                    <span className={"text-gray-500 text-sm"}>
                        Published on {
                        // @ts-ignore
                        formatDate(data.modifiedAt as string)
                    }
                    </span>
            <h1 className={"text-4xl py-4"}>
                {data.title as string}
            </h1>
            <p className={"text-xl "}>
                {
                    data.autoSummary as string
                }
            </p>
            <Divider/>
        </div>
    </header>
)
