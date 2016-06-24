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
            console.log(err);
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
                        douban:gMOVIE.douban,
                        imdb : gMOVIE.imdb
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
exports.getEighteenMovies = function(name, page, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合

        db.collection(settings.col_movies, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (name) {
                query.name = name;
            }
            //使用 count 返回特定查询的文档数 total
            collection.count(query, function (err, total) {
                //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
                collection.find(query, {
                    skip: (page - 1)*18,
                    limit: 18
                }).sort({
                    "douban.rating.average" : -1,
                    "imdb.imdbRating" : -1
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


//查找豆瓣评论已存在的评论id
exports.findDoubanCommits = function(doubanid,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection(settings.col_commits,function(err,collection){

            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.find({
                doubanid:doubanid
            }).toArray(function(err,docs){
                if(err){
                    mongodb.close();
                    return callback(err);
                }
                callback(docs);
            })
        })
    })
}


//插入豆瓣评论信息
exports.insertDoubanCommit = function(doubanCommit,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取 users集合
        db.collection(settings.col_commits,function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            //将用户信息插入users集合
            collection.insertMany(doubanCommit, {
                safe: true
            },function(err,result){
                if(err){
                    mongodb.close();
                    return callback(err);
                }
                callback(null,result);//成功！err为null，并返回存储后的用户文档

            })
        })
    })
}