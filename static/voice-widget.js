document.addEventListener("DOMContentLoaded", function () {
    const widgetContainer = document.getElementById("voice-widget-container");
    const bubble = document.getElementById("voice-bubble");
    const widget = document.getElementById("voice-widget");
    const closeBtn = document.getElementById("close-widget");
    const chatBox = document.getElementById("chat-box");
    const input = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");
    const micBtn = document.getElementById("mic-btn");

    let mediaRecorder, audioChunks = [], isRecording = false, recognition, recognizing = false;

    // === Відкриття/закриття чату
    bubble.onclick = function () {
        widget.classList.remove("hidden");
        bubble.style.display = "none";
    };
    closeBtn.onclick = function () {
        widget.classList.add("hidden");
        bubble.style.display = "flex";
    };

    // === PUSH-TO-TALK через баббл ===
    bubble.addEventListener("mousedown", startBubbleRecording);
    bubble.addEventListener("touchstart", startBubbleRecording);

    bubble.addEventListener("mouseup", stopBubbleRecording);
    bubble.addEventListener("mouseleave", stopBubbleRecording);
    bubble.addEventListener("touchend", stopBubbleRecording);

    function startBubbleRecording(e) {
        e.preventDefault();
        bubble.classList.add("active");
        // Пробуємо MediaRecorder
        if (window.isSecureContext || window.location.hostname === "localhost") {
            if (window.MediaRecorder && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => {
                        mediaRecorder = new MediaRecorder(stream);
                        audioChunks = [];
                        mediaRecorder.ondataavailable = e => { if (e.data.size > 0) audioChunks.push(e.data); };
                        mediaRecorder.onstop = () => {
                            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                            sendAudio(audioBlob);
                            stream.getTracks().forEach(track => track.stop());
                            openWidget();
                        };
                        mediaRecorder.start();
                        isRecording = true;
                    })
                    .catch(err => { startRecognition(); openWidget(); });
            } else { startRecognition(); openWidget(); }
        } else { startRecognition(); openWidget(); }
    }

    function stopBubbleRecording(e) {
        e.preventDefault();
        bubble.classList.remove("active");
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            isRecording = false;
        }
        if (recognition && recognizing) {
            recognition.stop();
        }
    }

    function openWidget() {
        widget.classList.remove("hidden");
        bubble.style.display = "none";
    }

    // Надсилання текстового повідомлення
    sendBtn.onclick = function () {
        const msg = input.value.trim();
        if (!msg) return;
        sendMessage(msg);
        input.value = "";
    };

    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") sendBtn.click();
    });

    // Кнопка мікрофона в чаті
    micBtn.onclick = function () {
        if (window.isSecureContext || window.location.hostname === "localhost") {
            if (!isRecording && window.MediaRecorder && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => {
                        mediaRecorder = new MediaRecorder(stream);
                        audioChunks = [];
                        mediaRecorder.ondataavailable = e => { if (e.data.size > 0) audioChunks.push(e.data); };
                        mediaRecorder.onstop = () => {
                            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                            sendAudio(audioBlob);
                            stream.getTracks().forEach(track => track.stop());
                        };
                        mediaRecorder.start();
                        isRecording = true;
                        micBtn.classList.add("listening");
                    })
                    .catch(err => { startRecognition(); });
            } else {
                stopRecording();
            }
        } else {
            if (!recognizing) { startRecognition(); }
            else { stopRecognition(); }
        }
    };

    function stopRecording() {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            isRecording = false;
            micBtn.classList.remove("listening");
        }
    }

    // === 2. Клієнтське розпізнавання через Web Speech API ===
    function startRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Ваш браузер не підтримує розпізнавання голосу.");
            return;
        }
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "uk-UA";
        recognition.interimResults = false;
        recognition.onstart = function () {
            recognizing = true;
            micBtn.classList.add("listening");
        };
        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            sendMessage(transcript);
        };
        recognition.onerror = function (event) {
            alert("Помилка розпізнавання голосу: " + event.error);
            recognizing = false;
            micBtn.classList.remove("listening");
        };
        recognition.onend = function () {
            recognizing = false;
            micBtn.classList.remove("listening");
        };
        recognition.start();
    }
    function stopRecognition() {
        if (recognition) recognition.stop();
    }

    // Відправка аудіо на сервер
    function sendAudio(audioBlob) {
        appendMessage("user", "🎤 (голосове повідомлення)");
        const formData = new FormData();
        formData.append("audio", audioBlob, "voice.wav");
        fetch("/voice", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    appendMessage("assistant", "Помилка: " + data.error);
                } else {
                    if (data.stt) {
                        appendMessage("user", "📝 " + data.stt);
                    }
                    appendMessage("assistant", data.answer);
                    speak(data.answer);
                }
            })
            .catch(err => {
                appendMessage("assistant", "Помилка з'єднання: " + err);
            });
    }

    // Відправка тексту на сервер
    function sendMessage(message) {
        appendMessage("user", message);
        fetch("/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        })
            .then(response => response.json())
            .then(data => {
                if (data.answer) {
                    appendMessage("assistant", data.answer);
                    speak(data.answer);
                } else if (data.error) {
                    appendMessage("assistant", "Сталася помилка: " + data.error);
                }
            })
            .catch(err => {
                appendMessage("assistant", "Помилка з'єднання: " + err);
            });
    }

    // Додаємо повідомлення в чат
    function appendMessage(role, text) {
        const div = document.createElement("div");
        div.className = "msg " + role;
        div.textContent = text;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Озвучення відповіді асистента
    function speak(text) {
        if (!("speechSynthesis" in window)) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "uk-UA";
        window.speechSynthesis.speak(utterance);
    }
});
