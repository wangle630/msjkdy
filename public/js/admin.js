//根据“.” 取得分词结果
function fielFenciByDot(filename) {
    var arr = filename.split(".");
    showFenciResult(arr);
}


//JavaScript 取百度分词结果
function fileFenciByBaidu2(filename) {
    // 典型的ajax编程模板
    // 1. 创建XMLHttpReqeust对象
    var xhr = new XMLHttpRequest();
    // 2. open操作初始化请求信息
    xhr.open('GET', 'http://apis.baidu.com/apistore/pullword/words?source=' + filename + '&param1=0&param2=0', true);
    xhr.setRequestHeader("apikey", "7e68c0b7a3b7afb0b9d0287a8d5d4235");

    // 3. 监听事件处理响应结果
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {

            var obj = xhr.responseText.split("\n")
            showFenciResult(obj);
        }
    };
    // 4. send操作发出请求
    xhr.send();

}

//通过jQuerty取得百度分词结果，headers有时候无法插入
function fileFenciByBaidu(filenmae) {
    var url = 'http://apis.baidu.com/apistore/pullword/words?source=' + encodeURI(filenmae) + '&param1=0&param2=0'
    $.ajax(url, {
        cache: false,
        headers: {apikey: '7e68c0b7a3b7afb0b9d0287a8d5d4235',}
    }).done(function (data) {
        var obj = data.split("\n")
        showFenciResult(obj);
    });
}



//处理分词结果   动态生成按钮
function showFenciResult(data) {
    if (data.length) {
        for (var i = 0; i < data.length; i++) {
            if(data[i].trim().length > 0){
                $('#fenciResult').append('<div class="btn btn-default btn-sm" id=' + data[i] + ' onclick="getDouBanMovieList(this.id)">' + data[i] + '</div> ')
            }
        }
    }
}

//根据按钮生成电影列表
function getDouBanMovieList(t) {
    $('#dblist').text('');
    var url = 'http://api.douban.com/v2/movie/search?q=' + t
    var doubanList = []
    $.ajax(url, {
        dataType: 'jsonp'
    }).done(function (data) {
        if (data.subjects.length > 0) {
            $('#dblist').append('<h2>查找到<kbd>' + data.subjects.length + '</kbd>条纪录</h2>')
            $('#dblist').append('<ul>');

            for (var i = 0; i < data.subjects.length; i++) {
                $('#dblist').append('<div class="col-md-2" style="width:90px;height:150px"><a id="' +
                    data.subjects[i].id +
                    '" onclick="showMachMovie(id)"   >' +
                    '<p>' +
                    data.subjects[i].title +

                    '<img src="' +
                    data.subjects[i].images.small +
                    '"  alt="..." >' +
                    '</p></a></div>')
                doubanList.push(data.subjects[i].id);
            }
            $('#dblist').append('</ul>');

            //saveAllMovieList(doubanList)
        } else {
            $('#dblist').append('<h3>查找到<kbd>0</kbd>条纪录</h3>')
        }
    }).fail(function () {
        alert('查找失败');
    });
}

//根据豆瓣ID查询电影详情,返回豆瓣的JSON数据
function getDoubanDetail(alt, callback) {
    alt = 'http://api.douban.com/v2/movie/subject/' + alt + '?callback=?'
    $.getJSON(alt).done(function (data) {
        //返回获取的JSON对象数据
        gMOVIE.update = $.now();
        gMOVIE.douban = data;
        callback(gMOVIE);
    }).fail(function (err) {
        alert('查找失败！' + err)
    });
}


