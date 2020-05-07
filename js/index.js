window.addEventListener('load', function () {
    // 轮播图
    //搜索框
    function headersearch() {
        let header = this.document.querySelector('.header-top');
        let search = header.querySelector('.search');
        let input = search.querySelector('input');
        let form = search.querySelector('form');
        input.addEventListener('focus', function () {
            document.addEventListener('keyup', function (e) {
                if (e.keyCode == 13) {
                    form.submit();
                }
            });
        });
    }
    headersearch();
    slide();
    function slide() {
        let banner = document.querySelector('.banner');
        let slide = banner.querySelector('.slide');
        let content = slide.querySelector('.content');
        let contentLi = content.querySelectorAll('li');
        let reflect = document.getElementById('reflect');
        reflect.innerHTML = content.innerHTML;
        let reflectLi = reflect.querySelectorAll('li');
        let arr = [contentLi, reflectLi]; // 轮播图和他的倒影行为完全相同，以数组形式绑定相同函数
        let btnL = banner.querySelector('.btnL');
        let btnR = banner.querySelector('.btnR');
        let span = banner.querySelector('.btn-list').querySelectorAll('span');
        let num = 0;
        btnL.addEventListener('click', function () {
            num--;
            if (num > 4) {
                num = 0;
            }
            if (num < 0) {
                num = 4;
            }
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr[i].length; j++) {
                    let k = num + j;
                    if (k > 4) {
                        k = k - 5;
                    }
                    arr[i][j].className = "box" + k;
                }
            }
            for (i = 0; i < span.length; i++) {
                span[i].className = '';
            }
            span[num].className = "current";
        });
        btnR.addEventListener('click', function () {
            num++;
            if (num > 4) {
                num = 0;
            }
            if (num < 0) {
                num = 4;
            }
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr[i].length; j++) {
                    let k = num + j;
                    if (k > 4) {
                        k = k - 5;
                    }
                    arr[i][j].className = "box" + k;
                }
            }
            for (i = 0; i < span.length; i++) {
                span[i].className = '';
            }
            span[num].className = "current";
        });
        for (let i = 0; i < span.length; i++) {
            span[i].setAttribute('index', i);
            span[i].addEventListener('click', function () {
                num = this.getAttribute('index') - 0;
                for (i = 0; i < span.length; i++) {
                    span[i].className = '';
                }
                this.className = "current";
                for (let i = 0; i < arr.length; i++) {
                    for (let j = 0; j < arr[i].length; j++) {
                        let k = num + j;
                        if (k > 4) {
                            k = k - 5;
                        }
                        arr[i][j].className = "box" + k;
                    }
                }
            });
        }
        var timer = setInterval(function () {
            btnR.click();
        }, 3000)
        slide.addEventListener('mouseenter', function () {
            clearInterval(timer);
        })
        slide.addEventListener('mouseleave', function () {
            timer = setInterval(function () {
                btnR.click();
            }, 3000)
        });
    }
    function hot() {
        let hot = document.querySelector('.hotrecommend');
        let tab = hot.querySelector('.tab').querySelectorAll('.box');
        let contain = hot.querySelector('.contain');
        let dt = contain.querySelectorAll('dt');
        let songlist = [];
        let songs = [];
        ajax({
            type: 'get',
            url: 'http://musicapi.leanapp.cn/playlist/hot',
            success: function (responseText, xhr) {
                for (let i = 0; i < responseText.tags.length; i++) {
                    songlist[i] = responseText.tags[i].id;
                }
                ajax({
                    type: 'get',
                    url: 'http://musicapi.leanapp.cn/playlist/detail',
                    data: {
                        id: songlist[0]
                    },
                    success: function (responseText, xhr) {
                        if (responseText.code == 200 && responseText.playlist.tracks) {
                            for (let i = 0; i < responseText.playlist.tracks.length; i++) {
                                songs[i] = {
                                    songname: responseText.playlist.tracks[i].name,
                                    author: responseText.playlist.tracks[i].ar[0].name,
                                    audioSrc: 'https://music.163.com/song/media/outer/url?id=' + responseText.playlist.tracks[i].id + '.mp3',
                                    picUrl: responseText.playlist.tracks[i].al.picUrl
                                }
                            }
                            for (let i = 0; i < dt.length; i++) {
                                dt[i].querySelector('strong').innerHTML = songs[i].songname;
                                dt[i].querySelector('img').src = songs[i].picUrl;
                                dt[i].querySelector('a').children[0].innerHTML = songs[i].songname + '-' + songs[i].author;
                            }
                            //给所有的图片添加点击事件                         
                            for (let i = 0; i < dt.length; i++) {
                                dt[i].querySelector('a').onclick = function () {
                                    startPlay(songs, i);
                                }
                            }
                        }
                    }
                });
                //tab切换
                for (let i = 0; i < tab.length; i++) {
                    tab[i].setAttribute('index', i);
                    tab[i].addEventListener('click', function () {
                        ajax({
                            type: 'get',
                            url: 'http://musicapi.leanapp.cn/playlist/detail',
                            data: {
                                id: songlist[tab[i].getAttribute('index')]
                            },
                            success: function (responseText, xhr) {
                                if (responseText.code == 200 && responseText.playlist.tracks) {
                                    for (let i = 0; i < responseText.playlist.tracks.length; i++) {
                                        songs[i] = {
                                            songname: responseText.playlist.tracks[i].name,
                                            author: responseText.playlist.tracks[i].ar[0].name,
                                            audioSrc: 'https://music.163.com/song/media/outer/url?id=' + responseText.playlist.tracks[i].id + '.mp3',
                                            picUrl: responseText.playlist.tracks[i].al.picUrl
                                        }
                                    }
                                    for (let i = 0; i < dt.length; i++) {
                                        dt[i].querySelector('strong').innerHTML = songs[i].songname;
                                        dt[i].querySelector('img').src = songs[i].picUrl;
                                        dt[i].querySelector('a').children[0].innerHTML = songs[i].songname + '-' + songs[i].author;
                                    }
                                    //给所有的图片添加点击事件                         
                                    for (let i = 0; i < dt.length; i++) {
                                        dt[i].querySelector('a').onclick = function () {
                                            startPlay(songs, i);
                                        }
                                    }
                                } else {
                                    let massage = document.querySelector('.massage-container').querySelector('.massage');
                                    massage.querySelector('span').innerHTML = '歌单不存在，请更换歌单';
                                    document.querySelector('.massage-container').style.display = 'flex';
                                    massage.className = 'massage move-in';
                                    setTimeout(function () {
                                        massage.className = 'massage move-out';
                                        setTimeout(function() {
                                            document.querySelector('.massage-container').style.display = 'none';
                                        },1000)
                                    }, 3000)
                                    massage.querySelector('.close').onclick = function () {
                                        this.parentNode.className = 'massage move-out';
                                        setTimeout(function() {
                                            document.querySelector('.massage-container').style.display = 'none';
                                        },1000)
                                    }
                                }
                            }
                        });
                    })
                }
            }
        });
    }
    hot();
    function newalbums() {
        let newsongs = document.querySelector('.main').querySelector('.newsongs');
        let more = newsongs.querySelector('.title').querySelector('em');
        let lis = newsongs.querySelector('.contain').querySelectorAll('li');
        let songlist = [];
        let songs = [];
        let offset = 0;
        ajax({
            type: 'get',
            url: 'http://musicapi.leanapp.cn/top/album',
            data: {
                offset: 0,
                limit: 5
            },
            success: function (responseText, xhr) {
                if (responseText.code == 200 && responseText.albums != undefined) {
                    for (let i = 0; i < responseText.albums.length; i++) {
                        songlist[i] = responseText.albums[i].id;
                    }
                    for (let i = 0; i < lis.length; i++) {
                        lis[i].querySelector('.img').querySelector('img').src = responseText.albums[i].picUrl;
                        lis[i].querySelector('p').querySelector('span').innerHTML = responseText.albums[i].name;
                        lis[i].querySelector('p').querySelector('em').innerHTML = responseText.albums[i].company;
                    }
                } else {
                    return;
                }
                //更多点击
                more.addEventListener('click', function () {
                    offset += 5;
                    ajax({
                        type: 'get',
                        url: 'http://musicapi.leanapp.cn/top/album',
                        data: {
                            offset: offset,
                            limit: 5
                        },
                        success: function (responseText, xhr) {
                            if (responseText.code == 200 && responseText.albums != undefined) {
                                for (let i = 0; i < responseText.albums.length; i++) {
                                    songlist[i] = responseText.albums[i].id;
                                }
                                for (let i = 0; i < lis.length; i++) {
                                    lis[i].querySelector('.img').querySelector('img').src = responseText.albums[i].picUrl;
                                    lis[i].querySelector('p').querySelector('span').innerHTML = responseText.albums[i].name;
                                    lis[i].querySelector('p').querySelector('em').innerHTML = responseText.albums[i].company;
                                }
                            } else {
                                return;
                            }
                        }
                    })
                })
                // 点击
                for (let i = 0; i < lis.length; i++) {
                    lis[i].querySelector('.img').querySelector('a').setAttribute('index', i);
                    if (responseText.albums[i].paid == false) {
                        lis[i].querySelector('.img').querySelector('a').addEventListener('click', function () {
                            let songid = songlist[this.getAttribute('index')];
                            ajax({
                                type: 'get',
                                url: 'http://musicapi.leanapp.cn/playlist/detail',
                                data: {
                                    id: songid
                                },
                                success: function (responseText, xhr) {
                                    if (responseText.code == 200 && responseText.playlist != undefined && responseText.playlist.tracks.length != 0) {
                                        for (let i = 0; i < responseText.playlist.tracks.length; i++) {
                                            songs[i] = {
                                                songname: responseText.playlist.tracks[i].name,
                                                author: responseText.playlist.tracks[i].ar[0].name,
                                                audioSrc: 'https://music.163.com/song/media/outer/url?id=' + responseText.playlist.tracks[i].id + '.mp3',
                                                picUrl: responseText.playlist.tracks[i].al.picUrl
                                            }
                                        }
                                        startPlay(songs, 0);
                                    }
                                }
                            })

                        })
                    }
                }
            }
        })
    }
    newalbums();
    function topBoard() {
        let main = document.querySelector('.main');
        let leaderBoard = main.querySelector('.leaderBoard');
        let more = leaderBoard.querySelector('.title').querySelector('em');
        let index = 0;
        topBoardData(index);
        more.addEventListener('click', function () {
            index += 4;
            topBoardData(index);
        })
    }
    topBoard();
    function topBoardData(index) {
        let main = document.querySelector('.main');
        let leaderBoard = main.querySelector('.leaderBoard');
        let lis = leaderBoard.querySelector('.contain').querySelector('ul').children;
        let songs = [];
        let index1 = index;
        let index2 = index + 1;
        let index3 = index + 2;
        let index4 = index + 3;
        for (let i = 0; i < 4; i++) {
            songs[i] = [];
        }
        ajax({
            type: 'get',
            url: 'http://musicapi.leanapp.cn/top/list',
            data: {
                idx: index1
            },
            success: function (responseText, xhr) {
                lis[0].querySelector('.head').querySelector('em').innerHTML = responseText.playlist.name;
                for (let i = 0; i < responseText.playlist.tracks.length; i++) {
                    songs[0][i] = {
                        songname: responseText.playlist.tracks[i].name,
                        author: responseText.playlist.tracks[i].ar[0].name,
                        audioSrc: 'https://music.163.com/song/media/outer/url?id=' + responseText.playlist.tracks[i].id + '.mp3',
                        picUrl: responseText.playlist.tracks[i].al.picUrl
                    }
                }
                for (let i = 0; i < 4; i++) {
                    lis[0].querySelectorAll('li')[i].querySelector('em').innerHTML = responseText.playlist.tracks[i].name;
                    lis[0].querySelectorAll('li')[i].querySelector('span').innerHTML = responseText.playlist.tracks[i].ar[0].name;
                    lis[0].querySelectorAll('li')[i].querySelector('a').addEventListener('click', function () {
                        startPlay(songs[0], i);
                    })
                }
            }
        })
        ajax({
            type: 'get',
            url: 'http://musicapi.leanapp.cn/top/list',
            data: {
                idx: index2
            },
            success: function (responseText, xhr) {
                lis[1].querySelector('.head').querySelector('em').innerHTML = responseText.playlist.name;
                for (let i = 0; i < responseText.playlist.tracks.length; i++) {
                    songs[1][i] = {
                        songname: responseText.playlist.tracks[i].name,
                        author: responseText.playlist.tracks[i].ar[0].name,
                        audioSrc: 'https://music.163.com/song/media/outer/url?id=' + responseText.playlist.tracks[i].id + '.mp3',
                        picUrl: responseText.playlist.tracks[i].al.picUrl
                    }
                }
                for (let i = 0; i < 4; i++) {
                    lis[1].querySelectorAll('li')[i].querySelector('em').innerHTML = responseText.playlist.tracks[i].name;
                    lis[1].querySelectorAll('li')[i].querySelector('span').innerHTML = responseText.playlist.tracks[i].ar[0].name;
                    lis[1].querySelectorAll('li')[i].querySelector('a').addEventListener('click', function () {
                        startPlay(songs[1], i);
                    })
                }
            }
        })
        ajax({
            type: 'get',
            url: 'http://musicapi.leanapp.cn/top/list',
            data: {
                idx: index3
            },
            success: function (responseText, xhr) {
                lis[2].querySelector('.head').querySelector('em').innerHTML = responseText.playlist.name;
                for (let i = 0; i < responseText.playlist.tracks.length; i++) {
                    songs[2][i] = {
                        songname: responseText.playlist.tracks[i].name,
                        author: responseText.playlist.tracks[i].ar[0].name,
                        audioSrc: 'https://music.163.com/song/media/outer/url?id=' + responseText.playlist.tracks[i].id + '.mp3',
                        picUrl: responseText.playlist.tracks[i].al.picUrl
                    }
                }
                for (let i = 0; i < 4; i++) {
                    lis[2].querySelectorAll('li')[i].querySelector('em').innerHTML = responseText.playlist.tracks[i].name;
                    lis[2].querySelectorAll('li')[i].querySelector('span').innerHTML = responseText.playlist.tracks[i].ar[0].name;
                    lis[2].querySelectorAll('li')[i].querySelector('a').addEventListener('click', function () {
                        startPlay(songs[2], i);
                    })
                }
            }
        })
        ajax({
            type: 'get',
            url: 'http://musicapi.leanapp.cn/top/list',
            data: {
                idx: index4
            },
            success: function (responseText, xhr) {
                lis[3].querySelector('.head').querySelector('em').innerHTML = responseText.playlist.name;
                for (let i = 0; i < responseText.playlist.tracks.length; i++) {
                    songs[3][i] = {
                        songname: responseText.playlist.tracks[i].name,
                        author: responseText.playlist.tracks[i].ar[0].name,
                        audioSrc: 'https://music.163.com/song/media/outer/url?id=' + responseText.playlist.tracks[i].id + '.mp3',
                        picUrl: responseText.playlist.tracks[i].al.picUrl
                    }
                }
                for (let i = 0; i < 4; i++) {
                    lis[3].querySelectorAll('li')[i].querySelector('em').innerHTML = responseText.playlist.tracks[i].name;
                    lis[3].querySelectorAll('li')[i].querySelector('span').innerHTML = responseText.playlist.tracks[i].ar[0].name;
                    lis[3].querySelectorAll('li')[i].querySelector('a').addEventListener('click', function () {
                        startPlay(songs[3], i);
                    })
                }
            }
        })
    }
})