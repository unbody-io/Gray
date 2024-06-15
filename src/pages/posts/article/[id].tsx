import {GetStaticPaths, GetStaticProps} from "next";
import DefaultLayout from "@/layouts/default";
import {getConfigs} from "@/lib/configs.common";
import {SupportedContentTypes} from "@/types/plugins.types";
import {EnhancedGDocWithContent} from "@/types/custom.type";
import {GDocPost, isPreviewImage} from "@/components/post/GDoc.Post";
import {useMemo} from "react";
import {IImageBlock, ITextBlock} from "@unbody-io/ts-client/build/core/documents";
import {ImageBlock} from "@/types/data.types";

type PostPageProps = {
    data: EnhancedGDocWithContent
}

const PostPage = ({data}: PostPageProps) => {
    const previewImage = useMemo(() => {
        return (data.blocks as (ITextBlock | IImageBlock)[]).find(isPreviewImage) as ImageBlock
    }, [data.blocks]);
    return (
        <DefaultLayout containerMaxWidth={`max-w-screen-xl`}
                       metaProps={{
                           title: data.title as string,
                           description: data.autoSummary as string,
                           keywords: data.autoKeywords as string[],
                           image: previewImage? `${previewImage.url}?w=800` : undefined
                       }}
        >
            <GDocPost data={data}/>
        </DefaultLayout>
    )
}

export const getStaticPaths = (async () => {
    const {contentPlugins, contentConfig} = getConfigs();
    const plugin = contentPlugins.find((plugin) => plugin.type === SupportedContentTypes.GoogleDoc);

    const posts = await plugin?.fetcher(contentConfig.postsPath);

    return {
        paths: posts!.map((post) => ({params: {id: post[plugin!.identifier]}})),
        fallback: false
    }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
    if (!context.params) {
        return {props: {}, notFound: true}
    }

    const plugin = getConfigs().contentPlugins.find((plugin) => plugin.type === SupportedContentTypes.GoogleDoc);

    if (!plugin) {
        return {props: {}, notFound: true}
    }

    const post = await plugin.getPost(context.params.id as string);

    if (!post) {
        return {props: {}, notFound: true}
    }

    return {
        props: {
            data: post
        }
    }

}) satisfies GetStaticProps<PostPageProps>


export default PostPage
