/**
 * Created by Ler on 16/6/6.
 */

var mongodb = require('./db');
var settings = require('../settings.js');



//根据id查找电影信息
exports.findClassic = function (eName, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            console.log(err);
            return callback(err);
        }
        db.collection(settings.col_classics, function (err, collection) {
            if (err) {

                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                "eName": eName
            }, function (err, result) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                callback(null, result);
            })
        })
    })
}


//插入电影详细数据
exports.insertClassic = function (gCLASSIC, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(settings.col_classics, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.insert(gCLASSIC, {
                safe: true
            }, function (err, result) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                callback(null, result);

            })
        })
    })
}


//更新电影信息数据
exports.updateClassic = function (gCLASSIC, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(settings.col_classics, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.updateMany(
                {"eName": gCLASSIC.eName},
                {
                    $set: {
                        update: gCLASSIC.update,
                        cName:gCLASSIC.cName,
                        logo:gCLASSIC.logo,
                        portfolio:gCLASSIC.portfolio,
                        banner:gCLASSIC.banner,
                        shortDescription:gCLASSIC.shortDescription,
                        longDescription:gCLASSIC.longDescription,
                        tags:gCLASSIC.tags,
                        doubanid : gCLASSIC.doubanid
                    }
                },
                function (err, result) {
                    if (err) {
                        mongodb.close();
                        return callback(err);
                    }
                    callback(null, result);

                })
        })
    })
}


//一次获取18个合集
exports.getEighteenClassics = function(tag,page,num, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(settings.col_classics, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};

            if (tag) {
                query = {
                    'tags': tag
                };
            }
            collection.count(query, function (err, total) {
                collection.find(query, {
                    skip: (page - 1)*num,
                    limit: num
                }).sort({
                    update : -1
                }).toArray(function (err, classics) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, classics, total);
                });
            });
        });
    });
};

//获取tags  并用distinct去重
exports.getTags = function(callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection(settings.col_classics,function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.distinct("tags",function(err,tags){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,tags)
            })
        })
    })
}

//一次获取18个合集
exports.getClassicsByMovie = function(movieid , callback) {

    console.warn(movieid)
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(settings.col_classics, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {doubanid :movieid};

                 collection.find(query).toArray(function (err, classics) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, classics);
                });
        });
    });
};
