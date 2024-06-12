import {SupportedContentTypes} from "@/types/plugins.types";
import {NexlogContentPluginComponentsList} from "@/context/context.site-data";
import DefaultsVideoCard from "@/components/defaults/Defaults.VideoCard";
import DefaultsArticleCard from "@/components/defaults/Defaults.ArticleCard";
import {DefaultTextBlockCard} from "@/components/defaults/Defaults.BlockCard.TextBlock";
import DefaultImageBlockCard from "@/components/defaults/Defaults.BlockCard.ImageBlock";
import DefaultSearchResultsListVideos from "@/components/defaults/Defaults.SearchResults.List.Videos";
import DefaultSearchResultsListArticle from "@/components/defaults/Defaults.SearchResults.List.Articles";
import DefaultSearchResultsListBlocks from "@/components/defaults/Defaults.SearchResults.List.Blocks";
import DefaultsArticleCardWithRefs from "@/components/defaults/Defaults.ArticleCardWithRefs";

export const defaultNexlogComponents: NexlogContentPluginComponentsList = {
    [SupportedContentTypes.VideoFile]: {
        list: DefaultSearchResultsListVideos,
        card: DefaultsVideoCard,
        card_with_refs: null
    },
    [SupportedContentTypes.GoogleDoc]: {
        list: DefaultSearchResultsListArticle,
        card: DefaultsArticleCard,
        card_with_refs: DefaultsArticleCardWithRefs
    },
    [SupportedContentTypes.TextBlock]: {
        list: DefaultSearchResultsListBlocks,
        card: DefaultTextBlockCard,
        card_with_refs: null
    },
    [SupportedContentTypes.ImageBlock]: {
        list: DefaultSearchResultsListBlocks,
        card: DefaultImageBlockCard,
        card_with_refs: null
    }
};
