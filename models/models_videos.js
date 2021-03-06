/**
 * Created by Ler on 16/6/6.
 */

var mongodb = require('./db');
var settings = require('../settings.js');


//根据id查找视频信息
exports.findVideo = function (videoid, callback) {
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
                id: videoid
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


//根据id查找完整影片
exports.findFilm = function (videoid, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(settings.col_films, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                id: videoid
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


//插入视频详细数据
exports.insertVideo = function (gYOUKUDATA, callback) {
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


//插入完整影片数据
exports.insertFilm = function (gYOUKUDATA, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回err信息
        }
        db.collection(settings.col_films, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
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


//更新视频信息数据
exports.updateVideo = function (gYOUKUDATA, callback) {
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
                        videoSpoiler: gYOUKUDATA.videoSpoiler,
                        doubanid:gYOUKUDATA.doubanid,
                        doubanidtitle:gYOUKUDATA.doubanidtitle
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


//更新完整影片
exports.updateFilm = function (gYOUKUDATA, callback) {
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
                         doubanid:gYOUKUDATA.doubanid
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


//根据作者获取视频
exports.getVideosByAuthor = function (authorID, page, num, callback) {
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
            var query = {videoType: {$ne: "fullfilm"}};
            if (authorID) {
                query = {
                    videoType: {$ne: "fullfilm"},
                    'user.id': authorID
                };
            }
            //使用 count 返回特定查询的文档数 total
            collection.count(query, function (err, total) {
                collection.find(query, {
                    skip: (page - 1) * num,
                    limit: num
                }).sort({
                    publisheddate: 1
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

//根据电影获取视频
exports.getVideosByMovie = function (movieID, page, num, callback) {
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

            query = {
                doubanid: movieID
            };

            //使用 count 返回特定查询的文档数 total
            collection.count(query, function (err, total) {
                collection.find(query, {
                    skip: (page - 1) * num,
                    limit: num
                }).sort({
                    publisheddate: -1
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


//根据id查找作者信息
exports.findAuthor = function (gAUTHOR, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(settings.col_authors, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                authorID: gAUTHOR.authorID
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


//插入作者详细数据
exports.insertAuthor = function (gAUTHOR, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回err信息
        }
        db.collection(settings.col_authors, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            collection.insert(gAUTHOR, {
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


//更新作者
exports.updateAuthor = function (gAUTHOR, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回err信息
        }

        db.collection(settings.col_authors, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回err信息
            }
            collection.updateMany(
                {authorID: gAUTHOR.authorID},
                {
                    $set: {
                        update: gAUTHOR.update,
                        authorName: gAUTHOR.authorName,
                        authorLogo: gAUTHOR.authorLogo,
                        authorBanner: gAUTHOR.authorBanner,
                        authorLink: gAUTHOR.authorLink,
                        authorIntroduction: gAUTHOR.authorIntroduction
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


//根据作者获取视频
exports.getVideosByAuthor = function (authorID, page, num, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(settings.col_videos, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (authorID) {
                query = {'user.id': authorID};
            }
            collection.count(query, function (err, total) {
                collection.find(query, {
                    skip: (page - 1) * num,
                    limit: num
                }).sort({
                    published: -1
                }).toArray(function (err, videos) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, videos, total);
                });
            });
        });
    });
};


//获取headers  并用distinct去重
exports.getAuthors = function(callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection(settings.col_authors,function(err,collection){
            if(err){
                mongodb.close();
                return callback(err)
            }
            var query = {};

            collection.find(query).toArray(function(err,authors){
                 mongodb.close();
                if(err){
                    return callback(err)
                }
                callback(null,authors)
            })

        })
    })
}





