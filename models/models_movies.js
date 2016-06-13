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
exports.findMovieInfo = function (gMOVIE, callback) {
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
                "douban.id": gMOVIE.douban.id
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

        var comments_count = gMOVIE.douban ? gMOVIE.douban.comments_count : '';
        var ratings_count = gMOVIE.douban ? gMOVIE.douban.ratings_count : '';
        var collect_count = gMOVIE.douban ? gMOVIE.douban.collect_count : '';
        var reviews_count = gMOVIE.douban ? gMOVIE.douban.reviews_count : '';
        var wish_count = gMOVIE.douban ? gMOVIE.douban.wish_count : '';

        var Metascore = gMOVIE.imdb ? gMOVIE.imdb.Metascore : '';
        var imdbRating = gMOVIE.imdb ? gMOVIE.imdb.imdbRating : '';
        var imdbVotes = gMOVIE.imdb ? gMOVIE.imdb.imdbVotes : '';
        var tomatoMeter = gMOVIE.imdb ? gMOVIE.imdb.tomatoMeter : '';
        var tomatoRating = gMOVIE.imdb ? gMOVIE.imdb.tomatoRating : '';
        var tomatoReviews = gMOVIE.imdb ? gMOVIE.imdb.tomatoReviews : '';
        var tomatoFresh = gMOVIE.imdb ? gMOVIE.imdb.tomatoFresh : '';
        var tomatoUserMeter = gMOVIE.imdb ? gMOVIE.imdb.tomatoUserMeter : '';
        var tomatoUserRating = gMOVIE.imdb ? gMOVIE.imdb.tomatoUserRating : '';
        var tomatoUserReviews = gMOVIE.imdb ? gMOVIE.imdb.tomatoUserReviews : '';
        var tomatoURL = gMOVIE.imdb ? gMOVIE.imdb.tomatoURL : '';

        console.log(tomatoURL);

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
                        "douban.rating": gMOVIE.douban.rating,                   //豆瓣评分
                        "douban.comments_count": comments_count,                 //短评数量
                        "douban.ratings_count": ratings_count,                   //评分人数
                        "douban.collect_count": collect_count,                   //看过人数
                        "douban.reviews_count": reviews_count,                   //影评数量
                        "douban.wish_count": wish_count,                         //想看人数
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