//获取omdb电影信息,并返回omdb结果的JSON对象//http://www.omdbapi.com/
function getOmdbDetailByName(titles, callback) {
    //titles.push(gMOVIE.douban.original_title)
    //for (var i = 0; i < titles.length; i++) {
        $.ajax({
                url: "http://www.omdbapi.com/",
                data: {
                    t: titles,
                    plot: 'full',
                    tomatoes: true,
                    r: 'json'
                },
                success: function (omdbData) {
                    if (omdbData.imdbID && omdbData.Title == titles) {
                        gMOVIE.imdb = omdbData;
                        callback(gMOVIE);
                    } else{
                        console.log("获取空")

                        gMOVIE.imdb = {};

                        gMOVIE.imdb.Title = "";
                        gMOVIE.imdb.Rated = "";
                        gMOVIE.imdb.Genre = "";
                        gMOVIE.imdb.Director = "";
                        gMOVIE.imdb.Actors = "";
                        gMOVIE.imdb.Plot = "";
                        gMOVIE.imdb.imdbRating = "";
                        gMOVIE.imdb.imdbID = "";
                        gMOVIE.imdb.tomatoRating = "";
                        gMOVIE.imdb.BoxOffice = "";
                        callback(gMOVIE);
                    }
                },
                error: function (data) {
                    console.log(data)
                    callback(gMOVIE);

                }
            }
        )
    //}
}


//获取omdb电影信息,并返回omdb结果的JSON对象//http://www.omdbapi.com/
function getOmdbDetailByID(titles, callback) {
    $.ajax({
            url: "http://www.omdbapi.com/",
            data: {
                i: titles,
                plot: 'full',
                tomatoes: true,
                r: 'json'
            },
            success: function (omdbData) {
                    gMOVIE.imdb = omdbData;
                    callback(gMOVIE);
            },
            error: function (data) {
                console.log(data)
                callback(gMOVIE);

            }
        }
    )
}


//根据gMOVIE合并后的JSON数据显示豆瓣电影信息
function showDoubanMovieInfo(monvieinfo) {
    console.log(monvieinfo);

    $('#showDoubanInfo').append('<h4 class="text-success">' + '豆瓣信息:' + '</h4></br>')
    $('#showDoubanInfo').append('豆瓣ID:' + monvieinfo.douban.id + '</br>')
    $('#showDoubanInfo').append('原始名称:' + monvieinfo.douban.original_title + '</br>')
    $('#showDoubanInfo').append('豆瓣评分:' + monvieinfo.douban.rating.average + '</br>')
    $('#showDoubanInfo').append('主演:' + monvieinfo.douban.casts[0].name + '</br>')
    $('#showDoubanInfo').append('导演:' + monvieinfo.douban.directors[0].name + '</br>')
    $('#showDoubanInfo').append('其它名:' + monvieinfo.douban.aka + '</br>')
    $('#showDoubanInfo').append('类型:' + monvieinfo.douban.genres + '</br>')
    $('#showDoubanInfo').append('类型:' + monvieinfo.douban.subtype + '</br>')

}

//根据gMOVIE合并后的JSON数据显示豆瓣电影信息
function showImdbMovieInfo(monvieinfo) {
    console.log(monvieinfo);
    if(monvieinfo.imdb.imdbID){
        $('#showImdbInfo').append('<h4 class="text-warning">' + 'imdb信息:' + '</h4></br>')
        $('#showImdbInfo').append('imdbID:' + monvieinfo.imdb.imdbID + '</br>')
        $('#showImdbInfo').append('imdb名称:' + monvieinfo.imdb.Title + '</br>')
        $('#showImdbInfo').append('imdb评分:' + monvieinfo.imdb.imdbRating + '</br>')
        $('#showImdbInfo').append('imdb评级:' + monvieinfo.imdb.Rated + '</br>')
        $('#showImdbInfo').append('tomatoURL:' + monvieinfo.imdb.tomatoURL + '</br>')
        $('#showImdbInfo').append('tomatoRating:' + monvieinfo.imdb.tomatoRating + '</br>')
        $('#showImdbInfo').append('tomatoUserRating:' + monvieinfo.imdb.tomatoUserRating + '</br>')
        $('#showImdbInfo').append('票房:' + monvieinfo.imdb.BoxOffice + '</br>')
        $('#showImdbInfo').append('发行:' + monvieinfo.imdb.Production + '</br>')
        $('#showImdbInfo').append('<a href = "' + monvieinfo.imdb.Poster + '">图片</a>')


    }
}
