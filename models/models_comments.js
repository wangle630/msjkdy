/**
 * Created by Ler on 16/6/6.
 */

var mongodb = require('./db');
var settings = require('../settings.js');

//查找豆瓣评论已存在的评论id
exports.findComments = function(doubanid,sourcesite,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection(settings.col_comments,function(err,collection){

            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.find({
                doubanid:doubanid,
                sourcesite:sourcesite
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
exports.insertComments = function(doubanCommit,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);//错误，返回err信息
        }
        //读取 users集合
        db.collection(settings.col_comments,function(err,collection){
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



//获取一定数量随机评论的评论
exports.getCommentsByMovieID = function (movieid,num,callback){
    mongodb.open(function (err,db){
        if(err){
            return callback(err);
        }

        db.collection(settings.col_comments,function(err,collection){
            if(err){
                mongodb.close()
                return callback(err);
            }

            var query = { doubanid : movieid };

            collection.count(query,function(err,total){

                if(err){
                    mongodb.close()
                    return callback(err);
                }

                if(total > num){
                    var skpnum =  Math.round(Math.random()*parseInt(total - num))
                }else
                {
                    var skpnum = 0
                }

                console.warn(skpnum)

                collection.find(query,{
                    skip:skpnum,
                    limit: num
                }).sort({
                    randomsort: -1
                }).toArray(function(err,comments){
                    mongodb.close();
                    if(err){
                        return callback(err);
                    }
                    callback(null,comments)
                })
            })

        })
    })

}

