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


@app.route("/themes")
def themes():
    return [{
            "description": "Play as Captain Morgan, a pirate captain seeking a lost treasure.",
            "value": "pirate",
            "imagePath": "/static/pirate.webp"
            },
            {
            "description": "Play as Major Tom, an astronaut seeking a rare mineral on an alien planet.",
            "value": "astronaut",
            "imagePath": "/static/astronaut.webp"
            },
            {
                "description": "Play as Billy the Kid, a cowboy seeking a lost gold mine.",
                "value": "cowboy",
                "imagePath": "/static/cowboy.webp"
    },
        {
                "description": "Play as Jacques Cousteau, a scuba diver seeking the lost city of Atlantis.",
                "value": "scuba",
                "imagePath": "/static/scuba.webp"
    }
    ]


@sock.route("/story")
def story(raw_ws):
    ws = WSExtender(raw_ws)
    plot = Plot(ws_conn=ws)

    while True:
        data = ws.receive_json()
        # if theme is set, create a new plot
        if "theme" in data:
            plot = Plot(ws_conn=ws, theme=data.get("theme"))
            plot.begin()
            # ws.send_json(plot.begin())
            continue
        elif "text" in data:
            plot.advance(data)
            # next_point = plot.advance(data)
            # ws.send_json(next_point)
        else:
            break


if __name__ == "__main__":
    PORT = 8080
    print(f"Running on port {8080}")
    app.run(host="0.0.0.0", port=PORT, debug=True)
