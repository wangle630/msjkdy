exports.getVideo = function(req,res){
    res.render('admin_getVideo',{
        title:"getVideo",
        header:"getVideo",
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    })
}

exports.getClassic = function(req,res){
    res.render('admin_getClassic',{
        title:"getClassic",
        header:"getClassic",
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    })
}


exports.getAuthor = function(req,res){
    res.render('admin_getAuthor',{
        title:"getAuthor",
        header:"getAuthor",
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    })
}


exports.getFilm = function(req,res){
    res.render('admin_getFilm',{
        title:"getFilm",
        header:"getFilm",
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    })
}