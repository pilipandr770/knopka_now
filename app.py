import os
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import openai
import time

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ASSISTANT_ID = os.getenv("ASSISTANT_ID")

app = Flask(__name__)
CORS(app)
openai.api_key = OPENAI_API_KEY

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    user_message = data.get('message')
    try:
        thread = openai.beta.threads.create()
        thread_id = thread.id
        openai.beta.threads.messages.create(
            thread_id=thread_id,
            role="user",
            content=user_message
        )
        run = openai.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=ASSISTANT_ID,
        )
        while True:
            run_status = openai.beta.threads.runs.retrieve(
                thread_id=thread_id,
                run_id=run.id,
            )
            if run_status.status in ["completed", "failed", "cancelled"]:
                break
            time.sleep(0.7)
        messages = openai.beta.threads.messages.list(thread_id=thread_id)
        answer = None
        for m in reversed(messages.data):
            if m.role == "assistant":
                answer = m.content[0].text.value
                break
        if answer:
            return jsonify({"answer": answer})
        else:
            return jsonify({"answer": "Асистент не дав відповіді."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

from io import BytesIO

@app.route('/voice', methods=['POST'])
def voice():
    try:
        # Приймаємо файл (FileStorage)
        audio = request.files['audio']
        # Перетворюємо у формат bytes і передаємо як file-like object
        audio_bytes = BytesIO(audio.read())
        audio_bytes.name = "voice.wav"  # потрібно для OpenAI (має бути .wav або .mp3)

        # Відправляємо у Whisper
        transcript = openai.audio.transcriptions.create(
            model="whisper-1",
            file=audio_bytes,
            response_format="text",
            language="uk"  # або "auto"
        )

        # Далі як звичайне текстове повідомлення
        user_message = transcript
        thread = openai.beta.threads.create()
        thread_id = thread.id
        openai.beta.threads.messages.create(
            thread_id=thread_id,
            role="user",
            content=user_message
        )
        run = openai.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=ASSISTANT_ID,
        )
        while True:
            run_status = openai.beta.threads.runs.retrieve(
                thread_id=thread_id,
                run_id=run.id,
            )
            if run_status.status in ["completed", "failed", "cancelled"]:
                break
            time.sleep(0.7)
        messages = openai.beta.threads.messages.list(thread_id=thread_id)
        answer = None
        for m in reversed(messages.data):
            if m.role == "assistant":
                answer = m.content[0].text.value
                break
        if answer:
            return jsonify({"answer": answer, "stt": transcript})
        else:
            return jsonify({"answer": "Асистент не дав відповіді.", "stt": transcript})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5050)

