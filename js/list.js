window.addEventListener('load', function () {
    //浏览器窗口高度变化，个人收藏页左高度发生变化
    function changehigh() {
        let main = document.querySelector('.main');
        let wrapper = main.querySelector('.wrapper');
        let leftModule = main.querySelector('.leftModule');
        leftModule.style.height = this.innerHeight - 100 + 'px';
        wrapper.style.height = this.innerHeight + 'px';
        window.onresize = function () {
            leftModule.style.height = this.innerHeight + 'px';
            wrapper.style.height = this.innerHeight + 'px';
        }
    }
    changehigh();
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
    if (this.sessionStorage.getItem('uid')) {
        getsonglist(this.sessionStorage.getItem('uid'));
    }
    function getDate(time) {
        let date = new Date(time);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() + '';
        return (Y + M + D);
    }
    function getsonglist(uid) {
        let main = document.querySelector('.main');
        let leftModule = main.querySelector('.leftModule');
        let ul = leftModule.querySelector('ul');
        let li = ul.querySelector('li');
        let rightModule = main.querySelector('.rightModule');
        let column = rightModule.querySelector('.column');
        let img = column.querySelector('.img').querySelector('img');
        let h3 = column.querySelector('.contain').querySelector('h3');
        let h4 = column.querySelector('.contain').querySelector('h4');
        let btns = column.querySelector('.contain').querySelector('.btns');
        let nomusic = rightModule.querySelector('.nomusic');
        let musiclist = rightModule.querySelector('.musiclist');
        let songul = musiclist.querySelector('ul');
        let songli = musiclist.querySelector('li');
        let songslist = [];
        let songs = [];
        ajax({
            type: 'get',
            url: 'http://musicapi.leanapp.cn/user/playlist',
            data: {
                uid: uid
            },
            success: function (responseText, xhr) {
                if (responseText.code == 200 && responseText.playlist != undefined) {
                    if (responseText.playlist.length != 0) {
                        musiclist.style.display = 'block';
                        nomusic.style.display = 'none';
                    }
                    for (let i = 0; i < responseText.playlist.length - 1; i++) {
                        let temp = li.cloneNode(true)
                        ul.appendChild(temp);
                    }
                } else {
                    return;
                }
                let lis = ul.querySelectorAll('li');
                lis[0].className = 'clear choose';
                for (let i = 0; i < lis.length; i++) {
                    lis[i].style.display = 'block';
                    songslist[i] = responseText.playlist[i].id;
                    lis[i].children[0].children[0].src = responseText.playlist[i].coverImgUrl;
                    lis[i].children[1].children[0].innerHTML = responseText.playlist[i].name;
                    lis[i].children[1].children[1].innerHTML = responseText.playlist[i].trackCount;
                }
                img.src = responseText.playlist[0].coverImgUrl;
                h3.children[1].innerHTML = responseText.playlist[0].name;
                h4.children[0].src = responseText.playlist[0].creator.avatarUrl;
                h4.children[1].innerHTML = responseText.playlist[0].creator.nickname;
                let totaltime = getDate(responseText.playlist[0].createTime);
                h4.children[2].children[0].innerHTML = totaltime;
                let songnum = rightModule.querySelector('.songlist').querySelector('.title').querySelector('i');
                for (let i = 0; i < lis.length; i++) {
                    lis[i].addEventListener('click', function () {
                        img.src = responseText.playlist[i].coverImgUrl;
                        h3.children[1].innerHTML = responseText.playlist[i].name;
                        h4.children[0].src = responseText.playlist[i].creator.avatarUrl;
                        h4.children[1].innerHTML = responseText.playlist[i].creator.nickname;
                        totaltime = getDate(responseText.playlist[i].createTime);
                        h4.children[2].children[0].innerHTML = totaltime;
                    })
                }
                ajax({
                    type: 'get',
                    url: 'http://musicapi.leanapp.cn/playlist/detail',
                    data: {
                        id: songslist[0]
                    },
                    success: function (responseText, xhr) {
                        if (responseText.code == 200 && responseText.playlist != undefined) {
                            songnum.innerHTML = responseText.playlist.tracks.length;
                            for (let i = 0; i < responseText.playlist.tracks.length - 1; i++) {
                                let temp = songli.cloneNode(true)
                                songul.appendChild(temp);
                            }

                            songlis = songul.querySelectorAll('li');
                            for (let i = 0; i < responseText.playlist.tracks.length; i++) {
                                songs[i] = {
                                    songname: responseText.playlist.tracks[i].name,
                                    author: responseText.playlist.tracks[i].ar[0].name,
                                    audioSrc: 'https://music.163.com/song/media/outer/url?id=' + responseText.playlist.tracks[i].id + '.mp3',
                                    picUrl: responseText.playlist.tracks[i].al.picUrl
                                }
                                songlis[i].children[0].children[1].innerHTML = songs[i].songname;
                                songlis[i].children[3].innerHTML = songs[i].author;
                                songlis[i].children[4].innerHTML = responseText.playlist.tracks[i].al.name;
                                songlis[i].children[0].children[0].onclick = function () {
                                    startPlay(songs, i);
                                }
                            }
                            btns.children[0].addEventListener('click', function () {
                                startPlay(songs, 0);
                            })
                        }
                    }
                })
                //添加点击事件
                for (let i = 0; i < lis.length; i++) {
                    lis[i].setAttribute('index', i)
                    lis[i].addEventListener('click', function () {
                        for (let i = 0; i < lis.length; i++) {
                            lis[i].className = 'clear';
                        }
                        this.className = 'clear choose';
                        let j = this.getAttribute('index');
                        ajax({
                            type: 'get',
                            url: 'http://musicapi.leanapp.cn/playlist/detail',
                            data: {
                                id: songslist[j]
                            },
                            success: function (responseText, xhr) {
                                if (responseText.code == 200 && responseText.playlist != undefined) {
                                    songul.innerHTML = '';
                                    songnum.innerHTML = responseText.playlist.tracks.length;
                                    for (let i = 0; i < responseText.playlist.tracks.length; i++) {
                                        let temp = songli.cloneNode(true)
                                        songul.appendChild(temp);
                                    }
                                    songlis = songul.querySelectorAll('li');
                                    for (let i = 0; i < responseText.playlist.tracks.length; i++) {
                                        songs[i] = {
                                            songname: responseText.playlist.tracks[i].name,
                                            author: responseText.playlist.tracks[i].ar[0].name,
                                            audioSrc: 'https://music.163.com/song/media/outer/url?id=' + responseText.playlist.tracks[i].id + '.mp3',
                                            picUrl: responseText.playlist.tracks[i].al.picUrl
                                        }
                                        songlis[i].children[0].children[1].innerHTML = songs[i].songname;
                                        songlis[i].children[3].innerHTML = songs[i].author;
                                        songlis[i].children[4].innerHTML = responseText.playlist.tracks[i].al.name;
                                        songlis[i].children[0].children[0].onclick = function () {
                                            startPlay(songs, i);
                                        }
                                    }
                                }
                            }
                        })
                    })
                }
            }
        })
    }
})
