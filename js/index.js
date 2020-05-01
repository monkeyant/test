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
    //登录界面
    function login() {
        let login = document.querySelector('.header-top').querySelector('.login');
        let login_btn = login.children[0];
        let contain = login.querySelector('.contain');
        let bg = login.querySelector('.bg');
        let close = contain.querySelector('.close');
        let body = document.getElementsByTagName('body')[0];
        login_btn.addEventListener('click', function () {
            contain.style.display = 'block';
            bg.style.display = 'block';
            body.style.overflowY = 'hidden';
        });
        close.addEventListener('click', function () {
            contain.style.display = 'none';
            bg.style.display = 'none';
            body.style.overflowY = 'scroll';
        });
        //登录功能
        let input = contain.querySelectorAll('input');
        let avatar = login.querySelector('.avatar');
        let img = avatar.querySelector('img');
        let btn = contain.querySelector('.btns').querySelector('button');
        let h4 = contain.querySelector('h4');
        btn.addEventListener('click', function () {
            let phone = input[0].value;
            let password = input[1].value;
            ajax({
                type: 'get',
                url: 'http://musicapi.leanapp.cn/login/cellphone',
                data: {
                    phone: phone,
                    password: password
                },
                success: function (responseText, xhr) {
                    if (responseText.code != 200) {
                        h4.style.visibility = 'visible';
                    } else {
                        avatar.style.display = 'block';
                        img.src = responseText.profile.avatarUrl;
                        login_btn.style.display = 'none';
                        contain.style.display = 'none';
                        bg.style.display = 'none';
                        body.style.overflow = 'scroll';
                    }
                }
            })
        });
    }
    login();
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
        let contain = [];
        let tab = hot.querySelector('.tab').querySelectorAll('.box');
        contain[0] = hot.querySelector('.contain');
        for (let i = 1; i < 5; i++) {
            contain[i] = contain[0].cloneNode(true);
            tab[i].appendChild(contain[i]);
        }
        contain[0].className = 'contain current';
        //点击切换
        for (let i = 0; i < tab.length; i++) {
            let index = i;
            tab[i].onclick = function () {
                for (let i = 0; i < tab.length; i++) {
                    contain[i].className = 'contain';
                }
                contain[index].className = 'contain current'
            }
        }
        let dt = [];
        let img = [];
        let strong = [];
        let span = [];
        let play = [];
        let songlist = [];
        let songs = [];
        for (let i = 0; i < contain.length; i++) {
            let arr = contain[i].querySelectorAll('dt');
            dt[i] = Array.from(arr);
            img[i] = [];
            strong[i] = [];
            span[i] = [];
            play[i] = [];
            songlist[i] = [];
            songs[i] = [];
            for (let j = 0; j < 10; j++) {
                img[i][j] = dt[i][j].querySelector('img');
                strong[i][j] = dt[i][j].querySelector('strong');
                span[i][j] = dt[i][j].querySelector('a').children[0];
                play[i][j] = dt[i][j].querySelector('a');
            }
        }
        ajax({
            type: 'get',
            url: 'http://musicapi.leanapp.cn/playlist/hot',
            success: function (responseText, xhr) {
                for (let i = 0; i < responseText.tags.length; i++) {
                    songlist[i] = responseText.tags[i].id;
                }
                let index = 0;
                for (let i = 0; i < 6; i++) {
                    ajax({
                        type: 'get',
                        url: 'http://musicapi.leanapp.cn/playlist/detail',
                        data: {
                            id: songlist[i]
                        },
                        success: function (responseText, xhr) {
                            if (responseText.code != 200) {
                                index = i;
                                return;
                            }
                            if (i == 5) {
                                i = index;
                            }
                            for (let j = 0; j < 50; j++) {
                                if (j >= responseText.playlist.tracks.length) {
                                    break;
                                }
                                songs[i][j] = {
                                    songname: responseText.playlist.tracks[j].name,
                                    author: responseText.playlist.tracks[j].ar[0].name,
                                    audioSrc: 'https://music.163.com/song/media/outer/url?id=' + responseText.playlist.tracks[j].id + '.mp3',
                                    picUrl: responseText.playlist.tracks[j].al.picUrl
                                }
                            }
                            for (let j = 0; j < 10; j++) {
                                strong[i][j].innerHTML = songs[i][j].songname;
                                img[i][j].src = songs[i][j].picUrl;
                                span[i][j].innerHTML = songs[i][j].songname + '-' + songs[i][j].author;
                            }
                            //给所有的图片添加点击事件
                            for (let j = 0; j < 10; j++) {
                                play[i][j].onclick = function () {
                                    startPlay(songs, i, j);
                                }
                            }
                        }
                    });
                }
            }
        });
    }
    hot();
})
                                // let Id = responseText.playlist.tracks[i].id;
                                // ajax({
                                //     type: 'get',
                                //     url: 'http://musicapi.leanapp.cn/check/music',
                                //     data: {
                                //         id: Id
                                //     },
                                //     success: function (responseText, xhr) {
                                //         console.log(11)
                                //         if (responseText.success == true) {
                                //             let http = new XMLHttpRequest()
                                //             http.withCredentials = true
                                //             http.onreadystatechange = function () {
                                //                 if (http.readyState === 4 && http.status === 200) {
                                //                     console.log(JSON.parse(http.responseText))
                                //                 }
                                //             }
                                //             http.open("GET", `http://musicapi.leanapp.cn/song/url?id=`+Id, true);
                                //             http.send();

                                // ajax({
                                //     type: 'get',
                                //     url: 'http://musicapi.leanapp.cn/song/url',
                                //     withCredentials: true,
                                //     data: {
                                //         id: Id
                                //     },
                                //     success: function (responseText, xhr) {
                                //         console.log(responseText);
                                //     }
