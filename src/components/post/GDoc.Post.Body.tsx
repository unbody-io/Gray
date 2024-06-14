import {ImageBlock} from "@/types/data.types";
import {ITextBlock} from "@unbody-io/ts-client/build/core/documents";
import {UnbodyImage} from "@/components/Image";
import {EnhancedGDocWithContent} from "@/types/custom.type";
import {UnbodyTextBlock} from "@/components/defaults/content-blocks/Unbody.TextBlock";
import {TagProps} from "@/types/ui.types";

type Props = {
    data: EnhancedGDocWithContent
    keywords: TagProps[]
}

export const GDocPostBody = ({data, keywords}: Props) => (
    <article className={"prose mt-4 prose-img:rounded-xl prose-a:text-blue-600 max-w-screen-md"}>
        {
            data.blocks
                // @ts-ignore
                .map((block, index) => {
                    if (block.__typename === "TextBlock") {
                        return (
                            <UnbodyTextBlock data={block as ITextBlock}
                                             keywords={keywords}
                                             key={index}
                            />
                        )
                    }
                    if (block.__typename === "ImageBlock") {
                        return <UnbodyImage
                            data={block as ImageBlock}
                            key={index}
                        />
                    }
                })
        }
    </article>
)
