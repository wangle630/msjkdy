/**
 * Created by Ler on 16/6/6.
 */

var mongodb = require('./db');
var settings = require('../settings.js');

//有用户名密码的时候、先认证
////db.authenticate('dbuser','123456',function(){
//    db.collection(......){
//}
//})

//根据id查找电影信息
exports.findMovieInfo = function (doubanid, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(settings.col_movies, function (err, collection) {
            if (err) {

                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                "douban.id": doubanid
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
exports.insertMovieInsert = function (gMOVIE, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回err信息
        }
        //读取 users集合
        db.collection(settings.col_movies, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //将用户信息插入users集合
            collection.insert(gMOVIE, {
                safe: true
            }, function (err, result) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                callback(null, result);//成功！err为null，并返回存储后的用户文档

            })
        })
    })
}


//更新电影信息数据
exports.updateMovieInfo = function (gMOVIE, callback) {

    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回err信息
        }

        db.collection(settings.col_movies, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            collection.updateMany(
                {"douban.id": gMOVIE.douban.id},
                {
                    $set: {
                        update: gMOVIE.update,
                        douban: gMOVIE.douban,
                        imdb: gMOVIE.imdb
                    }
                },
                function (err, result) {
                    if (err) {
                        mongodb.close();
                        return callback(err);
                    }
                    callback(null, result);//成功！err为null，并返回存储后的用户文档

                })
        })
    })
}


//一次获取18篇文章
exports.getMoviesByClassic = function (classic, page, num, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(settings.col_movies, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (classic) {
                query = {'douban.id': {$in: classic}};
            }
            collection.count(query, function (err, total) {
                collection.find(query, {
                    skip: (page - 1) * num,
                    limit: num
                }).sort({
                    update: -1
                }).toArray(function (err, movies) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, movies, total);
                });
            });
        });
    });
};


//保存视频的时候更新电影信息
exports.updateMovieByVideo = function (doubanid, videoid, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回err信息
        }

        db.collection(settings.col_movies, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            collection.updateMany(
                {'douban.id': {$in: doubanid}},
                {
                    $addToSet: {videoid: videoid}
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


//保存完整影片的时候更新电影信息
exports.updateMovieByFilm = function (doubanid, filmid, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回err信息
        }

        db.collection(settings.col_movies, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            collection.updateMany(
                {'douban.id': {$in: doubanid}},
                {
                    $addToSet: {filmid: filmid}
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


//更新metacritic电影基本信息
exports.updateMovieByMetacritic = function (metacriticInfo, doubanid, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回err信息
        }

        db.collection(settings.col_movies, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            collection.updateOne(
                {'douban.id': doubanid},
                {
                    $set: {
                        metacritic: metacriticInfo
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






