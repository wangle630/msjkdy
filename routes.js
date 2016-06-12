var main = require('./handlers/handler_main.js');
var admin = require('./handlers/handler_admin.js');
var movie = require('./handlers/handler_movie.js');
var video = require('./handlers/handler_video.js');





module.exports = function(app){
    //－－－－－－－－－－－－－－－前台－－－－－－－－－－－－－－－－
    app.get('/',main.homepage);
    app.get('/show',main.show);
    app.get('/awards',main.awards);

    //－－－－－－－－－－－－－－－电影－－－－－－－－－－－－－－－－
    //电影列表
    app.get('/movies',movie.movies);
    //保存电影API
    app.post('/api/savemovieinfo',movie.saveMovieInfo);

    //－－－－－－－－－－－－－－－视频－－－－－－－－－－－－－－－－
    //保存视频API
    app.post('/api/saveyoukuvideo',video.saveVideoInfo);
    //视频列表
    app.get('/videos',video.videos);


    //－－－－－－－－－－－－－－－后台－－－－－－－－－－－－－－－－

    app.get('/a/movie',admin.getmovie);
    app.get('/a/video',admin.getvideo);


    ////－－－－－－－－－－－－－－－文件md5分词豆瓣－－－－－－－－－－－－－－－－
    ////app.get('/fenci',api.fenci);
    ////
    //app.get('/mf',mf.filedouban);
    //
    //
    //app.post('/api/doubansave',douban.douban_save);
    //app.post('/api/omdbsave',douban.omdb_save);
    //
    //
    //
    ////－－－－－－－－－－－－－－－通用－－－－－－－－－－－－－－－－
    //
    //app.get('/ajax',api.ajax);              ////自动关联关键字页面
    //app.get('/keyword/hit',api.keywords);  //自动关联关键字
    //
    //app.get('/fenci',api.fenci);
    //app.get('/ja',api.jQueryAjax);
    //
    ////－－－－－－－－－－－－－－－通用－－－－－－－－－－－－－－－－
    //
    ////注销
    //app.get('/logout',checkLogin);
    //app.get('/logout',main.logout);
    ////上传照片
    //app.get('/upload',checkLogin);
    //app.get('/upload',main.upload);
    //app.post('/upload',main.post_upload);
    ////友情链接
    //app.get('/links',main.links);
    //
    //
    ////－－－－－－－－－－－－－－－用户－－－－－－－－－－－－－－－－
    ////打开注册页(mogodb)
    //app.get('/reg',checkNotLogin);
    //app.get('/reg',mogo_user.mogo_reg);
    ////打开注册页(mysql)
    //app.get('/mysql_reg',checkNotLogin);
    //app.get('/mysql_reg',mysql_user.mysql_reg);
    //
    ////提交注册（mogodb）
    //app.post('/reg',checkNotLogin);
    //app.post('/reg',mogo_user.mogo_post_reg);
    ////提交注册（mysql）
    //app.post('/mysql_reg',checkNotLogin);
    //app.post('/mysql_reg',mysql_user.mysql_post_reg);
    //
    ////登录（mogodb）
    //app.get('/login',checkNotLogin);
    //app.get('/login',mogo_user.mogo_login);
    ////登录（mysql）
    //app.get('/mysql_login',checkNotLogin);
    //app.get('/mysql_login',mysql_user.mysql_login);
    //
    ////提交登录（mogodb）
    //app.post('/login',checkNotLogin);
    //app.post('/login',mogo_user.mogo_post_login);
    ////提交登录（mysql）
    //app.post('/mysql_login',checkNotLogin);
    //app.post('/mysql_login',mysql_user.mysql_post_login);
    ////用户列表（mysql)
    //app.get('/mysql_userlist',mysql_user.mysql_userlist);
    //
    //
    ////－－－－－－－－－－－－－－－博客－－－－－－－－－－－－－－－－
    ////首页
    //app.get('/', mogo_post.home);
    ////显示某个用户所有文章列表
    //app.get('/u/:name/', mogo_post.user_post);
    ////打开写博客页面
    //app.get('/post',checkLogin);
    //app.get('/post',mogo_post.post);
    ////提交新博客
    //app.post('/post',checkLogin);
    //app.post('/post',mogo_post.post_post);
    ////根据用户 日期 打开某一篇文章
    //app.get('/u/:name/:day/:title', mogo_post.user_day_post);
    ////编辑文章
    //app.get('/edit/:name/:day/:title',checkLogin);
    //app.get('/edit/:name/:day/:title',mogo_post.edit_post);
    ////提交修改
    //app.post('/edit/:name/:day/:title',checkLogin);
    //app.post('/edit/:name/:day/:title',mogo_post.edit_post_post);
    ////删除文章
    //app.get('/remove/:name/:day/:title',checkLogin);
    //app.get('/remove/:name/:day/:title',mogo_post.remove_post);
    ////提交评论
    //app.post('/u/:name/:day/:title', mogo_post.comment_post);
    ////显示归档
    //app.get('/archive',mogo_post.archive);
    ////显示标签
    //app.get('/tags', mogo_post.tags);
    ////显示包含某个标签的所有文章
    //app.get('/tags/:tag',mogo_post.tags_tag);
    ////搜索
    //app.get('/search',mogo_post.search);

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