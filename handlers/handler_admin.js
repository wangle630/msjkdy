exports.getmovie = function(req,res){
    res.render('admin_getmovie',{
        title:"更新电影",
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    })
}

exports.getvideo = function(req,res){
    res.render('admin_getvideo',{
        title:"更新视频",
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    })
}


exports.getauthor = function(req,res){
    res.render('admin_getauthor',{
        title:"更新视频",
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    })
}