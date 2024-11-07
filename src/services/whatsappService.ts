import axios from "axios";

const WHATSAPP_API_URL = `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

export async function sendWhatsAppMessage(to: string, body: string) {
  try {
    // O corpo da requisição deve ser o segundo parâmetro
    await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: "whatsapp",
        to,
        text: { body },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
    throw new Error("Failed to send message.");
  }
}
