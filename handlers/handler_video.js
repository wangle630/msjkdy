var video = require('../models/models_videos.js');
var movie = require('../models/models_movies.js');
var async = require("async");
var classic = require('../models/models_classics.js');


//保存视频API
exports.saveVideo = function (req, res) {
    video.findVideo(req.body.id, function (err, videoInfo) {
        if (err) {
            res.send('优酷视频查询出错了')
        }
        async.series([
                //返回视频新增或保存信息results[0]
                function (callback) {
                    if (videoInfo) {
                        video.updateVideo(req.body, function (err, row) {
                            if (err) {
                                callback(null,'更新电影视频列表出错!')
                            } else if (row) {
                                callback(null,'优酷视频更新成功!' + row)
                            } else {
                                callback(null,'没有取得更新优酷视频结果!')
                            }
                        })
                    } else {
                        video.insertVideo(req.body, function (err, row) {
                            if (err) {
                                callback(null,'视频保存出错了!')
                            } else if (row) {
                                callback(null,'优酷视频保存成功!' + row.insertedIds)
                            } else {
                                callback(null,'没有取得保存优酷视频结果？!')
                            }
                        })
                    }
                },
                //返回电影videoid更新情况，results[1]
                function (callback) {

                    movie.updateMovieByVideo(req.body.doubanid,req.body.id,function(err,row){
                        if(err){
                            callback(null,'更新电影信息出错!')
                        }
                        callback(null,'更新电影信息成功!' + row )
                    })
                }
            ],

            function (err, results) {
                res.send(results[0] + results[1] )
            }
        )
    })
};



//保存完整影片
exports.saveFilm = function (req, res) {
    video.findFilm(req.body.id, function (err, filmInfo) {
        if (err) {
            res.send('完整影片查询出错了')
        }
        async.series([
                //返回视频新增或保存信息results[0]
                function (callback) {
                    if (filmInfo) {
                        video.updateFilm(req.body, function (err, row) {
                            if (err) {
                                callback(null,'完整影片更新出错了!')
                            } else if (row) {
                                callback(null,'完整影片更新成功!' + row)
                            } else {
                                callback(null,'没有取得更新完整影片结果!')
                            }
                        })
                    } else {
                        video.insertFilm(req.body, function (err, row) {
                            if (err) {
                                callback(null,'完整影片保存出错了!')
                            } else if (row) {
                                callback(null,'完整影片保存成功!' + row.insertedIds)
                            } else {
                                callback(null,'没有取得保存完整影片结果？!')
                            }
                        })
                    }
                },
                //返回电影videoid更新情况，results[1]
                function (callback) {
                    movie.updateMovieByFilm(req.body.doubanid,req.body.id,function(err,row){
                        if(err){
                            callback(null,'更新电影信息出错!')
                        }
                        callback(null,'更新电影信息成功!' + row )
                    })
                }
            ],

            function (err, results) {
                res.send(results[0] + results[1] )
            }
        )
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


//根据作者显示视频列表
exports.videos = function (req, res) {
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;

    var num = 24;

    async.series([
            //返回合集列表results[0]
            function (callback) {
                video.getVideosByAuthor(req.params.author, page,24, function (err, videos, total){
                    if (err) {
                        callback(err)
                    } else if (videos) {
                        callback(null, videos,total)
                    }
                });
            },

            //返回去重标签results[1]
            function (callback) {
                video.getAuthors(function (err, authors) {
                     if (err) {
                        callback(err)
                    } else if (authors) {
                         callback(null, authors)
                    }
                });
            },
        ],

        function (err, results) {
            var title = '/videos/'
            if(req.params.author){
                title = title  + req.params.author
            }
            res.render('home_videos', {
                title: title,
                gg:req.params.author,
                header:'showVideoList',
                videos: results[0][0],
                authors:results[1],
                total: results[1],
                totalPage: Math.ceil(results[0][1]/num),
                page: page,
                isFirstPage: (page - 1) == 0,
                isLastPage: ((page - 1) * num + results[0][1]) == results[0][1],
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        }
    )
};



//观看视频页面
exports.watchVideo = function (req, res) {
    var videid = req.params.videoid;
    video.findVideo(videid, function (err, videoResult) {
        console.log(videoResult)
        if (err) {
            res.send('查找视频出错了')
        } else if (videoResult) {

            var doubanid = videoResult.doubanid[0];


            async.series([
                    //返回电影信息results[0]
                    function (callback) {
                        movie.findMovieInfo(doubanid, function (err, movieResult) {
                            if (err) {
                                callback(err)
                            } else if (movieResult) {
                                callback(null, movieResult)
                            }
                        })
                    },
                    //返回电影相关视频results[1]
                    function (callback) {
                        video.getVideosByMovie(doubanid, 1 , 100 , function (err, videoByMovie, total) {
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
                    },

                    //返回该电影包含的集合results[3]
                    function (callback) {
                        classic.getClassicsByMovie(doubanid , function (err, classicsByMovie) {
                            if (err) {
                                callback(err)
                            }else{
                                callback(null,classicsByMovie)
                            }
                        });
                    }
                ],

                function (err, results) {
                    res.render('show_video', {
                        title: videid,
                        header:'showVideoList',
                        videoInfo: videoResult,
                        movieInfo: results[0],
                        videoByMovie:results[1],
                        videoByAuthor:results[2],
                        classicByMovie:results[3],
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





exports.watchFilm = function (req, res) {
    var filmid = req.params.filmid;
    video.findFilm(filmid, function (err, videoResult) {
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
                        video.getVideosByMovie(videoResult.doubanid[0], 1 , 100 , function (err, videoByMovie, total) {
                            if (err) {
                                callback(err)
                            }
                            callback(null,videoByMovie)
                        });
                    },

                    //返回该电影包含的集合results[2]
                    function (callback) {
                        classic.getClassicsByMovie(videoResult.doubanid[0] , function (err, classicsByMovie) {
                            if (err) {
                                callback(err)
                            }else{
                                callback(null,classicsByMovie)
                            }
                        });
                    }
                ],

                function (err, results) {
                    res.render('show_film', {
                        title: filmid,
                        header:'showFilmList',
                        videoInfo: videoResult,
                        movieInfo: results[0],
                        videoByMovie:results[1],
                        classicByMovie:results[2],
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



exports.getNextVideoByMovie = function(req,res){

    var movieid = req.body.movieid


    video.getVideosByMovie(movieid, 1 , 100 , function (err, videoByMovie, total) {
        if (err) {
            console.log(err)
            res.send('没有找到相关视频')
        }else{
            res.send(videoByMovie)
        }
    });
}