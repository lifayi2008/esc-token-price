let express = require('express');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let index = require('./routes/index');
let jobs = require('./jobs');
let log4js = require('log4js');


log4js.configure({
    appenders: {
        file: { type: 'dateFile', filename: 'logs/esc-token-price.log', pattern: ".yyyy-MM-dd.log", compress: true, },
        console: { type: 'stdout'}
    },
    categories: { default: { appenders: ['file', 'console'], level: 'info' } },
    pm2: true,
    pm2InstanceVar: 'INSTANCE_ID'
});
global.logger = log4js.getLogger('default');
global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

let app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api', index);

jobs.run()

module.exports = app;
