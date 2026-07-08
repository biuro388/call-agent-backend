export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { phoneNumber, assistantId } = req.body || {};

  if (!phoneNumber) {
    return res.status(400).json({ error: "Brak numeru telefonu (phoneNumber)." });
  }

  const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY;
  const VAPI_PHONE_NUMBER_ID = process.env.VAPI_PHONE_NUMBER_ID;
  const DEFAULT_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;

  if (!VAPI_PRIVATE_KEY) {
    return res.status(500).json({ error: "Brak VAPI_PRIVATE_KEY w zmiennych środowiskowych serwera." });
  }

  try {
    const vapiResponse = await fetch("https://api.vapi.ai/call/phone", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${VAPI_PRIVATE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assistantId: assistantId || DEFAULT_ASSISTANT_ID,
        phoneNumberId: VAPI_PHONE_NUMBER_ID,
        customer: {
          number: phoneNumber,
        },
      }),
    });

    const data = await vapiResponse.json();

    if (!vapiResponse.ok) {
      return res.status(vapiResponse.status).json({
        error: data.message || data.error || "Błąd Vapi API",
        details: data,
      });
    }

    return res.status(200).json({
      success: true,
      callId: data.id,
      status: data.status,
      data,
    });
  } catch (err) {
    return res.status(500).json({ error: "Błąd serwera: " + err.message });
  }
}
