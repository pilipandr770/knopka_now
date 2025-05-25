# Cтворення та активація віртуального оточення
python -m venv venv
.\venv\Scripts\Activate.ps1

# Оновлення pip та встановлення залежностей
pip install --upgrade pip
pip install -r requirements.txt

# Запуск Flask-сервера на localhost:5050
$env:FLASK_APP = "app.py"
$env:FLASK_ENV = "development"
python app.py

