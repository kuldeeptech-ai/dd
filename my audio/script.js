let voices = [];
const voiceSelect = document.getElementById("voiceSelect");

function loadVoices() {
  voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = "";

  voices.forEach((voice, i) => {
    if (voice.lang.includes("hi") || voice.lang.includes("en")) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `${voice.name} (${voice.lang})`;
      voiceSelect.appendChild(option);
    }
  });
}

speechSynthesis.onvoiceschanged = loadVoices;

function speakText() {
  const text = document.getElementById("text").value.trim();
  if (!text) {
    alert("Text likhiye");
    return;
  }

  const utter = new SpeechSynthesisUtterance(text);
  const selectedVoice = voices[voiceSelect.value];

  if (selectedVoice) {
    utter.voice = selectedVoice;
  }

  utter.rate = 0.95;
  utter.pitch = 1;
  utter.volume = 1;
  utter.lang = selectedVoice?.lang || "hi-IN";

  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

function stopSpeech() {
  speechSynthesis.cancel();
}
