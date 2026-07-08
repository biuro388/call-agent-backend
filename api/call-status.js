export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  const { callId } = req.query;

  if (!callId) {
    return res.status(400).json({ error: "Brak parametru callId." });
  }

  const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY;

  if (!VAPI_PRIVATE_KEY) {
    return res.status(500).json({ error: "Brak VAPI_PRIVATE_KEY w zmiennych środowiskowych serwera." });
  }

  try {
    const vapiResponse = await fetch(`https://api.vapi.ai/call/${callId}`, {
      headers: {
        "Authorization": `Bearer ${VAPI_PRIVATE_KEY}`,
      },
    });

    const data = await vapiResponse.json();

    if (!vapiResponse.ok) {
      return res.status(vapiResponse.status).json({ error: data.message || "Błąd Vapi API", details: data });
    }

    return res.status(200).json({
      status: data.status,
      transcript: data.transcript || null,
      summary: data.summary || null,
      endedReason: data.endedReason || null,
      data,
    });
  } catch (err) {
    return res.status(500).json({ error: "Błąd serwera: " + err.message });
  }
}
