// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { isValidBody } from "@/utils/isValidBody";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  data: string[];
  message?: string;
};

type ReqBody = {
  inputs: { source_sentence: string; sentences: string[] };
};

const HF_API_URL =
  "https://api-inference.huggingface.co/models/sentence-transformers/msmarco-distilbert-base-v2";

async function fetchSimilarSentences(data: ReqBody) {
  const response = await fetch(HF_API_URL, {
    headers: {
      Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed", data: [] });
    return;
  }
  if (!isValidBody<ReqBody>(JSON.parse(req.body), ["inputs"])) {
    return res.status(402).send({ message: "Malformed body", data: [] });
  }

  const { body } = req;

  try {
    const similarityScores = await fetchSimilarSentences(JSON.parse(body));
    res.status(200).json({ data: similarityScores });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error in fetching similarity scores", data: [] });
  }
}
