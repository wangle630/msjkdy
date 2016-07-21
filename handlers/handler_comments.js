/*

 www.npmjs.com 搜索request
 https://www.npmjs.com/package/request


 www.npmjs.com cheerio
 https://www.npmjs.com/package/cheerio
 */
var comments = require('../models/models_comments.js');
var async = require("async");
var movie = require('../models/models_movies.js');


var request = require('request');
var cheerio = require('cheerio');


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

//获取豆瓣评论信息
exports.getDbComments = function (req, res) {
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


//获取豆瓣评论信息
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


//获取 metacritic 网站信息
exports.getDbComments = function (req, res) {
    doubanID = req.body.doubId
    imdbID = req.body.imdbID


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

exports.getMetacriticInfo =function(req,res){

    doubanID = req.body.doubId
    imdbID = req.body.imdbID

    var url = 'http://www.imdb.com/title/' + imdbID + '/criticreviews';



    request(url, function (error, response, body) {
            console.log('开始获取metacritic：'  + url)
            if (!error) {
                var $ = cheerio.load(body)

                var metacriticUrl = $('.see-more .offsite-link').attr('href')


                if(metacriticUrl){

                    if (metacriticUrl.indexOf('?') > 0 ){
                        metacriticUrl = metacriticUrl.substring(0,metacriticUrl.indexOf('?'));
                    }
                    console.log(metacriticUrl)

                    //metacriticUrl = 'http://www.metacritic.com/movie/apocalypse-now-redux'

                    var option = {
                        url: metacriticUrl,
                        headers: {
                            'User-Agent': 'request'
                        }
                    };

                    var optionsOffice = {
                        url: metacriticUrl + '/critic-reviews',
                        headers: {
                            'User-Agent': 'request'
                        }
                    };

                    var optionsUser = {
                        url: metacriticUrl + '/user-reviews',
                        headers: {
                            'User-Agent': 'request'
                        }
                    };

                    async.series([
                            //返回metacritic电影信息results[0]
                            function (callback) {
                                request(option , function(error,response,body){
                                    console.log('...分析-->' + option.url)

                                    if (!error && response.statusCode == 200) {
                                        $ = cheerio.load(body)
                                        var str = $('.details.side_details .summary .count a').text().trim()
                                        var num = str.length
                                        var item = {
                                            metacriticUrl:metacriticUrl,
                                            officeRating : $("[itemprop='ratingValue']").text().trim(),
                                            officeCount : $("[itemprop='reviewCount']").text().trim(),
                                            userRating : $('.rating_signin_tmpl .metascore_w.user.large.movie.positive').text().trim(),
                                            userCount : str.substr(0,num-8)
                                        }
                                        metacriticInfo_save(item,doubanID,function(err,rows){
                                            if(err){
                                                console.log(err)
                                            }else{

                                                console.log('...保存-->' + 'metacriticInfo')

                                                if(rows){
                                                    callback(null,'更新metacritic：' + rows)

                                                }else{
                                                    callback(null,'没有找到记录，无法更新')
                                                }
                                            }
                                        })
                                    } else {
                                        callback(null,response.statusCode)
                                    }
                                })
                            },
                            //返回metacritic电影评论家评论results[1]
                            function (callback) {
                                request(optionsOffice , function(error,response,body){
                                    console.log('...分析-->' + optionsOffice.url)

                                    if (!error && response.statusCode == 200) {
                                        $ = cheerio.load(body)
                                        var metacriticCriticReviews   = [];
                                        $('.review.critic_review').each(function () {
                                            var $me = $(this);
                                            var $office = $me.find('.source')
                                            var $name = $me.find('.author').find('a')
                                            var $comments = $me.find('.review_body')
                                            var $commentsURL = $me.find('.full_review').find('a')
                                            var $fenshu = $me.find('.metascore_w');
                                            var fenshu = $fenshu.text().trim()


                                            if (fenshu >= 0 && fenshu <= 20){
                                                fenshu = '很差'
                                            } else  if (fenshu > 20 && fenshu <= 40){
                                                fenshu = '较差'
                                            }else if(fenshu > 40 && fenshu <= 60){
                                                fenshu = '还行'
                                            }else if(fenshu > 60 && fenshu <= 80){
                                                fenshu = '推荐'
                                            }else if(fenshu > 80 && fenshu <= 100){
                                                fenshu = '力荐'
                                            }else{
                                                fenshu = '一般'
                                            }

                                            var item = {
                                                sourcesite:'metacritic-critic',
                                                doubanid:doubanID,
                                                commentid:'pinglunid',
                                                office : $office.text(),
                                                avatar : $name.text(),
                                                comment : $comments.text().trim(),
                                                commentsURL : $commentsURL.attr('href'),
                                                crate: fenshu,         //级别、打分
                                                cdata:  '2016-04-01',          //评论日期
                                                randomsort:  Math.round(Math.random()*999999)
                                            };
                                            metacriticCriticReviews.push(item)
                                        });

                                        metacriticCommit_save(metacriticCriticReviews,'metacritic-critic',function(err,rows){
                                            if(err){
                                                console.log(err)
                                            }else{
                                                console.log('...保存-->' + 'metacriticCriticReviews')

                                                if(rows && rows.insertedIds){
                                                    console.log('......metacritic-critic保存完毕！')
                                                    callback(null,'新增metacritic-critic：' + rows.insertedIds.length)

                                                }else{
                                                    callback(null,'metacritic-critic无新增纪录')
                                                }
                                            }
                                        })


                                    } else {
                                        callback(null,response.statusCode)
                                    }
                                })
                            },

                            //返回metacritic电影用户评论results[2]
                            function (callback) {
                                request(optionsUser , function(error,response,body){
                                    console.log('...分析-->' + optionsUser.url)

                                    if (!error && response.statusCode == 200) {
                                        $ = cheerio.load(body)


                                        var metacriticUserReviews   = [];

                                        $('li.review.user_review').each(function () {
                                            var $me = $(this);
                                            var $name = $me.find('.name')
                                            var $comments = $me.find('.blurb.blurb_expanded')
                                            if($comments.length < 1){
                                                $comments = $me.find('.review_body')
                                            }
                                            var $fenshu = $me.find('.metascore_w');
                                            var fenshu = $fenshu.text().trim()


                                            if (fenshu >= 0 && fenshu <= 2){
                                                fenshu = '很差'
                                            } else  if (fenshu > 2 && fenshu <= 4){
                                                fenshu = '较差'
                                            }else if(fenshu > 4 && fenshu <= 6){
                                                fenshu = '还行'
                                            }else if(fenshu > 6 && fenshu <= 8){
                                                fenshu = '推荐'
                                            }else if(fenshu > 8 && fenshu <= 10){
                                                fenshu = '力荐'
                                            }else{
                                                fenshu = '一般'
                                            }

                                            var item = {
                                                sourcesite:'metacritic-user',
                                                doubanid:doubanID,
                                                commentid:'pinglunid',
                                                office : '',
                                                avatar : $name.text().trim(),
                                                comment : $comments.text().trim(),
                                                commentsURL : '',
                                                cdata:  '2016-04-01',                //评论日期
                                                crate: fenshu,        //级别、打分
                                                randomsort:  Math.round(Math.random()*999999)

                                            };
                                            metacriticUserReviews.push(item)
                                        });

                                        metacriticCommit_save(metacriticUserReviews,'metacritic-user',function(err,rows){
                                            if(err){
                                                console.log(err)
                                            }else{
                                                console.log('...保存-->' + 'metacriticUserReviews')

                                                if(rows && rows.insertedIds){
                                                    callback(null,'新增metacritic-user：' + rows.insertedIds.length)

                                                }else{
                                                    callback(null,'metacritic-user无新增纪录')
                                                }
                                            }
                                        })
                                    } else {
                                        callback(null,response.statusCode)
                                    }
                                })
                            }
                        ],

                        function (err, results) {
                            res.send(results[0] + results[1] + results[2])
                            console.log('metacritci获取成功：' + results[0] + results[1] + results[2])
                        }
                    )
                }else {
                    res.send('找不到metacritic评论信息')
                    console.log('获取不到metacritic'  )
                }
            }else{
                res.send('获取metacritic  error：' + error )
                console.log('获取metacritic  error：' + error  )
            }
        }
    )
}






//保存豆瓣评论
function doubanCommit_save (doubanCommentsList ,callback) {
    var doubanCommits = doubanCommentsList;
    comments.findComments(doubanCommits[0].doubanid,'douban', function (result) {
        l1 = doubanCommits.length
        l2 = result.length
        for(var i = 0; i < l1 ; i++ ){
            for (var j=0; j< l2 ; j++){
                if (doubanCommits[i] && (doubanCommits[i].commentid == result[j].commentid)){
                     doubanCommits.splice(i,1)
                    i = i -1
                }
            }
        }


        if (doubanCommits.length > 0) {
            comments.insertComments(doubanCommits, function (err, row) {
                if (err) return callback(err)
                callback(null,row)
            })
        }else{
            callback(null,'0')
        }
    })
};






//保存metacritic基本信息
function metacriticInfo_save(metacriticInfo,doubanid,callback){
    movie.updateMovieByMetacritic(metacriticInfo,doubanid,function(err,row){
        if(err){
            callback(null,'更新电影信息出错!')
        }
        callback(null,'更新电影信息成功!' + row )
    })
}

//保存 metacritic评论
function metacriticCommit_save (metacriticCommentsList,courcesite,callback) {
    var metacriticComments = metacriticCommentsList;
    comments.findComments(metacriticComments[0].doubanid,courcesite, function (result) {
        l1 = metacriticComments.length
        l2 = result.length
        for(var i = 0; i < l1 ; i++ ){
            for (var j=0; j< l2 ; j++){
                if (metacriticComments[i] && (metacriticComments[i].comment == result[j].comment)){
                    metacriticComments.splice(i,1)
                    i = i -1
                }
            }
        }
        if (metacriticComments.length > 0) {
            comments.insertComments(metacriticComments, function (err, row) {
                if (err) return callback(err)
                callback(null,row)
            })
        }else{
            callback(null,'0')
        }
    })
};
