const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");
const chatLog = document.querySelector("#chat-log");
const voiceStatus = document.querySelector("#voice-status");
const voiceInputButton = document.querySelector("#voice-input-button");
const voiceOutput = document.querySelector("#voice-output");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function addMessage(message, speaker) {
  const item = document.createElement("div");
  item.className = `chat-message chat-${speaker}`;

  const label = document.createElement("span");
  label.textContent = speaker === "user" ? "YOU" : "DEMO";

  const text = document.createElement("p");
  text.textContent = message;

  item.append(label, text);
  chatLog.append(item);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function getDemoReply(message) {
  const normalized = message.toLowerCase();

  if (normalized.includes("こんにちは") || normalized.includes("はじめまして")) {
    return "こんにちは。これは音声UIのデモです。生成AIには接続されていません。";
  }
  if (normalized.includes("toyaca")) {
    return "TOYACAは、KIU8249andKOUTOUの創作世界に登場する架空の交通系ICカード構想です。実際には利用できません。";
  }
  if (/(鉄道|電車|路線|駅)/.test(normalized)) {
    return "KOUTOUグループの鉄道は創作上の設定です。路線や駅の情報はサイトの鉄道ページをご覧ください。";
  }
  if (/(安全|個人情報|プライバシー)/.test(normalized)) {
    return "個人情報を公開せず、外部サービスの案内を確認して利用してください。詳しくは安心・安全ガイドをご覧ください。";
  }

  return "これは定型文で返すデモのため、その質問には回答できません。生成AIには接続されていません。";
}

function sendMessage(message) {
  const cleanMessage = message.trim();
  if (!cleanMessage) return;

  addMessage(cleanMessage, "user");
  const reply = getDemoReply(cleanMessage);
  addMessage(reply, "assistant");
  chatInput.value = "";

  if (voiceOutput.checked && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.lang = "ja-JP";
    window.speechSynthesis.speak(utterance);
  }
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(chatInput.value);
});

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  let listening = false;
  recognition.lang = "ja-JP";
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;

  recognition.addEventListener("start", () => {
    listening = true;
    voiceInputButton.disabled = true;
    voiceStatus.textContent = "音声を聞き取っています。話し終わったら内容を確認して送信してください。";
  });

  recognition.addEventListener("result", (event) => {
    const transcript = event.results[0][0].transcript;
    chatInput.value = transcript;
    voiceStatus.textContent = "認識した文章を確認し、送信してください。";
    chatInput.focus();
  });

  recognition.addEventListener("error", (event) => {
    voiceStatus.textContent = event.error === "not-allowed"
      ? "音声認識が許可されていません。文字入力をご利用ください。"
      : "音声認識を利用できませんでした。文字入力をご利用ください。";
  });

  recognition.addEventListener("end", () => {
    listening = false;
    voiceInputButton.disabled = false;
    voiceInputButton.textContent = "音声入力を開始";
  });

  voiceInputButton.addEventListener("click", () => {
    if (listening) return;

    voiceInputButton.textContent = "音声入力中…";
    voiceStatus.textContent = "ブラウザーの音声認識を開始しています。";
    try {
      recognition.start();
    } catch (error) {
      voiceInputButton.textContent = "音声入力を開始";
      voiceStatus.textContent = "音声認識を開始できませんでした。文字入力をご利用ください。";
    }
  });
} else {
  voiceInputButton.disabled = true;
  voiceStatus.textContent = "このブラウザーは音声入力に対応していません。文字入力をご利用ください。";
}

if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
  voiceOutput.disabled = true;
  voiceOutput.parentElement.title = "このブラウザーは音声読み上げに対応していません。";
}
