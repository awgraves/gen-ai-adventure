from flask import Flask
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI

app = Flask(__name__)

# OPENAI_API_KEY set via ENV
model = ChatOpenAI(model="gpt-4o-mini")


@app.route("/")
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
