from flask import Flask
import os

app = Flask(__name__)

API_KEY = os.environ.get('API_KEY', None)

@app.route("/")
def chat():
    return {"status": "working", "API_KEY": API_KEY}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80, debug=True)
