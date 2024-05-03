FROM python:3.9

WORKDIR /app

COPY . /app

EXPOSE 80

RUN pip install -r requirements.txt

CMD ["streamlit", "run", "20_questions.py", "--server.port=80"]