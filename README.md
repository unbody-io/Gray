# Gray
AI has transformed writing, and now it's time to enhance reading. Gray is an AI-native, open-source blogging framework built in NextJs and powered by [Unbody.io](Unbody.io). Gray makes reading more contextual and dynamic. Designed for both content creators and readers, Gray brings articles, podcasts and video blogs to life, turning reading into an interactive, personalized experience.

## Purpose:
1. **Exploration and Experimentation**: Gray uses AI to explore new ways of engaging readers, adapting content to their context and preferences.
2. **Dynamic and Contextual Reading**: Gray aims to personalize the reading experience, making content feel specifically tailored and relevant to each user.

### Features:
- AI-enabled content creation: Gray generates metadata and required context based on the blog's content for various purposes such as SEO and search prompts enhancement.
- AI-enabled content curation: Gray categorizes blog posts into creatively constructed categories to promote exploration.
- Semantic search: Users can search through the posts and within a post using natural language.
- Generative search: Users can use the search bar to search, explore, or even chat with the blog. Gray can handle any form of query in natural language, whether it's a simple concept or a complex task.
  Some example queries include:
    - `Comparing Amir's posts about AI native apps with Tomas's presentation.`
    - `Querying the future of mobility.`
    - `Asking about the main topics on the blog.`
    - `Seeking reading suggestions based on a positive sentiment about AI.`

### Upcoming Features:
- **Modular reading**: Gray enabling the reader to craft their own narrative.
- **Content transformers**: Gray will allow users to transform content into different formats and structures. For example converting a blog post into a podcast or a video blog.

### How Gray Works:

> In order to get this version of Gray to work, please duplicate [this google drive folder](https://drive.google.com/drive/u/0/folders/1byDYdJ22Gw9akX5G5wm8yVCML8GmIqB3) into your own google drive account. Then, create a new project on Unbody and connect it to the google drive folder. Finally, copy the project id and paste it in the .env.local file.
> Make sure you set the following configurations for your Unbody project:
> - Text Vectorization: `Cohere > embed-english-v3`
> - Q/A module: OpenAI
> - Generative Search: `Cohere > Command R+`
> - Enable all Textual enhancement options using Cohere if not applicable then what is the alternative
> - Enable all visual enhancement options using openAI GPT-4o

Gray allows users to create and manage their blog posts, podcasts, and video blogs on platforms like Google Drive or Github. Users can select the formats and structures they prefer. Unbody then reads this data and builds the blog content. The goal is to reduce the effort spent on data transformation, content generation, and curation.
So in short, Gray works as follows:
1. **Content Creation**: Users create content in their preferred format and structure.
2. **Content Transformation**: Unbody reads the content and generates metadata and context.
3. **Content Generation and Curation**: Unbody draft the entire blog content, categorizes it, and makes it available for reading.
4. **Reading Experience**: Users can read, search, and explore the blog content in a dynamic and contextual manner.

## Technologies Used
- [Unbody beta](https://unbody.io)
- [Next.js 13](https://nextjs.org/docs/getting-started)
- [NextUI](https://nextui.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org)
- [Framer Motion](https://www.framer.com/motion)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Use
*Coming soon*
```bash

```

## Open Source Community
Gray invites developers and content creators to enhance global reading experiences through our platform. Join us to contribute to a more intuitive and engaging digital reading environment.

## License

Licensed under the [MIT license](https://github.com/nextui-org/next-pages-template/blob/main/LICENSE).
