var classic = require('../models/models_classics.js');




//保存集合API
exports.saveClassic = function (req, res) {
    classic.findClassic(req.body.eName, function (err, data) {
        if (err) {
            console.log(err);
            res.send('集合查询出错了')
        } else if (data) {
            classic.updateClassic(req.body, function (err, row) {
                if (err) {
                    console.log(err)
                    res.send('集合更新出错了')
                } else if (row) {
                    res.send('集合更新成功:' + row)
                } else {
                    res.send('没有取得更新电影结果？')
                }
            })
        } else {
            classic.insertClassic(req.body, function (err, row) {
                if (err) {
                    res.send('集合保存出错了')
                } else if (row) {
                    res.send('集合保存成功:' + row.insertedIds)
                } else {
                    res.send('没有取得保存集合结果？')
                }
            })
        }
    })
};

//获取一定数量的随机评论
exports.getClassicByEName = function (req, res) {

    var eName = req.query.eName;

    console.log(eName)

    classic.findClassic(eName, function (err, classic) {
        if (err) {
            console.log(err)
        }
        if (classic) {
            res.send(classic)
        }else{
            res.send('没有找到相关集合')

        }
    });
};



//显示合集列表
exports.classics = function (req, res) {
    //判断是否是第一页，并把请求的页数转换成 number 类型
    var page = req.query.p ? parseInt(req.query.p) : 1;
    var num =18
    //查询并返回第 page 页的 10 篇文章
    classic.getEighteenClassics(page,num, function (err, classics, total) {
         if (err) {
            console.log(err)
        }
         res.render('classics', {
            title: 'classic',
            header:'showClassicList',
            classics: classics,
            total: total,
            totalPage: Math.ceil(total/num),
            page: page,
            isFirstPage: (page - 1) == 0,
            isLastPage: ((page - 1) * num + classics.length) == total,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
};