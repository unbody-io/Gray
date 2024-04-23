# Nextlog

AI has transformed writing, and now it's time to enhance reading. Nextlog is an AI-native, open-source blogging framework built on [Unbody.io](Unbody.io) that makes reading more contextual and dynamic. Designed for both content creators and readers, Nextlog brings articles to life, turning reading into an interactive, personalized experience.

https://github.com/unbody-io/Nexlog/assets/7159454/6d350499-7ed1-4212-b310-cb18734929a8


## Purpose:
1. **Exploration and Experimentation**: Nextlog uses AI to explore new ways of engaging readers, adapting content to their context and preferences.
2. **Dynamic and Contextual Reading**: Nextlog aims to personalize the reading experience, making content feel specifically tailored and relevant to each user.

## Unique Features:
1. **Automated Content Curation**: Nextlog automates the extraction of keywords, topics, and entities, generates categories, and crafts summaries to enhance content discoverability and organization.
2. **On-Demand Generative Search**: Nextlog interprets questions in natural language and provides immediate, conversational responses, making user interactions feel more like a dialogue.
3. **Generative Q&A**: Nextlog generates answers to user queries on-the-fly and identifies matching content from within the platform, ensuring users receive precise and relevant information.
4. **Modular Narrative**: Nextlog allows readers to customize their content consumption by selecting topics or directing the narrative, creating a personalized and interactive reading journey.

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
In order to get this to work, you need 
1. Setup an account on Unbody.io.
2. Create a new project and add Google Drive as a source (make sure to enable all "Auto" fields as well as `Generative-search` feature
3. Currently this code-base only works with GoogleDocs in a folder on Google Drive, so you need to have your posts in form of Google Docs
4. Once source is initialized, you can create a API key and together with your project ID, you need to add them to the `.env.local`
5. It's all ready 
```bash
yarn dev
yarn build
yarn start
```

## Open Source Community
Nextlog invites developers and content creators to enhance global reading experiences through our platform. Join us to contribute to a more intuitive and engaging digital reading environment.

## License

Licensed under the [MIT license](https://github.com/nextui-org/next-pages-template/blob/main/LICENSE).
