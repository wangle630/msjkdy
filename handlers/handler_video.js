var video = require('../models/models_videos.js');


//保存电影API
exports.saveVideoInfo = function (req, res) {
    req.setMaxListeners(0);
    video.findVideoInfo(req.body, function (err, data) {
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

//电影列表页显示电影列表
exports.videos = function (req, res) {
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;
    //查询并返回第 page 页的 24 篇文章
    video.getEighteenVideos(null, page, function (err, videos, total) {
        if (err) {
            movies = [];
        }
        if(videos){
            console.log(total)
            res.render('videos', {
                title: 'videos',
                videos: videos,
                total: total,
                totalPage: Math.ceil(total/24),
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