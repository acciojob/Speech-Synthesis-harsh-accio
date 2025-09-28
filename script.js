const textarea = document.querySelector("textarea");
const speak = document.querySelector("#speak");
const stop = document.querySelector("#stop");
const voicesDropdown = document.getElementById("voices");

function populateVoiceList() {
  if (typeof speechSynthesis === "undefined") {
    return;
  }
  const voices = speechSynthesis.getVoices();
  voicesDropdown.innerHTML = ""; // clear old options

  for (const voice of voices) {
    const option = document.createElement("option");
    option.textContent = `${voice.name} (${voice.lang})`;
    if (voice.default) {
      option.textContent += " — DEFAULT";
    }
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);
    voicesDropdown.appendChild(option);
  }
}

populateVoiceList();
if (
  typeof speechSynthesis !== "undefined" &&
  speechSynthesis.onvoiceschanged !== undefined
) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

speak.addEventListener("click", () => {
  const text = textarea.value.trim();
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);

  // ✅ set selected voice
  const selectedOption = voicesDropdown.selectedOptions[0];
  if (selectedOption) {
    const selectedName = selectedOption.getAttribute("data-name");
    const voices = speechSynthesis.getVoices();
    const voice = voices.find(v => v.name === selectedName);
    if (voice) utterance.voice = voice;
  }
  const pitch = document.querySelector('[name="pitch"]').value;
 const rate = document.querySelector('[name="rate"]').value;
	utterance.pitch=pitch;
	utterance.rate=rate;
  speechSynthesis.cancel(); // clear any ongoing speech
  speechSynthesis.speak(utterance);
});

stop.addEventListener("click", () => {
  speechSynthesis.cancel();
});
