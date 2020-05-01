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
                        let uid = responseText.account.id;
                        getsonglist(uid);
                    }
                }
            })
        });
    }
    login();
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
                                songlis[i].children[0].children[0].onclick = function(){
                                    startPlay(songs,i);
                                }
                            }
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
                                                }
                                            }
                                        }
                                    })
                                })
                            }
                        }
                    }
                })
            }
        })
    }
})
{/* <li class="clear">
                                    <span class="songname"><strong></strong>em红莲的弓矢</span>
                                    <em>05：16</em>
                                    <span class="btns">
                                        <a href="javascript:;" class="firbtn"></a>
                                        <a href="javascript:;" class="secbtn"></a>
                                        <a href="javascript:;" class="thibtn"></a>
                                        <a href="javascript:;" class="fivbtn"></a>
                                        <a href="javascript:;" class="sixbtn"></a>
                                    </span>
                                    <em>linked horizon</em>
                                    <em>自由的进击</em>
// ajax({ */}
//     type: 'get',
//     url: 
//     data: {
//         id: songlist[i]
//     },
//     success: function (responseText, xhr) {
//         if (responseText.code != 200) {
//             index = i;
//             return;
//         }
//         if (i == 5) {
//             i = index;
//         }
//         for (let j = 0; j < 50; j++) {
//             if (j >= responseText.playlist.tracks.length) {
//                 break;
//             }
//             songs[i][j] = {
//                 songname: responseText.playlist.tracks[j].name,
//                 author: responseText.playlist.tracks[j].ar[0].name,
//                 audioSrc: 'https://music.163.com/song/media/outer/url?id=' + responseText.playlist.tracks[j].id + '.mp3',
//                 picUrl: .picUrl
//             }
//         }
//         for (let j = 0; j < 10; j++) {
//             strong[i][j].innerHTML = songs[i][j].songname;
//             img[i][j].src = songs[i][j].picUrl;
//             span[i][j].innerHTML = songs[i][j].songname + '-' + songs[i][j].author;
//         }
//         //给所有的图片添加点击事件
//         for (let j = 0; j < 10; j++) {
//             play[i][j].onclick = function () {
//                 startPlay(songs, i, j);
//             }
//         }
//     }
// });

/* <div class="songlist">
                    <div class="title">
                        <div class="name">歌曲列表<span><i>0</i>首歌</span></div>
                        <em>更多</em>
                    </div>
                    <div class="contain">
                        <div class="nomusic">
                            <h3>
                                <i></i>
                                暂无音乐
                            </h3>
                            <p>点击<i></i>即可将你喜欢的音乐收藏到“我的音乐”&nbsp;&nbsp;&nbsp;&nbsp;马上去<a href="javasrcipt:;">发现音乐</a>
                            </p>
                        </div>
                        <div class="musiclist">
                            <div class="title clear">
                                <div class="songtitle">歌曲标题</div>
                                <div class="time">时长</div>
                                <div class="author">歌手</div>
                                <div class="album">专辑</div>
                            </div>
                            <ul>

                                </li> */
/* <ul>

                </ul> */
            //     let songs = [];
            // ajax({
            //   
            //     success: function (responseText, xhr) {
            //         console.log(responseText)
            //         if (undefined != responseText.result && responseText.code == 200 && undefined != responseText.result.songs) {
            //             em.innerHTML = responseText.result.songs.length + '';
            //             for (let i = 1; i < responseText.result.songs.length; i++) {
            //                 let temp = dt.cloneNode(true);
            //                 dl.appendChild(temp);
            //             }
            //         } else {
            //             return;
            //         }
            //         let dts = dl.querySelectorAll('dt');
            //         for (let i = 0; i < dts.length; i++) {
            //             
            //     
            //             dts[i].children[1].innerHTML = responseText.result.songs[i].name;
            //             dts[i].children[3].innerHTML = responseText.result.songs[i].artists[0].name;
            //             dts[i].children[4].innerHTML = responseText.result.songs[i].album.name;
            //             dts[i].children[5].innerHTML = min + ':' + second;
            //             songs[i] = {
            //                 songname: responseText.result.songs[i].name,
            //                 author: responseText.result.songs[i].artists[0].name,
            //                 audioSrc: 'https://music.163.com/song/media/outer/url?id=' + responseText.result.songs[i].id + '.mp3',
            //                 picUrl: responseText.result.songs[i].artists[0].img1v1Url
            //             }
            //         }