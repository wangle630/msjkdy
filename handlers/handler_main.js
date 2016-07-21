
exports.homepage = function(req,res){
    res.render('index',{
        title:"首页",
        header:"首页",
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    })
}

exports.test = function(req,res){
    res.render('test',{
        title:"首页",
        header:"首页",
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    })
}

exports.show = function(req,res){
    res.render('show',{
        title:"详情",
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    })
}

exports.awards = function(req,res){
    res.render('awards',{
        title:"获奖列表",
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    })
}
