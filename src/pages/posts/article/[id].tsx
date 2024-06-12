import {GetStaticPaths, GetStaticProps} from "next";
import DefaultLayout from "@/layouts/default";
import {getConfigs} from "@/lib/configs.common";
import {SupportedContentTypes} from "@/types/plugins.types";
import {EnhancedGDocWithContent} from "@/types/custom.type";
import {GDocPost} from "@/components/post/GDoc.Post";

type PostPageProps = {
    data: EnhancedGDocWithContent
}

const PostPage = ({data}: PostPageProps) => {
    return (
        <DefaultLayout containerMaxWidth={`max-w-screen-xl`}>
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
