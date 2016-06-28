/*

 www.npmjs.com 搜索request
 https://www.npmjs.com/package/request


 www.npmjs.com cheerio
 https://www.npmjs.com/package/cheerio
 */

var request = require('request');
var cheerio = require('cheerio');

var comments = require('../models/models_comments.js');



function getDoubanComments(url,originalUrl,doubanID, callback) {
    request(url, function (error, response, body) {
            if (!error) {

                //根据网页内容创建DOM操作对象
                var $ = cheerio.load(body);

                var doubanCommentsList = [];

                $('.comment-item').each(function () {
                    var $me = $(this);
                    var $avatar = $me.find('.avatar').find('a');
                    var $comment = $me.find('.comment').find('p');
                    var $crate = $me.find('.comment-info').find('span');
                    var $cdata = $me.find('.comment-info').find('span').next();
                    var item = {
                        sourcesite:'douban',                //豆瓣的评论
                        doubanid:doubanID,                  //电影ID（豆瓣）
                        commentid :$me.attr('data-cid'),    //评论子ID
                        avatar: $avatar.attr('title'),      //评论人
                        comment: $comment.text().trim(),    //评论内容
                        crate: ($crate.attr('title') || '一般'),        //级别、打分
                        cdata: ($cdata.text().trim() || '2016-04-01'),          //评论日期
                        randomsort:  Math.round(Math.random()*999999)

                    };
                    doubanCommentsList.push(item)
                });

                //检查是否有下一项
                var nextUrl = $('.next').attr('href');
                if (nextUrl) {
                    console.warn(originalUrl + nextUrl);
                    //读取下一页
                    getDoubanComments(originalUrl + nextUrl, originalUrl,doubanID,function (err, articleList2) {
                        if (err) return callback(err);
                        //合并结果
                        callback(null, doubanCommentsList.concat(articleList2));
                    })
                } else {
                    //返回结果
                    callback(null, doubanCommentsList);

                }
            }
        }
    )
}


exports.getDbComments = function (req, res,doubanID) {
    doubanID = req.body.doubId
    var uu = 'https://movie.douban.com/subject/' + doubanID + '/comments';
    console.warn(uu);
    getDoubanComments(uu,uu,doubanID,function(err,doubanCommentsList){
        if(err) console.error(err.stack);
        doubanCommentsList.pop()
        doubanCommit_save(doubanCommentsList,function(err,rows){
            if(err){
                res.send(err)
            }else{
                if(rows && rows.insertedIds){
                    res.send('新增：' + rows.insertedIds.length)
                }else{
                    res.send('无新增纪录')
                }
            }
        })
    })
}





function doubanCommit_save (doubanCommentsList ,callback) {
    var doubanCommits = doubanCommentsList;
    comments.findDoubanCommits(doubanCommits[0].doubanid, function (result) {
        l1 = doubanCommits.length
        l2 = result.length
        var n = 0;
        for(var i = 0; i < l1 ; i++ ){
            for (var j=0; j< l2 ; j++){
                if (doubanCommits[i] && (doubanCommits[i].commentid == result[j].commentid)){
                    doubanCommits.splice(i,1)
                }
            }
        }

        if (doubanCommits.length > 0) {
            comments.insertDoubanCommit(doubanCommits, function (err, row) {
                if (err) return callback(err)
                callback(null,row)
            })
        }else{
            callback(null,'0')
        }
    })
};

//获取一定数量的随机评论
exports.getComments = function (req, res) {

    var movieid = req.params.movieid;
    var num = parseInt(req.params.num);


    comments.getCommentsByMovieID(movieid,num, function (err, comments) {
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
