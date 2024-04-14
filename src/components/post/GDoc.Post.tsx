import {IGoogleDoc, IImageBlock, ITextBlock} from "@unbody-io/ts-client/build/core/documents";
import parse from 'html-react-parser';
import {renderToString} from "react-dom/server";
import {uniqueBy} from "@/utils/data.utils";
import Link from "next/link";
import {FC, useMemo} from "react";
import {UnbodyImage} from "@/components/Image";
import {ImageBlock} from "@/types/data.types";
import Image from "next/image";
import {windowScrollY} from "@/utils/ui.utils";
import {formatDate} from "@/utils/date.utils";
import {Divider} from "@nextui-org/react";

type Props = {
    data: IGoogleDoc
}


interface Keyword {
    value: string;
    type: string
}

// Define the MyComponent props interface
interface MyComponentProps {
    html: string;
    keywords: Keyword[];
}


const inlineKeysClassNames = `tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 no-underline hover:opacity-80 active:opacity-disabled transition-opacity relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap text-small rounded-full bg-default/40 text-default-foreground mt-1 capitalize px-2 pt-0.5 pb-0.5 h-fit`;

const MyComponent: FC<MyComponentProps> = ({html, keywords}) => {
    // This function converts a keyword object to a URL string
    const keywordToUrl = (keyword: Keyword) => `/explore/search?${keyword.type}=${encodeURIComponent(keyword.value)}`;

    // The replace function for html-react-parser
    let matches: string[] = [];
    const replaceFn = (domNode: any) => {
        if (domNode.type === 'text') {
            let text = domNode.data;
            keywords.forEach(keyword => {
                const regex = new RegExp(keyword.value, 'gi');
                text = text.replace(regex, (matched: string) => {
                    if (matches.indexOf(matched) === -1) {
                        return renderToString(
                            <Link href={keywordToUrl(keyword)}
                                  className={inlineKeysClassNames}
                            >{matched}</Link>
                        )
                    }
                    matches.push(matched);
                });
            });

            // Return a span with the replaced text (HTML) as dangerouslySetInnerHTML
            return <span dangerouslySetInnerHTML={{__html: text}}/>;
        }
    };

    // Parse the HTML string with the replace function
    return parse(html, {replace: replaceFn})
};



const UnbodyTextBlock = ({data, keywords}: {data: ITextBlock, keywords: Keyword[]}) => {
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
            return <MyComponent html={data.html as string} keywords={keywords}/>
        case "ul":
            return <ul dangerouslySetInnerHTML={{__html: data.html as string}}/>

    }
}


const isTitle = (block: ITextBlock | IImageBlock) => {
    // @ts-ignore
    return ((block as ITextBlock).classNames || []).includes("title");
}

const isPreviewImage = (block: ITextBlock | IImageBlock) => {
    //@ts-ignore
    return block.__typename === "ImageBlock" && block.order === 1;
}


type PreviewImageProps = {
    data: ImageBlock
    height?: number
}

const PreviewImage = ({data, height = 500}: PreviewImageProps) => {
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




export const GDocPost = ({data}: Props) => {

    const keywords = useMemo(() => {
        return uniqueBy([
            ...(data.autoKeywords as string[] || []).map((keyword) => ({value: keyword, type: "keyword"})),
            ...(data.autoEntities as string[] || []).map((entity) => ({value: entity, type: "entity"})),
            ...(data.autoTopics as string[] || []).map((topic) => ({value: topic, type: "topic"}))
        ], 'value')
    }, [data]);

    const previewImage = useMemo(() => {
        return (data.blocks as (ITextBlock | IImageBlock)[]).find(isPreviewImage) as ImageBlock
    }, [data.blocks]);


    return (
        <div className={"flex flex-col items-center"}>
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

            <article className={"prose mt-4 prose-img:rounded-xl prose-a:text-blue-600 max-w-screen-md"}>
                {
                    // @ts-ignore
                    (data.blocks)!
                        // @ts-ignore
                        .sort((a, b) => a.order - b.order)
                        // @ts-ignore
                        .filter(b => (
                            !isPreviewImage(b)
                            && !isTitle(b)
                        ))
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
        </div>
    )
}


