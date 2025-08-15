export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { videoUrl, audioUrl, makeMp4 } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ error: "Missing videoUrl" });
  }

  const muxTokenId = process.env.MUX_TOKEN_ID;
  const muxTokenSecret = process.env.MUX_TOKEN_SECRET;

  if (!muxTokenId || !muxTokenSecret) {
    return res.status(500).json({ error: "Mux API credentials not set" });
  }

  try {
    const muxRes = await fetch("https://api.mux.com/video/v1/assets", {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${muxTokenId}:${muxTokenSecret}`).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: videoUrl,
        playback_policy: ["public"],
        mp4_support: makeMp4 ? "standard" : "none",
      }),
    });

    const data = await muxRes.json();
    return res.status(muxRes.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}