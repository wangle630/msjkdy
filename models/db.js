var settings = require('../settings.js'),
    Db = require('mongodb').Db,
    Server = require('mongodb').Server;


//创建数据库连接实例，并导出该实例。
module.exports = new Db(
    settings.db,
    new Server(settings.host,settings.port),
    {safe : true}
);

