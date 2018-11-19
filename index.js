process.env.NODE_ENV !== 'production' ? require('dotenv').load() : '';
require('./bot.js');
require('./web.js');