var request = require('request');
var cheerio = require('cheerio');
var comments = require('../models/models_comments.js');
var async = require("async");
var movie = require('../models/models_movies.js');




var url = 'http://www.imdb.com/title/tt1663202/criticreviews';

request(url, function (error, response, body) {
        if (!error) {
            var $ = cheerio.load(body)
            var metacriticUrl = $('.see-more .offsite-link').attr('href')
            console.log(metacriticUrl)
            if(metacriticUrl){

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
                                 console.log(option)

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
                                     metacriticInfo_save(item,'5327268',function(err,rows){
                                         if(err){
                                             console.log(err)
                                         }else{
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
                                console.log(optionsOffice)

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
                                            doubanid:'5327268',
                                            commentid:'pinglunid',
                                            office : $office.text(),
                                            avatar : $name.text(),
                                            comment : $comments.text().trim(),
                                            commentsURL : $commentsURL.attr('href').trim(),
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
                                            if(rows && rows.insertedIds){
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
                                console.log(optionsUser)

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
                                            doubanid:'5327268',
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
                         console.log(results[0])
                         console.log(results[1])
                         console.log(results[2])
                    }
                )
            }

        }
    }
)



function metacriticInfo_save(metacriticInfo,doubanid,callback){
    movie.updateMovieByMetacritic(metacriticInfo,doubanid,function(err,row){
            if(err){
                callback(null,'更新电影信息出错!')
            }
            callback(null,'更新电影信息成功!' + row )
    })
}


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

