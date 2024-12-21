from langchain_core.messages import BaseMessage, SystemMessage, HumanMessage
from langchain_openai import ChatOpenAI

# OPENAI_API_KEY set via ENV
model = ChatOpenAI(model="gpt-4o-mini")

template = """
You are the guide of a story about a pirate named Captain Morgan who is seeking a lost treasure.

Your goal is to create a branching narrative experience where each choice leads to a new path, ultimately determining the fate of Captain Morgan.

Here are some rules to follow:
1. Always refer to the player as captain morgan.
2. Start by asking the player to choose an appropriately themed weapon.
3. Have a few paths that lead to success
4. Have a few paths that lead to death.  If the user dies, end the story with THE END.
"""


class Plot:
    def __init__(self, theme="pirate"):
        self.theme = theme
        self.model = model
        self.chat_history: list[BaseMessage] = []

    def _call_model(self):
        answer = model.invoke(self.chat_history)
        self.chat_history.append(answer)
        return answer

    def begin(self):
        self.chat_history = [
            SystemMessage(template)
        ]

        answer = self._call_model()
        return {"text": answer.content}

    def advance(self, data):
        human_input = data.get("text")
        self.chat_history.append(HumanMessage(human_input))

        answer = self._call_model()
        return {"text": answer.content, "debug": [x.content for x in self.chat_history]}
