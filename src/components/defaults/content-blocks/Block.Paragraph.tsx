// Define the MyComponent props interface
import {FC, useMemo, useRef, useState} from "react";
import {renderToString} from "react-dom/server";
import parse from "html-react-parser";
import {TagProps} from "@/types/ui.types";
import {useHover} from "@/utils/ui.utils";
import Link from "next/link";

interface Props {
    html: string;
    keywords: TagProps[];
}


const useHighlightTags = (html: string, keywords: TagProps[]) => {
    const matches = new Set<string>();
    const replaceFn = (domNode: any) => {
        if (domNode.type === 'text') {
            let text = domNode.data;
            keywords.forEach(keyword => {
                const regex = new RegExp(keyword.key, 'gi');
                text = text.replace(regex, (matched: string) => {
                    if (!matches.has(matched)) {
                        matches.add(matched);
                        return renderToString(
                            <Link href={""}
                                  className={`TextBlockTag ${keyword.type.toLowerCase()}`}
                                  key={matched}
                            >
                                <span>{matched}</span>
                            </Link>
                        )
                    }
                });
            });
            return <span dangerouslySetInnerHTML={{__html: text}}/>;
        }
    };

    return parse(html, {replace: replaceFn});
}

export const ParagraphBlock: FC<Props> = ({html, keywords}) => {
    const [ref, isHovering] = useHover<HTMLDivElement>();

    const _html = useMemo(() => {
        return useHighlightTags(html, keywords);
    }, [html]);

   return (
       <div className={`text-default-foreground TextBlock ${isHovering ? 'TextBlockActive' : ''}`}
            ref={ref}
       >
           {_html}
       </div>
   )
};
