var TelegramBot = require('node-telegram-bot-api');
var CronJob = require('cron').CronJob;
var messages = require('./messages.json');
var utils = require('./utils.js');
var axios = require('axios');

var cronTask = process.env.CRON_TASK;
var chatId = process.env.CHAT_ID;
var weatherApiToken = process.env.WEATHER_API_TOKEN;
var city = process.env.WEATHER_CITY;

var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiToken}&units=metric`;
var bot = new TelegramBot(process.env.TOKEN, { polling: true });

var extJob = new CronJob(cronTask, ()=> {//ToDo add request fallback
    axios.get(url)
        .then((response)=> {
            let responseTemperature = response.data.main.temp;
            let responseWindSpeed = response.data.wind.speed;
            let timing = utils.handleWeather(responseTemperature, responseWindSpeed);
            let timingMs = timing * 60 * 1000;

            bot.sendMessage(
                chatId,
                `${messages.ventilationStarted}\n\ ${messages.temperature} ${responseTemperature} °С\n\ ${messages.ventilationTime} ${timing} минут`
            );

            setTimeout(()=> {
                bot.sendMessage(chatId, messages.ventilationCompleted);
            }, timingMs);
        })
        .catch((error) => {
            console.log(error);
        });
});

extJob.start();

bot.onText(/\/echo (.+)/, (msg, match)=> {
    let chatId = msg.chat.id;
    let resp = match[ 1 ];
    bot.sendMessage(chatId, resp);
});

bot.onText(/\/chatId/, (msg)=> {
    let chatId = msg.chat.id;
    bot.sendMessage(chatId, chatId);
});
