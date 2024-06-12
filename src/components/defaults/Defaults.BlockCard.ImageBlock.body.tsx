import {CardBody, CardFooter, CardHeader} from "@nextui-org/react";
import React, {HTMLProps} from "react";
import clsx from "clsx";
import {Link} from "@nextui-org/link";
import {Button} from "@nextui-org/button";
import {RightArrow} from "@/components/icons";
import {UnbodyImage} from "@/components/Image";
import {EnhancedImageBlock, ImageBlock} from "@/types/custom.type";


type Props = {
    data: EnhancedImageBlock;
    htmlProps?: HTMLProps<HTMLDivElement>
}

const DefaultImageBlockCardBody = (props: Props) => {
    const {data: block, htmlProps:{className = "", ...rest} = {}} = props;
    const doc = block.document? block.document[0]: null;

    return (
        <div className={clsx(["flex flex-col justify-between h-full text-sm", className])} {...rest}>
            <CardHeader className="flex-col items-start mb-0 pb-0">
                <div className="flex gap-2 justify-center align-middle text-tiny text-gray-500">
                    Image
                </div>
            </CardHeader>
            <CardBody className={"text-tiny"}>
                <UnbodyImage data={block as ImageBlock}/>
                <figcaption className={"absolute bottom-0"}>
                    {block.autoCaption as string}
                </figcaption>
            </CardBody>
            <CardFooter className={"justify-between pt-0 pb-0 mb-0"}>
                {doc &&
                    <Link href={`/posts/${doc.slug}#p-${block.order}`}>
                        <p className="overflow-clip text-gray-500 text-tiny">
                            {doc.title}
                        </p>
                    </Link>
                }
                <Button className="text-tiny"
                        size={"sm"}
                        variant={"light"}
                        isIconOnly={true}
                >
                    <RightArrow/>
                </Button>
            </CardFooter>
        </div>
    )
}

export default DefaultImageBlockCardBody;
