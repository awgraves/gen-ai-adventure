from flask import Flask
from flask_cors import CORS
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI

app = Flask(__name__)
CORS(app, origins=["http://localhost"])

# OPENAI_API_KEY set via ENV
model = ChatOpenAI(model="gpt-4o-mini")


@app.route("/test")
def index():
    return {"text": "Hello World!"}


@app.route("/chat")
def chat():
    output = model.invoke([
        HumanMessage(content="Hi! I'm Bob"),
        HumanMessage(content="Whats my name?")
    ])
    print(output.content)
    return {"response": output.content}


if __name__ == "__main__":
    PORT = 8080
    print(f"Running on port {8080}")
    app.run(host="0.0.0.0", port=PORT, debug=True)
