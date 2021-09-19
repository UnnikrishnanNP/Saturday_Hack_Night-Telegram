from cairosvg import svg2png


class JoyBot:
    _instance = None

    def __init__(self):
        raise RuntimeError("use instance() instead")

    @staticmethod
    def instance():
        if not JoyBot._instance:
            JoyBot._instance = JoyBot.__new__(JoyBot)
        return JoyBot._instance

    def execute(self, joy_code):
        header = "from joy import *\n"
        exec(f"{header}{joy_code}")
        svg2png(url="output.svg", write_to="output.png")
