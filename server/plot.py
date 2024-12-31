from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from typing_extensions import Annotated, TypedDict

# OPENAI_API_KEY set via ENV
MODEL = "gpt-4o-mini"
MAX_RETRIES = 3
TIMEOUT = 5

PIRATE = "a pirate named Captain Morgan who is seeking a lost treasure"

ASTRONAUT = "an astronaut named Major Tom who is seeking a rare mineral on an alien planet"

COWBOY = "a cowboy named Billy the Kid who is seeking a lost gold mine"

SCUBA = "a scuba diver named Jacques Cousteau who is seeking the lost city of Atlantis"


def get_person_for_theme(theme):
    if theme == "pirate":
        return PIRATE
    elif theme == "astronaut":
        return ASTRONAUT
    elif theme == "cowboy":
        return COWBOY
    elif theme == "scuba":
        return SCUBA
    else:
        return PIRATE


system_template = """
You are the guide of a story about {person}.

Your goal is to create a branching narrative experience where each choice by the player leads to a new path, ultimately determining their fate.

You must ALWAYS provide the player with 2 to 3 options for each turn in the story, unless the story is at an end.

The player will respond with 1 of those choices at a time to continue the story.

Here are some rules to follow:
1. The player is {person}.
2. Start by greeting the player by name and explaining their goal. Ask them to choose an appropriately themed weapon.
3. Throughout the story, the player can only use the weapon they chose at the beginning. If they lose this weapon, they are unarmed.
4. Each step in the story should only be a few sentences long.
5. Most of the narrative paths should end in the player's death.
6. Only clever decisions made by the player should lead to the story ending in success.
7. The whole story should only be about 5 steps. 
8. At the end of the story include the text "THE END."
9. Do NOT include numbering in the options - just the text of the option.
"""


class PlotData(TypedDict):
    text: Annotated[str, ..., "The next turn in the plot"]
    options: Annotated[list[str],
                       ...,
                       "The options for the player to choose from. If end of story, use 'THE END.' do not include any question marks or numbers in the options"]


class Plot:
    def __init__(self, ws_conn, theme="pirate"):
        self.ws_conn = ws_conn

        self.protagonist = get_person_for_theme(theme)
        self.model = ChatOpenAI(
            model=MODEL, max_retries=MAX_RETRIES, timeout=TIMEOUT)
        self.system_message = system_template

        self.call_count = 0
        self.chat_history: list[BaseMessage] = []

    def _test_print(self):
        chunks = []
        tmp_template = ChatPromptTemplate.from_messages(
            [("human", "what color is the ocean?")])

        class TestOutput(TypedDict):
            text: Annotated[str, ..., "The text of the response"]

        chain = tmp_template | self.model.with_structured_output(
            TestOutput, method="json_schema")
        for chunk in chain.stream({}):
            chunks.append(chunk)
            print(chunk, end="|", flush=True)

    def _call_model(self):
        # oddly, using SystemMessage class breaks the string interpolation
        # using the tuple instead
        prompt_template = ChatPromptTemplate.from_messages(
            [("system", self.system_message)] + self.chat_history)

        chain = (prompt_template | self.model.with_structured_output(
            PlotData, method="json_schema"))

        final = PlotData(text="", options=["THE END."])

        self.call_count += 1
        print(f"{self.call_count} CALL", flush=True)

        print(prompt_template.invoke(
            {"person": self.protagonist}).to_string(), flush=True)

        for chunk in chain.stream({"person": self.protagonist}):
            print(chunk, flush=True)
            self.ws_conn.send_json(chunk)
            final = chunk

        self.chat_history.append(AIMessage(final.get("text", "")))

    def begin(self):
        self._call_model()

    def advance(self, data):
        human_input = data.get("text")
        self.chat_history.append(HumanMessage(human_input))
        self._call_model()

    def poke(self):
        print("Poking the model", flush=True)
        self._call_model()
