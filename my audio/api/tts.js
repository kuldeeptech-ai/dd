import textToSpeech from "@google-cloud/text-to-speech";

const client = new textToSpeech.TextToSpeechClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  }
});

export default async function handler(req, res) {
  const { text, language, gender, speed, pitch } = req.body;

  const voiceMap = {
    "hi-IN": {
      MALE: "hi-IN-Wavenet-B",
      FEMALE: "hi-IN-Wavenet-A"
    },
    "en-US": {
      MALE: "en-US-Wavenet-D",
      FEMALE: "en-US-Wavenet-F"
    }
  };

  const request = {
    input: { text },
    voice: {
      languageCode: language,
      name: voiceMap[language][gender],
      ssmlGender: gender
    },
    audioConfig: {
      audioEncoding: "MP3",
      speakingRate: Number(speed),
      pitch: Number(pitch)
    }
  };

  const [response] = await client.synthesizeSpeech(request);
  const audioBase64 = Buffer.from(response.audioContent).toString("base64");

  res.status(200).json({
    audio: `data:audio/mp3;base64,${audioBase64}`
  });
}
