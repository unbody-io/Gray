import { GetStaticPaths, GetStaticProps } from 'next';
import { IGoogleDoc } from '@unbody-io/ts-client/build/core/documents';
import { unbodyService } from '@/services/unbody.service';
import DefaultLayout from '@/layouts/default';
import { GDocPost } from '@/components/post/GDoc.Post';

type PostPageProps = {
    data: IGoogleDoc;
};

const PostPage = ({ data }: PostPageProps) => {
    return (
        <DefaultLayout containerMaxWidth={`max-w-screen-xl`}>
            <GDocPost data={data} />
        </DefaultLayout>
    );
};

export const getStaticPaths = (async () => {
    const paths = await unbodyService.getPostSlugs();
    return {
        paths: paths.map((slug) => ({ params: { slug } })),
        fallback: false
    };
}) satisfies GetStaticPaths;

export const getStaticProps = (async (context) => {
    if (!context.params) {
        return { props: {}, notFound: true };
    }

    const post = await unbodyService.getPost(context.params.slug as string);

    if (!post) {
        return { props: {}, notFound: true };
    }

    return {
        props: {
            data: post
        }
    };
}) satisfies GetStaticProps<PostPageProps>;

export default PostPage;
