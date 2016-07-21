var movie = require('../models/models_movies.js');


//保存电影API
exports.saveMovieInfo = function (req, res) {
    movie.findMovieInfo(req.body.douban.id, function (err, data) {
        if (err) {
            console.log(err);
            res.send('电影查询出错了')
        } else if (data) {
            movie.updateMovieInfo(req.body, function (err, row) {
                if (err) {
                    console.log(err)
                    res.send('电影更新出错了')
                } else if (row) {
                    res.send('电影更新成功:' + row)
                } else {
                    res.send('没有取得更新电影结果？')
                }
            })
        } else {
            movie.insertMovieInsert(req.body, function (err, row) {
                if (err) {
                    res.send('电影保存出错了')
                } else if (row) {
                    res.send('电影保存成功:' + row.insertedIds)
                } else {
                    res.send('没有取得保存电影结果？')
                }
            })
        }
    })
};

//电影列表页显示电影列表
exports.movies = function (req, res) {
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;
    var num = 18
    //查询并返回第 page 页的 10 篇文章
    movie.getMoviesByClassic(null, page,num, function (err, movies, total) {
        if (err) {
            movies = [];
        }
        console.log(total)
        res.render('home_movies', {
            title: 'movies',
            header:'showMovieList',
            movies: movies,
            total: total,
            totalPage: Math.ceil(total/num),
            page: page,
            isFirstPage: (page - 1) == 0,
            isLastPage: ((page - 1) * num + movies.length) == total,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
};


//保存电影API
exports.saveMovieInfo = function (req, res) {
    movie.findMovieInfo(req.body.douban.id, function (err, data) {
        if (err) {
            console.log(err);
            res.send('电影查询出错了')
        } else if (data) {
            movie.updateMovieInfo(req.body, function (err, row) {
                if (err) {
                    console.log(err)
                    res.send('电影更新出错了')
                } else if (row) {
                    res.send('电影更新成功:' + row)
                } else {
                    res.send('没有取得更新电影结果？')
                }
            })
        } else {
            movie.insertMovieInsert(req.body, function (err, row) {
                if (err) {
                    res.send('电影保存出错了')
                } else if (row) {
                    res.send('电影保存成功:' + row.insertedIds)
                } else {
                    res.send('没有取得保存电影结果？')
                }
            })
        }
    })
};


//API获取电影信息
exports.getNextMovieInfo = function(req,res){

    var doubanid = req.params.movieid;

    movie.findMovieInfo(doubanid, function (err, movieResult) {
        if (err) {
            res.send('电影查询出错了')
        } else if (movieResult) {
            res.send(movieResult)
        }
    })

}