var main = require('./handlers/handler_main.js');
var admin = require('./handlers/handler_admin.js');
var movie = require('./handlers/handler_movie.js');
var video = require('./handlers/handler_video.js');
var spider = require('./handlers/handlers_spider.js');





module.exports = function(app){
    //－－－－－－－－－－－－－－－前台－－－－－－－－－－－－－－－－
    app.get('/',main.homepage);
    app.get('/show',main.show);
    app.get('/awards',main.awards);

    //－－－－－－－－－－－－－－－电影－－－－－－－－－－－－－－－－
    //电影列表
    app.get('/movies',movie.movies);


    //－－－－－－－－－－－－－－－视频－－－－－－－－－－－－－－－－

    //视频列表
    app.get('/videos',video.videos);
    //根据作者打开视频列表
    app.get('/videos/author/:author',video.videosByAuthor);
    //观看视频
    app.get('/videos/watch/:videoid',video.watchVideo);


    //－－－－－－－－－－－－－－－后台－－－－－－－－－－－－－－－－

    app.get('/a/movie',admin.getmovie);
    app.get('/a/video',admin.getvideo);
    app.get('/a/author',admin.getauthor);

    //－－－－－－－－－－－－－－－API－－－－－－－－－－－－－－－－

    //保存youku视频API
    app.post('/api/saveyoukuvideo',video.saveVideoInfo);

    //保存电影API
    app.post('/api/savemovieinfo',movie.saveMovieInfo);

    //保存作者API
    app.post('/api/saveauthor',video.saveAuthor);

    //获取豆瓣电影评论
    app.post('/spider',spider.getDbComments);


};

//未登录则跳转至登录界面
function checkLogin(req,res,next){
    if(!req.session.user){
        req.flash('error','未登录');
        res.redirect('/login');
        return;
    }
    next();
}

//已登录则返回
function checkNotLogin(req,res,next){
    if(req.session.user){
        req.flash('error','已登录');
        res.redirect('back');
        return;
    }
    next();
}