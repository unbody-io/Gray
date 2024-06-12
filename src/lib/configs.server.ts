import {NexlogConfigAll} from "@/types/nexlog.types";
import {SiteData} from "@/types/data.types";
import {readSiteData} from "@/services/data.service";
import {getConfigs} from "@/lib/configs.common";

let siteData: SiteData;

export const getConfigsWithSiteData = async (): Promise<{
        configs: NexlogConfigAll,
        siteData: SiteData
}> => {
    const configs = getConfigs();

    if (!siteData) {
        siteData = await readSiteData();
    }

    return {
        siteData,
        configs: {
            ...configs,
            copy: {
                ...configs.copy,
                personaPromptInstruction: () => configs.copy.personaPromptInstruction(siteData)
            }
        }
    }
}
