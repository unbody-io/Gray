import {CDefaultVideoFile} from "@/lib/content-plugins/video-files/types";
import {EnhancedVideoFile} from "@/types/custom.type";
import {unbody} from "@/services/unbody.service";

export const enhanceVideo = async (
    post: CDefaultVideoFile,
    additionalContext: string
): Promise<EnhancedVideoFile> => {
    console.log("Enhancing video", post.originalName);
    const { data: { payload } } = await unbody.get
        .textBlock
        .limit(1)
        .generate
        .fromOne(
            `
      This is videoFile with the name: "${post.originalName}" and the summary: "${post.autoSummary}" given by a speaker. 
      Your task is to look into the following information, and extract the name of the speaker, and the title of given talk.
      format the output in a plain json object with no additional stuff: 
      {title: "title of the talk", speaker: "name of the speaker"}
      all speakers information:
      ${additionalContext}
      \n
      \n
      ignore this line {tagName}
      `
        )
        .exec();

    const parseSpeaker = (video: any): { title: string, speaker: string } | null => {
        const extractedSpeaker = video._additional.generate.singleResult;
        if (!extractedSpeaker) return null;

        const speakerInfo = extractedSpeaker.replace(/```json|```/g, "").trim();

        try{
            const speaker = JSON.parse(speakerInfo);
            if (Array.isArray(speaker)) return speaker[0];
            return speaker;
        }catch (e){
            console.error("Error parsing speaker info", speakerInfo);
            // console.error(e);
            return null;
        }
    };

    const speaker = parseSpeaker(payload[0]);

    console.log("Enhanced video", post.originalName, speaker?.speaker, speaker?.title);

    return {
        ...post,
        speaker: speaker?.speaker || null,
        title: speaker?.title || null
    } as EnhancedVideoFile;
}

export const videoEnhancer = async (post: CDefaultVideoFile): Promise<EnhancedVideoFile> => {
    const { data: { payload: speakersDoc } } = await unbody.get
        .googleDoc
        .select("text")
        .where({
            originalName: "speakers"
        })
        .limit(1)
        .exec();
    const speakersContext = speakersDoc.length > 0 ? speakersDoc[0].text : "";
    return enhanceVideo(post, speakersContext as string);
}


export const videoComparator = (existingPost: EnhancedVideoFile, newPost: CDefaultVideoFile) => {
    // comparing only the fields that are not changed by the enhancer
    delete (existingPost as any).speaker;
    delete (existingPost as any).title;
    return JSON.stringify(existingPost) === JSON.stringify(newPost);
}
