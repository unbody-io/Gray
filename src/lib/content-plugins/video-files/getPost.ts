import {GetPostHandlerFn} from "@/lib/content-plugins/handler.class";
import {unbody} from "@/services/unbody.service";
import {CDefaultVideoFileWithContent} from "./types";
import {fields} from "@/lib/content-plugins/video-files/config";

const getPost: GetPostHandlerFn<CDefaultVideoFileWithContent> = async (idKey: string, idValue: string) => {
    const query = unbody.get
        .videoFile
        .where({
            [idKey]: idValue,
        })
        // @ts-ignore
        .select(...[
            ...fields,
            "subtitles.SubtitleFile.entries.SubtitleEntry.text",
            "subtitles.SubtitleFile.entries.SubtitleEntry.start",
            "subtitles.SubtitleFile.entries.SubtitleEntry.end",
            "assetId",
            "playbackId",
        ])
    const {data: {payload}} = await query.exec();
    return payload[0] as CDefaultVideoFileWithContent || null;
}

export default getPost;
