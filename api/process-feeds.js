export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "You are an AI notification sorting engine for university students. Merge duplicate topics, remove casual chatter, identify deadlines and urgency. Return ONLY a JSON array. Each object must contain urgency, headline, action_item and deadline.",
            },
            {
              role: "user",
              content: messages.map((m) => `- ${m}`).join("\n"),
            },
          ],
          temperature: 0,
        }),
      }
    );

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "[]";

    return res.status(200).json(JSON.parse(text));
  } catch (error) {
    return res.status(500).json({ error: "AI processing failed" });
  }
}
