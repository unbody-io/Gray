import React from "react";
import NextHead from "next/head";
import {useSiteData} from "@/context/context.site-data";

export type MetaProps = {
	title?: string;
	description?: string;
	keywords?: string[];
	image?: string;
};

export const Head = (props: MetaProps) => {
	const {context} = useSiteData();

	const title = props.title || context.title;
	const description = props.description || context.seoDescription;
	const keywords = props.keywords || context.seoKeywords
	const image = props.image;

	return (
		<NextHead>
			<title>{title}</title>
			<meta
				key="viewport"
				content="viewport-fit=cover, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
				name="viewport"
			/>
			<link href="/favicon.ico" rel="icon" />
			<meta content={description} name="description" />
			<meta content={keywords.join()} name="keywords" />
			<meta content={title} property="og:title" />
			<meta content={description} property="og:description" />
			<meta content={image} property="og:image" />
			<meta content={context.siteType} property="og:type" />
			<meta content={context.title} property="og:site_name" />
		</NextHead>
	);
};
