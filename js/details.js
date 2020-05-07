window.addEventListener('load', function () {
    //浏览器窗口高度变化,页面高度发生变化
    function changehigh() {
        let main = document.querySelector('.main');
        main.style.minHeight = this.innerHeight + 'px';
        window.onresize = function () {
            main.style.minHeight = this.innerHeight + 'px';
        }
    }
    changehigh();
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
                        body.style.overflowY = 'scroll';
                    }
                }
            })
        });
    }
    login();
    // 网站加载后调用搜素功能列出歌曲
    function search() {
        let params = decodeURIComponent(location.search.substr(1));
        let arr = params.split('=');
        let keyword = arr[1];
        let main = document.querySelector('.main');
        let header = this.document.querySelector('.header-top');
        let headinput = header.querySelector('.search').querySelector('input');
        let input = main.querySelector('.search').querySelector('input');
        let tab = main.querySelector('.tab');
        let btn = main.querySelector('.search').querySelector('button');
        let i = tab.querySelector('p').querySelector('i');
        let em = tab.querySelector('p').querySelector('em');
        let dl = tab.querySelector('dl');
        let dt = dl.querySelector('dt');
        let strong = dt.querySelector('strong');
        let fn1 = function () { };
        let fn2 = function () { };
        input.addEventListener('focus', function () {
            fn1 = function (e) {
                if (e.keyCode == 13) {
                    headinput.value = input.value;
                    searchkeyword(input.value)
                }
            };
            document.addEventListener('keyup', fn1);
            btn.addEventListener('click', function () {
                searchkeyword(input.value);
            })
        });
        input.addEventListener('blur', function () {
            document.removeEventListener('keyup', fn1)
        })
        headinput.addEventListener('focus', function () {
            fn2 = function (e) {
                if (e.keyCode == 13) {
                    searchkeyword(headinput.value)
                }
            };
            document.addEventListener('keyup', fn2);
        });
        headinput.addEventListener('blur', function () {
            document.removeEventListener('keyup', fn2)
        })
        searchkeyword(keyword);
        function searchkeyword(keyword) {
            input.value = keyword;
            i.innerHTML = keyword;
            let songs = [];
            ajax({
                type: 'get',
                url: 'http://musicapi.leanapp.cn/search/suggest',
                data: {
                    keywords: keyword
                },
                success: function (responseText, xhr) {
                    dl.innerHTML = '';
                    if (undefined != responseText.result && responseText.code == 200 && undefined != responseText.result.songs) {
                        em.innerHTML = responseText.result.songs.length + '';
                        for (let i = 0; i < responseText.result.songs.length; i++) {
                            let temp = dt.cloneNode(true);
                            dl.appendChild(temp);
                        }
                    } else {
                        em.innerHTML = '0';
                        return;
                    }
                    let dts = dl.querySelectorAll('dt');
                    for (let i = 0; i < dts.length; i++) {
                        dts[i].style.display = 'block';
                        let duration = responseText.result.songs[i].duration / 1000;
                        let second = parseInt(duration % 60);
                        let min = parseInt(duration / 60);
                        if (second <= 9) {
                            second = '0' + second;
                        } else {
                            second = '' + second;
                        }
                        if (min <= 9) {
                            min = '0' + min;
                        } else {
                            min = '' + min;
                        }
                        dts[i].children[1].innerHTML = responseText.result.songs[i].name;
                        dts[i].children[3].innerHTML = responseText.result.songs[i].artists[0].name;
                        dts[i].children[4].innerHTML = responseText.result.songs[i].album.name;
                        dts[i].children[5].innerHTML = min + ':' + second;
                        songs[i] = {
                            songname: responseText.result.songs[i].name,
                            author: responseText.result.songs[i].artists[0].name,
                            audioSrc: 'https://music.163.com/song/media/outer/url?id=' + responseText.result.songs[i].id + '.mp3',
                            picUrl: responseText.result.songs[i].artists[0].img1v1Url
                        }
                    }
                    //给所有的播放按钮添加点击事件
                    for (let i = 0; i < dts.length; i++) {
                        dts[i].children[0].addEventListener('click', function () {
                            startPlay(songs, i);
                        })
                    }
                }
            })
        }
    }
    search();
})