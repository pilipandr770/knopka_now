# 🎤 Voice Widget - AI Assistant

Інтерактивний голосовий віджет з підтримкою OpenAI Assistant API для веб-сайтів.

## ✨ Особливості

- 🎙️ **Голосове введення** - натисніть і говоріть
- 🤖 **AI Assistant** - підтримка OpenAI Assistant API
- 🌐 **Веб-інтеграція** - легко вбудувати в будь-який сайт
- 📱 **Адаптивний дизайн** - працює на всіх пристроях
- 🚀 **Швидке розгортання** - готово для Render.com

## 🛠️ Технології

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **AI**: OpenAI Assistant API
- **Audio**: Web Audio API
- **Deploy**: Render.com

## 🚀 Швидкий старт

### Локальна установка

1. **Клонуйте репозиторій:**
```bash
git clone https://github.com/pilipandr770/knopka_now.git
cd knopka_now
```

2. **Створіть віртуальне середовище:**
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# або source venv/bin/activate  # Linux/Mac
```

3. **Встановіть залежності:**
```bash
pip install -r requirements.txt
```

4. **Налаштуйте environment variables:**
```bash
# Створіть файл .env
OPENAI_API_KEY=your_openai_api_key
ASSISTANT_ID=your_assistant_id
FLASK_SECRET=your_secret_key
```

5. **Запустіть додаток:**
```bash
python app.py
```

Відкрийте http://localhost:5050

## 🌐 Розгортання на Render

1. **Fork цей репозиторій**
2. **Підключіть до Render.com**
3. **Встановіть Environment Variables:**
   - `OPENAI_API_KEY` - ваш OpenAI API ключ
   - `ASSISTANT_ID` - ID вашого OpenAI Assistant
   - `FLASK_SECRET` - секретний ключ для Flask

Render автоматично знайде `render.yaml` і розгорне додаток.

## 📁 Структура проекту

```
knopka_now/
├── app.py              # Основний Flask додаток
├── requirements.txt    # Python залежності
├── render.yaml        # Конфігурація Render
├── .gitignore         # Git ignore файл
├── static/
│   ├── style.css      # Стилі віджета
│   └── script.js      # JavaScript логіка
├── templates/
│   └── index.html     # HTML шаблон
└── README.md          # Документація
```

## 🎯 Використання

### Інтеграція у ваш сайт

Додайте iframe на вашу сторінку:

```html
<iframe 
  src="https://your-app.onrender.com" 
  width="100%" 
  height="600px"
  frameborder="0">
</iframe>
```

### API Endpoints

- `GET /` - Головна сторінка з віджетом
- `POST /voice` - Обробка голосових повідомлень

## 🔧 Налаштування

### OpenAI Assistant

1. Створіть Assistant в OpenAI Dashboard
2. Скопіюйте Assistant ID
3. Додайте у environment variables

### Customization

Змініть стилі у `static/style.css` або логіку у `static/script.js`.

## 🐛 Відомі проблеми

- Потрібен HTTPS для роботи з мікрофоном
- Підтримка браузерів: Chrome, Firefox, Safari
- Render free plan має обмеження часу відповіді

## 🤝 Внесок

1. Fork проект
2. Створіть feature branch
3. Зробіть commit
4. Push у branch
5. Відкрийте Pull Request

## 📝 Ліцензія

MIT License - дивіться [LICENSE](LICENSE) файл.

## 🆘 Підтримка

Якщо виникли проблеми:
- Відкрийте [Issue](https://github.com/pilipandr770/knopka_now/issues)
- Перевірте [Документацію](https://github.com/pilipandr770/knopka_now/wiki)

## 📞 Контакти

- GitHub: [@pilipandr770](https://github.com/pilipandr770)
- Проект: [knopka_now](https://github.com/pilipandr770/knopka_now)

---

⭐ **Якщо проект був корисним, поставте зірочку!**