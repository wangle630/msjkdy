var main = require('./handlers/handler_main.js');
var admin = require('./handlers/handler_admin.js');
var movie = require('./handlers/handler_movie.js');
var video = require('./handlers/handler_video.js');
var comments = require('./handlers/handler_comments.js');
var classic = require('./handlers/handler_classic.js');





module.exports = function(app){
    //－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－前台
    app.get('/',main.homepage);
    app.get('/test',main.test);
    app.get('/show',main.show);
    app.get('/awards',main.awards);

    //－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－电影
    //电影列表
    app.get('/movies',movie.movies)

    ///-API-///

    //保存电影API
    app.post('/api/savemovieinfo',movie.saveMovieInfo);


    //播放页更换电影信息
    app.get('/api/getnextmovieinfo/:movieid',movie.getNextMovieInfo);

    //－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－评论

    ///-API-///

    //获取豆瓣电影评论API
    app.post('/getcomments',comments.getDbComments);
    //随机获取评论
    app.get('/api/getcomments/:movieid/:num',comments.getComments);
    //获取metacritic评论API
    app.post('/getmetacritic',comments.getMetacriticInfo);

    //－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－作者

    //添加作者信息
    app.get('/a/author',admin.getAuthor);

    ///-API-///

    //保存作者API
    app.post('/api/saveauthor',video.saveAuthor);


    //－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－合集
    //合集列表
    app.get('/classics',classic.classics);
    //根据标签的合集列表
    app.get('/classics/tag/:tag',classic.classics);
    //维护合集
    app.get('/a/classic',admin.getClassic);
    //合集详细信息
    app.get('/classics/:ename',classic.watchClassic);

    ///-API-///

    //保存合集
    app.post('/api/saveclassic',classic.saveClassic);
    //根据eName获得Classic
    app.get('/api/getclassic',classic.getClassicByEName);
    //播放页更换电影信息
    app.get('/api/getnextmovieclassics/:movieid',classic.getNextMovieClassics);

    //－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－完整影片
    //添加完整电影
    app.get('/a/film',admin.getFilm);
    //观看完整影片
    app.get('/films/watch/:filmid',video.watchFilm);

    ///-API-///

    //保存youku视频API
    app.post('/api/savefilm',video.saveFilm);

    //－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－视频

    //添加youku视频
    app.get('/a/video',admin.getVideo);
    //视频列表
    app.get('/videos',video.videos);
    //根据作者打开视频列表
    app.get('/videos/:author',video.videos);
    //观看视频
    app.get('/videos/watch/:videoid',video.watchVideo);

    ///-API-///

    //保存youku视频API
    app.post('/api/saveyoukuvideo',video.saveVideo);
    //播放页更换电影相关视频
    app.post('/api/getnextvideobymovie/:movieid',video.getNextVideoByMovie);

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