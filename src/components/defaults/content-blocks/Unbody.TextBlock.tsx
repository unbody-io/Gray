import {ITextBlock} from "@unbody-io/ts-client/build/core/documents";
import {TagProps} from "@/types/ui.types";
import {ParagraphBlock} from "@/components/defaults/content-blocks/Block.Paragraph";

export const UnbodyTextBlock = ({data, keywords}: {data: ITextBlock, keywords: TagProps[]}) => {
    switch (data.tagName) {
        case "h1":
            return <h1>{data.text as string}</h1>
        case "h2":
            return <h2>{data.text as string}</h2>
        case "h3":
            return <h3>{data.text as string}</h3>
        case "h4":
            return <h4>{data.text as string}</h4>
        case "h5":
            return <h5>{data.text as string}</h5>
        case "h6":
            return <h6>{data.text as string}</h6>
        case "p":
            return <ParagraphBlock html={data.html as string} keywords={keywords}/>
        case "ul":
            return <ul dangerouslySetInnerHTML={{__html: data.html as string}}/>

    }
}
