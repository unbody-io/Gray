import React from "react";
import DefaultSearchResultsList, {SearchResultListProps} from "@/components/defaults/Defaults.SearchResults.List";

const DefaultSearchResultsListArticle = (props: SearchResultListProps) => {
    return (
        <DefaultSearchResultsList listClassName={"grid grid-cols-1 gap-4"}
                                  {...props}
        />
    )
}

export default DefaultSearchResultsListArticle;
