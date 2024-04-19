import type { NextApiRequest, NextApiResponse } from "next";
import { unbodyService } from "@/services/unbody.service";
import { IGoogleDoc } from "@unbody-io/ts-client/build/core/documents";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IGoogleDoc | null>
) {
  const { slug } = req.query;
  if (slug === "undefined") {
    return;
  }
  return res.status(200).json(await unbodyService.getPost(slug as string));
}
