from flask import Flask
from flask_cors import CORS
from flask_sock import Sock
from plot import Plot

import json

app = Flask(__name__)
CORS(app, origins=["http://localhost"])
sock = Sock(app)


class WSExtender:
    def __init__(self, ws):
        self.ws = ws

    def receive_json(self):
        rawData = self.ws.receive()
        data = json.loads(rawData)
        return data

    def send_json(self, raw_data):
        data = json.dumps(raw_data)
        self.ws.send(data)


@app.route("/test")
def index():
    return {"text": "Hello World!"}


@sock.route("/story")
def story(raw_ws):
    ws = WSExtender(raw_ws)
    plot = Plot()

    while True:
        data = ws.receive_json()
        # if theme is set, create a new plot
        if "theme" in data:
            plot = Plot(theme=data.get("theme"))
            ws.send_json({"text": "Starting..."})
            ws.send_json(plot.begin())
            continue
        elif "text" in data:
            next_point = plot.advance(data)
            ws.send_json(next_point)
        else:
            break


if __name__ == "__main__":
    PORT = 8080
    print(f"Running on port {8080}")
    app.run(host="0.0.0.0", port=PORT, debug=True)
