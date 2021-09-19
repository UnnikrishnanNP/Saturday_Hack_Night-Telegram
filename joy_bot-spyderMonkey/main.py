import os
from requests import post
from telebot import TeleBot
from keep_alive import keep_alive
from joy_bot import JoyBot

app = TeleBot(__name__)
TOKEN = os.environ["TOKEN"]
joyBot = JoyBot.instance()


@app.route(".*")
def command(message):
    chat_dest = message["chat"]["id"]
    user_msg = message["text"]
    if user_msg == '/start' or message == '/help':
      app.send_message(chat_dest, 'Send me a joy code and i will render the image for you!')
    else:
      if os.environ["BUSY"] == "TRUE":
          app.send_message(
              chat_dest, "sorry working on a code right now, please wait some time!"
          )
      os.environ["BUSY"] = "TRUE"
      joyBot.execute(user_msg)
      image = open("output.png", "rb")
      status = post(
          f"https://api.telegram.org/bot{TOKEN}/sendPhoto?chat_id={chat_dest}",
          files={"photo": image.read()},
      )
      os.environ["BUSY"] = "FALSE"


if __name__ == "__main__":
    app.config["api_key"] = TOKEN
    keep_alive()
    app.poll()
