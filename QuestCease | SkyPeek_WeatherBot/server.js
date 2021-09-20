const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const express=require('express');
const bodyParser=require("body-parser");
const { ifError } = require("assert");
const app=express();
const fs=require('fs');
var PORT=process.env.PORT || 5000;
app.use(bodyParser.urlencoded({extended: true}));


app.get("/",(req,res)=>{
  res.sendFile(__dirname+'/index.html');
})

const token = '2004405917:AAHaq2N-8V_mq27GLkCnq_1TESYZ9p0rN_s';


const appID = 'b88bc7055ed0f1a63418a30ef541c06a';

const weatherEndpoint = (city) => (
  `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&&appid=${appID}`
);


const weatherIcon = (icon) => `http://openweathermap.org/img/w/${icon}.png`;


const weatherHtmlTemplate = (name, main, weather, wind, clouds) => (
  `The weather in <b>${name}</b>:
<b>${weather.main}</b> - ${weather.description}
Temperature: <b>${main.temp} °C</b>
Pressure: <b>${main.pressure} hPa</b>
Humidity: <b>${main.humidity} %</b>
Wind: <b>${wind.speed} meter/sec</b>
Clouds: <b>${clouds.all} %</b>
`
);


const bot = new TelegramBot(token, {
  polling: true
});


const getWeather = (chatId, city) => {
  const endpoint = weatherEndpoint(city);

  axios.get(endpoint).then((resp) => {
    const {
      name,
      main,
      weather,
      wind,
      clouds
    } = resp.data;

    bot.sendPhoto(chatId, weatherIcon(weather[0].icon))
    bot.sendMessage(
      chatId,
      weatherHtmlTemplate(name, main, weather[0], wind, clouds), {
        parse_mode: "HTML"
      }
    );
  }, error => {
    console.log("error", error);
    bot.sendMessage(
      chatId,
      `Ooops...I couldn't be able to get weather for <b>${city}</b>`, {
        parse_mode: "HTML"
      }
    );
  });
}


bot.onText(/\/weather/, (msg, match) => {
  const chatId = msg.chat.id;
  const city = match.input.split(' ')[1];

  if (city === undefined) {
    bot.sendMessage(
      chatId,
      `Please provide city name`
    );
    return;
  }
  getWeather(chatId, city);
});


bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Welcome at <b>MyTestWeatherInfoBot</b>, thank you for using my service
    
Available commands:

/weather <b>city</b> - shows weather for selected <b>city</b>
  `, {
      parse_mode: "HTML"
    }
  );
});

app.listen(PORT,(req,res)=>{
  console.log("Server running on port!!");
})