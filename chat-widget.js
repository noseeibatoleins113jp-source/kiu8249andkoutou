(() => {
  const scriptUrl = document.currentScript && document.currentScript.src;
  if (!scriptUrl) return;

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = new URL("chat-widget.css", scriptUrl).href;
  document.head.append(stylesheet);

  const createElement = (tagName, className, text) => {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  };

  const launcher = createElement("button", "site-chat-launcher");
  launcher.type = "button";
  launcher.setAttribute("aria-label", "質問する");
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-controls", "site-chat-panel");
  launcher.title = "質問する";

  const icon = createElement("img");
  icon.src = new URL("assets/chat-launcher.png", scriptUrl).href;
  icon.alt = "";
  icon.setAttribute("aria-hidden", "true");
  launcher.append(icon);

  const panel = createElement("section", "site-chat-panel");
  panel.id = "site-chat-panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "サイトへの質問");

  const header = createElement("header", "site-chat-header");
  const heading = createElement("div", "site-chat-heading");
  heading.append(
    createElement("small", "", "KIU8249andKOUTOU / GUIDE"),
    createElement("strong", "", "質問してみる")
  );
  const closeButton = createElement("button", "site-chat-close", "×");
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "チャットを閉じる");
  header.append(heading, closeButton);

  const intro = createElement(
    "p",
    "site-chat-intro",
    "サイト案内のデモです。返答は定型文で、生成AIには接続されていません。"
  );

  const prompts = createElement("div", "site-chat-prompts");
  prompts.setAttribute("aria-label", "質問の例");
  [
    ["鉄道について", "KOUTOUの鉄道は実在しますか？"],
    ["TOYACAについて", "TOYACAとは何ですか？"],
    ["作品を見る", "作品はどこで見られますか？"]
  ].forEach(([label, question]) => {
    const prompt = createElement("button", "site-chat-prompt", label);
    prompt.type = "button";
    prompt.dataset.question = question;
    prompts.append(prompt);
  });

  const log = createElement("div", "site-chat-log");
  log.setAttribute("role", "log");
  log.setAttribute("aria-live", "polite");
  log.setAttribute("aria-relevant", "additions");

  const status = createElement("p", "site-chat-status", "メッセージを入力するか、音声入力をお試しください。");
  status.setAttribute("role", "status");

  const form = createElement("form", "site-chat-form");
  const input = createElement("textarea", "site-chat-input");
  input.rows = 2;
  input.maxLength = 500;
  input.placeholder = "質問を入力…";
  input.setAttribute("aria-label", "質問を入力");
  input.required = true;

  const submit = createElement("button", "site-chat-submit", "送信");
  submit.type = "submit";

  const tools = createElement("div", "site-chat-tools");
  const mic = createElement("button", "site-chat-mic", "🎙 音声入力");
  mic.type = "button";
  mic.setAttribute("aria-label", "音声入力を開始");
  const speakLabel = createElement("label", "site-chat-speak");
  const speak = createElement("input");
  speak.type = "checkbox";
  speakLabel.append(speak, document.createTextNode("返答を読み上げる"));
  tools.append(mic, speakLabel);

  form.append(input, submit, tools);
  panel.append(header, intro, prompts, log, status, form);
  document.body.append(launcher, panel);

  const addMessage = (message, speaker, link) => {
    const item = createElement(
      "div",
      `site-chat-message${speaker === "user" ? " site-chat-message-user" : ""}`
    );
    item.append(createElement("span", "site-chat-message-label", speaker === "user" ? "YOU" : "GUIDE"));
    item.append(createElement("p", "", message));

    if (link) {
      const anchor = createElement("a", "", link.label);
      anchor.href = link.href;
      item.append(anchor);
    }

    log.append(item);
    while (log.children.length > 30) log.firstElementChild.remove();
    log.scrollTop = log.scrollHeight;
  };

  addMessage(
    "こんにちは。鉄道やTOYACA、作品のページをご案内します。下のボタンから質問を選ぶこともできます。",
    "guide"
  );

  const answerQuestion = (question) => {
    const text = question.toLowerCase();
    if (/(こんにちは|はじめまして)/.test(text)) {
      return { text: "こんにちは。知りたいテーマを入力するか、質問例を選んでください。" };
    }
    if (/(toyaca|トヨアカ|カード|ic)/i.test(text)) {
      return {
        text: "TOYACAはKOUTOUグループの創作世界に登場する、架空の交通系ICカード構想です。実際には利用できません。",
        link: { href: "toyaca.html", label: "TOYACAのページを見る ↗" }
      };
    }
    if (/(鉄道|電車|路線|駅|koutou)/i.test(text)) {
      return {
        text: "KOUTOUグループの鉄道は創作上の設定です。路線や駅の情報は準備中の項目を含みます。",
        link: { href: "railway.html", label: "架空鉄道のページを見る ↗" }
      };
    }
    if (/(作品|scratch|スクラッチ|プログラム)/i.test(text)) {
      return {
        text: "Scratchの乗り物作品や制作実績を公開しています。",
        link: { href: "scratch-projects.html", label: "Scratch作品を見る ↗" }
      };
    }
    if (/(動画|youtube|ユーチューブ)/i.test(text)) {
      return {
        text: "ピックアップ動画とYouTubeチャンネルは動画ページにまとめています。",
        link: { href: "videos.html", label: "動画ページを見る ↗" }
      };
    }
    if (/(安全|個人情報|プライバシー|安心)/i.test(text)) {
      return {
        text: "個人情報を公開せず、外部サービスの案内を確認して利用してください。",
        link: { href: "safety.html", label: "安心・安全ガイドを見る ↗" }
      };
    }
    if (/(連絡|問い合わせ|sns|アカウント)/i.test(text)) {
      return {
        text: "連絡先やSNSアカウントは、公式リンク集にまとめています。",
        link: { href: "links.html", label: "公式リンク集を見る ↗" }
      };
    }
    return {
      text: "このデモは決まった質問にだけ案内を返します。鉄道、TOYACA、作品、動画、安心・安全について聞いてみてください。生成AIには接続されていません。"
    };
  };

  const sendMessage = (message) => {
    const question = message.trim();
    if (!question) return;

    addMessage(question, "user");
    const answer = answerQuestion(question);
    addMessage(answer.text, "guide", answer.link);
    input.value = "";

    if (speak.checked && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(answer.text);
      utterance.lang = "ja-JP";
      window.speechSynthesis.speak(utterance);
    }
  };

  const openPanel = () => {
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    input.focus();
  };
  const closePanel = () => {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus();
  };

  launcher.addEventListener("click", () => {
    if (panel.hidden) openPanel();
    else closePanel();
  });
  closeButton.addEventListener("click", closePanel);
  prompts.addEventListener("click", (event) => {
    const prompt = event.target.closest("[data-question]");
    if (prompt) sendMessage(prompt.dataset.question);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage(input.value);
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) closePanel();
  });

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    let listening = false;
    recognition.lang = "ja-JP";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.addEventListener("start", () => {
      listening = true;
      mic.disabled = true;
      status.textContent = "音声を聞き取っています。";
    });
    recognition.addEventListener("result", (event) => {
      input.value = event.results[0][0].transcript;
      status.textContent = "認識した文章を確認し、送信してください。";
      input.focus();
    });
    recognition.addEventListener("error", (event) => {
      status.textContent = event.error === "not-allowed"
        ? "音声認識が許可されていません。文字入力をご利用ください。"
        : "音声認識を利用できませんでした。文字入力をご利用ください。";
    });
    recognition.addEventListener("end", () => {
      listening = false;
      mic.disabled = false;
    });
    mic.addEventListener("click", () => {
      if (listening) return;
      status.textContent = "ブラウザーの音声認識を開始しています。";
      try {
        recognition.start();
      } catch {
        status.textContent = "音声認識を開始できませんでした。文字入力をご利用ください。";
      }
    });
  } else {
    mic.disabled = true;
    status.textContent = "音声入力は未対応です。文字入力をご利用ください。";
  }

  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    speak.disabled = true;
  }
})();
