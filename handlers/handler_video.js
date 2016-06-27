var video = require('../models/models_videos.js');
var movie = require('../models/models_movies.js');


//保存电影API
exports.saveVideoInfo = function (req, res) {
    video.findVideoInfo(req.body.id, function (err, data) {
        if (err) {
            res.send('优酷视频查询出错了')
        } else if (data) {
            video.updateVideoInfo(req.body, function (err, row) {
                if (err) {
                    console.log(err)
                    res.send('优酷视频更新出错了')
                } else if (row) {
                    res.send('优酷视频更新成功:' + row)
                } else {
                    res.send('没有取得更新优酷视频结果？')
                }
            })
        } else {
            video.insertVideoInsert(req.body, function (err, row) {
                if (err) {
                    res.send('视频保存出错了')
                } else if (row) {
                    res.send('优酷视频保存成功:' + row.insertedIds)
                } else {
                    res.send('没有取得保存优酷视频结果？')
                }
            })
        }
    })
};

//保存作者API
exports.saveAuthor = function (req, res) {
    video.findAuthor(req.body, function (err, data) {
        if (err) {
            res.send('作者查询出错了')
        } else if (data) {
            video.updateAuthor(req.body, function (err, row) {
                if (err) {
                    console.log(err)
                    res.send('作者更新出错了')
                } else if (row) {
                    res.send('作者更新成功:' + row)
                } else {
                    res.send('没有取得更新作者结果？')
                }
            })
        } else {
            video.insertAuthor(req.body, function (err, row) {
                if (err) {
                    res.send('视频保存出错了')
                } else if (row) {
                    res.send('优酷视频保存成功:' + row.insertedIds)
                } else {
                    res.send('没有取得保存优酷视频结果？')
                }
            })
        }
    })
};

//电影列表页显示电影列表
exports.videos = function (req, res) {
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //查询并返回第 page 页的 24 篇文章
    video.getVideosByAuthor(null, page,24, function (err, videos, total) {
        if (err) {
            movies = [];
        }
        if (videos) {
            res.render('videos', {
                title: 'videos',
                videos: videos,
                total: total,
                totalPage: Math.ceil(total / 24),
                page: page,
                isFirstPage: (page - 1) == 0,
                isLastPage: ((page - 1) * 24 + videos.length) == total,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        }
    });
};

//根据作者显示视频列表
exports.videosByAuthor = function (req, res) {
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //查询并返回第 page 页的 24 篇文章
    video.getVideosByAuthor(req.params.author, page,24, function (err, videos, total) {
        if (err) {
            console.log(err);
        }
        if (videos) {
            res.render('videos', {
                title: '/videos/author/' + req.params.author,
                videos: videos,
                total: total,
                totalPage: Math.ceil(total / 24),
                page: page,
                isFirstPage: (page - 1) == 0,
                isLastPage: ((page - 1) * 24 + videos.length) == total,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        }
    });
};

var async = require("async");


exports.watchVideo = function (req, res) {
    var videid = req.params.videoid;
    video.findVideoInfo(videid, function (err, videoResult) {
        if (err) {
            res.send('查找视频出错了')
        } else if (videoResult) {
            async.series([
                    //返回电影信息results[0]
                    function (callback) {
                        movie.findMovieInfo(videoResult.doubanid[0], function (err, movieResult) {
                            if (err) {
                                callback(err)
                            } else if (movieResult) {
                                callback(null, movieResult)
                            }
                        })
                    },

                    //返回电影相关视频results[1]
                    function (callback) {
                        video.getVideosByMovie(videoResult.doubanid[0], 1 , 24 , function (err, videoByMovie, total) {
                            if (err) {
                                callback(err)
                            }
                            callback(null,videoByMovie)
                        });
                    },

                    //返回作者相关视频results[2]
                    function (callback) {
                        video.getVideosByAuthor(videoResult.user.id, 1 , 100 , function (err, videoByAuthor, total) {
                            if (err) {
                                callback(err)
                            }
                            callback(null,videoByAuthor)
                        });
                    }
                ],

                function (err, results) {
                    res.render('show', {
                        title: videid,
                        videoInfo: videoResult,
                        movieInfo: results[0],
                        videoByMovie:results[1],
                        videoByAuthor:results[2],
                        user: req.session.user,
                        success: req.flash('success').toString(),
                        error: req.flash('error').toString()
                    })
                }
            )


        } else {
            res.send('没有找到视频')
        }
    })
}

//获取一定数量的随机评论
exports.getComments = function (req, res) {

    var movieid = req.params.movieid;
    var num = parseInt(req.params.num);


    video.getCommentsByMovieID(movieid,num, function (err, comments) {
        if (err) {
            console.log(err)
        }
        if (comments) {
             res.send(comments)
        }else{
            res.send('没有找到电影的评论')

        }
    });
};