/**
 * Created by Ler on 16/6/6.
 */

var mongodb = require('./db');
var settings = require('../settings.js');






//根据id查找电影信息
exports.findVideoInfo = function (gYOUKUDATA, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(settings.col_videos, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                id: gYOUKUDATA.id
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
exports.insertVideoInsert = function (gYOUKUDATA, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回err信息
        }
        //读取 users集合
        db.collection(settings.col_videos, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //将用户信息插入users集合
            collection.insert(gYOUKUDATA, {
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
exports.updateVideoInfo = function (gYOUKUDATA, callback) {

    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回err信息
        }

        db.collection(settings.col_videos, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            collection.updateMany(
                {id: gYOUKUDATA.id},
                {
                    $set: {
                        update: gYOUKUDATA.update,
                        comment_count: gYOUKUDATA.comment_count,
                        down_count: gYOUKUDATA.down_count,
                        view_count: gYOUKUDATA.view_count,
                        videoType: gYOUKUDATA.videoType,
                        videoSpoiler: gYOUKUDATA.videoSpoiler
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
exports.getEighteenVideos = function(name, page, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection(settings.col_videos, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {videoType:{$ne:"fullfilm"}};
            if (name) {
                query.name = name;
            }
            //使用 count 返回特定查询的文档数 total
            collection.count(query, function (err, total) {
                //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
                collection.find(query, {
                    skip: (page - 1)*24,
                    limit: 24
                }).sort({
                    update : -1
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