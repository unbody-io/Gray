import {GetStaticPaths, GetStaticProps} from "next";
import DefaultLayout from "@/layouts/default";
import {Directory, ImageBlock} from "@/types/data.types";
import {getConfigsWithSiteData} from "@/lib/configs.server";
import {GDocPostHeader} from "@/components/post/GDoc.Post.Header";
import {GDocPostBody} from "@/components/post/GDoc.Post.Body";
import {EnhancedGDocWithContent, TextBlock} from "@/types/custom.type";
import {unbody, unbodyService} from "@/services/unbody.service";
import {SupportedContentTypes} from "@/types/plugins.types";
import React from "react";
import {groupBy} from "@/lib/content-plugins/utils";
import {PostsList} from "@/components/SearchResult.List";
import {type} from "os";
import {ApiTypes} from "@/types/api.type";

type PostPageProps = {
    gdoc: EnhancedGDocWithContent;
    directory: Directory;
}

const PostPage = ({gdoc, directory}: PostPageProps) => {
    const groups = groupBy(directory.items, (item) => item.__typename);

    // @ts-ignore
    const posts: ApiTypes.Rs.SearchResults =  Object.entries(groups).map(([type, items]) => ({
        type: type as SupportedContentTypes,
        data: items
    }))

    return (
        <DefaultLayout containerMaxWidth={`max-w-screen-xl`}>
            <GDocPostHeader data={directory}
                            previewImage={directory.cover as ImageBlock}
            />
            {
                <PostsList posts={posts} refBlocks={[]}/>
            }
            <div className={"max-w-screen-xl m-auto"}>
                <GDocPostBody data={{
                    ...gdoc,
                    ...directory
                }} keywords={[]}/>
            </div>
        </DefaultLayout>
    )
}

export const getStaticPaths = (async () => {
    const {siteData: {directories}} = await getConfigsWithSiteData();
    return {
        paths: directories!.map((post) => ({params: {id: post.name}})),
        fallback: false
    }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
    if (!context.params) {
        return {props: {}, notFound: true}
    }

    const {siteData: {directories}} = await getConfigsWithSiteData();
    const directory = directories!.find((dir) => (dir.slug || dir.name) === context.params!.id);

    const gdoc = await unbodyService.getPost(directory!.slug) as EnhancedGDocWithContent;

    if (!directory) {
        return {props: {}, notFound: true}
    }

    return {
        props: {
            directory,
            gdoc,
        }
    }

}) satisfies GetStaticProps<PostPageProps>


export default PostPage
