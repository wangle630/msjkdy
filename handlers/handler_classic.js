var classic = require('../models/models_classics.js');
var async = require("async");
var movie = require('../models/models_movies.js');




//保存集合API
exports.saveClassic = function (req, res) {
    classic.findClassic(req.body.eName, function (err, data) {
        if (err) {
            console.log(err);
            res.send('集合查询出错了')
        } else if (data) {
            classic.updateClassic(req.body, function (err, row) {
                if (err) {
                    console.log(err)
                    res.send('集合更新出错了')
                } else if (row) {
                    res.send('集合更新成功:' + row)
                } else {
                    res.send('没有取得更新电影结果？')
                }
            })
        } else {
            classic.insertClassic(req.body, function (err, row) {
                if (err) {
                    res.send('集合保存出错了')
                } else if (row) {
                    res.send('集合保存成功:' + row.insertedIds)
                } else {
                    res.send('没有取得保存集合结果？')
                }
            })
        }
    })
};

//获取一定数量的随机评论
exports.getClassicByEName = function (req, res) {

    var eName = req.query.eName;

    console.log(eName)

    classic.findClassic(eName, function (err, classic) {
        if (err) {
            console.log(err)
        }
        if (classic) {
            res.send(classic)
        }else{
            res.send('没有找到相关集合')

        }
    });
};



//显示合集列表
exports.classics = function (req, res) {
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;
    var num =18

    async.series([
            //返回合集列表results[0]
            function (callback) {
                classic.getEighteenClassics(req.params.tag,page,num, function (err, classics,total) {
                    if (err) {
                        callback(err)
                    } else if (classics) {
                        callback(null, classics,total)
                    }
                });
            },

            //返回去重标签results[1]
            function (callback) {
                classic.getTags(function (err, tags) {
                    if (err) {
                        callback(err)
                    } else if (tags) {
                        callback(null, tags)
                    }
                });
            }
        ],

        function (err, results) {

            var title = '/classic/'

            if(req.params.tag){
                title = title + 'tag/' + req.params.tag
            }

            res.render('home_classics', {
                title: title,
                gg:req.params.tag,
                header:'showClassicList',
                classics: results[0][0],
                tags:results[1],
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



exports.watchClassic = function (req, res) {
    var strEName = req.params.ename;
    classic.findClassic(strEName, function (err, classicResult) {
        if (err) {
            res.send('合集视频出错了')
        } else if (classicResult) {
            async.series([
                    //返回电影信息results[0]
                    function (callback) {
                        movie.getMoviesByClassic(classicResult.doubanid,1,24, function (err, movieResult) {
                            if (err) {
                                callback(err)
                            } else if (movieResult) {
                                callback(null, movieResult)
                            }
                        })
                    },
                    //返回去重标签results[1]
                    function (callback) {
                        classic.getTags(function (err, tags) {
                            if (err) {
                                callback(err)
                            } else if (tags) {
                                callback(null, tags)
                            }
                        });
                    }
                ],
                function (err, results) {
                    res.render('show_classic', {
                        title: strEName,
                        classic: classicResult,
                        gg:'',
                        totalPage:'',
                        total:'',
                        header:'showClassicList',
                        movies: results[0],
                        tags:results[1],
                        user: req.session.user,
                        success: req.flash('success').toString(),
                        error: req.flash('error').toString()
                    })
                }
            )
        } else {
            res.send('没有找到集合')
        }
    })
}

exports.getNextMovieClassics = function(req,res){
    var doubanid = req.params.movieid
    classic.getClassicsByMovie(doubanid , function (err, classicsByMovie) {
        if (err) {
            console.log(err)

        }else{
            console.log(classicsByMovie)
            res.send(classicsByMovie)
        }
    });
}


