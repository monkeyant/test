if (sessionStorage.getItem('flag')) {
    sessionStorage.removeItem('flag');
}
sessionStorage.setItem('flag', 'false');
// 点击暂停播放按钮
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
    //已经登陆过，切换页面登录
    if (sessionStorage.getItem('phone') && sessionStorage.getItem('password')) {
        ajax({
            type: 'get',
            url: 'http://musicapi.leanapp.cn/login/cellphone',
            data: {
                phone: sessionStorage.getItem('phone'),
                password: sessionStorage.getItem('password')
            },
            success: function (responseText, xhr) {
                if (responseText.code != 200) {
                    return;
                } else {
                    avatar.style.display = 'block';
                    img.src = responseText.profile.avatarUrl;
                    login_btn.style.display = 'none';
                }
            }
        })
    }
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
                    if (sessionStorage.getItem('phone')) {
                        sessionStorage.removeItem('phone');
                        sessionStorage.removeItem('password');
                        sessionStorage.removeItem('uid');
                    }
                    sessionStorage.setItem('phone', phone);
                    sessionStorage.setItem('password', password);
                    sessionStorage.setItem('uid', responseText.account.id);
                    avatar.style.display = 'block';
                    img.src = responseText.profile.avatarUrl;
                    login_btn.style.display = 'none';
                    contain.style.display = 'none';
                    bg.style.display = 'none';
                    body.style.overflowY = 'scroll';
                    location.reload(true);
                }
            }
        })
    });
}
function playPause() {
    let audio = document.querySelector('audio');
    let info = document.querySelector('.info');
    let btns = info.querySelector('.btns');
    let totalTime = info.querySelector('.play').querySelector('.totaltime');
    btns.children[1].addEventListener('click', function () {
        if (sessionStorage.getItem('flag') == 'true') {
            this.style.backgroundPosition = "-40px -204px";
            audio.pause();
            sessionStorage.removeItem('flag');
            sessionStorage.setItem('flag', 'false');
        } else {
            this.style.backgroundPosition = "-40px -165px";
            sessionStorage.removeItem('flag');
            sessionStorage.setItem('flag', 'true');
            //设置总时间
            let timer = setInterval(function () {
                if (audio.readyState == 4) {
                    let second = parseInt(audio.duration % 60);
                    let min = parseInt(audio.duration / 60);
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
                    totalTime.innerHTML = min + ':' + second;
                    clearInterval(timer);
                }
            }, 10)
            audio.play();
        }
    });
}
//进度条
function progressbar() {
    let audio = document.querySelector('audio');
    let info = document.querySelector('.info');
    let play = info.querySelector('.play');
    let currenttime = play.querySelector('.currenttime');
    let outbox = play.querySelector('.outbox');
    let slide = outbox.querySelector('.slide');
    let slide_btn = slide.querySelector('span');
    let timer = setInterval(function () {
        //设置当前时间
        let second = parseInt(audio.currentTime % 60);
        let min = parseInt(audio.currentTime / 60);
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
        currenttime.innerHTML = min + ':' + second;
        slide.style.width = audio.currentTime / audio.duration * outbox.offsetWidth + 'px';
    }, 1000);
    //点击移动进度条
    outbox.addEventListener('click', function (e) {
        let x = (e.pageX - this.offsetLeft) / this.offsetWidth;
        slide.style.width = x * 100 + '%';
        audio.currentTime = audio.duration * x;
    });
    //滑动进度条
    slide_btn.addEventListener('mousedown', function (e) {
        document.addEventListener('mousemove', move);
        function move(e) {
            let x = (e.pageX - outbox.offsetLeft) / outbox.offsetWidth * 100;
            if (x >= 0 && x <= 100) {
                slide.style.width = x + '%';
            }
        }
        document.addEventListener('mouseup', function (e) {
            this.removeEventListener('mousemove', move);
        });
    });
}
//音量键
function volume() {
    let audio = document.querySelector('audio');
    let info = document.querySelector('.info');
    let volume = info.querySelector('.volume');
    let box = info.querySelector('.box');
    let outbox = volume.querySelector('.outbox');
    let slide = outbox.querySelector('.slide');
    let slide_btn = slide.querySelector('span');
    audio.volume = 0.3;
    slide.style.height = '60%';0
    //点击出现
    volume.addEventListener('click', function () {
        if (box.style.display == 'block') {
            box.style.display = 'none';
        } else {
            box.style.display = 'block';
        }
    });
    //滑动
    slide_btn.addEventListener('mousedown', function (e) {
        let y = e.pageY;
        let h = slide.offsetHeight;
        document.addEventListener('mousemove', move);
        function move(e) {
            let len = (y - e.pageY + h) / outbox.offsetHeight * 100;
            if (len >= 0 && len <= 100) {
                slide.style.height = len + '%';
                audio.volume = len / 200;
            }
        }
        document.addEventListener('mouseup', function (e) {
            this.removeEventListener('mousemove', move);
        });
    });
    //点击
    outbox.addEventListener('click', function (e) {
        let y = window.innerHeight - e.clientY - info.offsetHeight - 4;
        if (y >= 0 && y <= outbox.offsetHeight) {
            slide.style.height = y + 'px';
            audio.volume = y / outbox.offsetHeight / 2;
        }
        e.stopPropagation();
    });
}
// 点击上一首下一首切歌
function changeMusic(audioList, num1, num2) {
    let length = arguments.length;
    let info = document.querySelector('.info');
    let btns = info.querySelector('.btns');
    btns.children[2].onclick = function () {
        if (length == 3) {
            num2++;
            if (num2 >= 10) {
                num2 -= 10;
                num1++;
            }
            startPlay(audioList, num1, num2);
        }
        if (length == 2) {
            num1++;
            startPlay(audioList, num1);
        }
    }
    btns.children[0].onclick = function () {
        if (length == 3) {
            num2--;
            if (num2 < 0) {
                num2 += 10;
                num1--;
            }
            startPlay(audioList, num1, num2);
        }
        if (length == 2) {
            num1--;
            startPlay(audioList, num1);
        }
    }
}
//点击图片放歌
function startPlay(audioList, num1, num2) {
    let audio = document.querySelector('audio');
    let audioInf = {};
    if (arguments.length == 3) {
        audioInf = audioList[num1][num2];
        if (audioInf == undefined) {
            audioInf = audioList[0][0];
            num1 = 0;
            num2 = 0;
        }
        changeMusic(audioList, num1, num2);
    }
    if (arguments.length == 2) {
        audioInf = audioList[num1];
        if (audioInf == undefined) {
            audioInf = audioList[0];
            num1 = 0;
        }
        changeMusic(audioList, num1);
    }
    let info = document.querySelector('.info');
    let play = info.querySelector('.play')
    let btns = info.querySelector('.btns');
    let pic = play.querySelector('img');
    let songname = play.querySelector('.songsname');
    let ran = info.querySelector('.otherbtns').children[1];
    let author = play.querySelector('.author');
    let massage = document.querySelector('.massage-container').querySelector('.massage');
    //播放按钮变化
    if (sessionStorage.getItem('flag') == 'true') {
        audio.src = audioInf.audioSrc;
        btns.children[1].click();
        setTimeout(function () {
            btns.children[1].click();
        }, 1000);
    } else {
        audio.src = audioInf.audioSrc;
        btns.children[1].click();
    }
    pic.src = audioInf.picUrl;
    songname.innerHTML = audioInf.songname;
    author.innerHTML = audioInf.author;
    pic.addEventListener('click', function () {
        let id = audioInf.audioSrc.substr(46);
        let len = id.length - 4;
        id = id.substr(0, len);
        window.location.href = 'lyric.html?name=' + audioInf.songname + '&author=' + audioInf.author + '&picUrl=' + audioInf.picUrl + '&id=' + id;
    })
    ran.addEventListener('click', function () {
        if (this.style.backgroundPosition == "-3px -344px") {
            this.style.backgroundPosition = '-66px -248px';
        } else {
            this.style.backgroundPosition = '-3px -344px';
        }
    })
    audio.addEventListener('ended', function () {
        if (ran.style.backgroundPosition == "-66px -248px") {
            let num = Math.floor(Math.random() * audioList.length);
            if (num != audio.length) {
                startPlay(audioList, num)
            } else {
                btns.children[2].click();
            }
        } else {
            btns.children[2].click();
        }
    })
    setTimeout(function () {
        if (audio.readyState != 4) {
            massage.querySelector('span').innerHTML = '歌曲无法播放，自动播放下一首';
            document.querySelector('.massage-container').style.display = 'flex';
            massage.className = 'massage move-in';
            btns.children[2].click();
            setTimeout(function () {
                massage[0].className = 'massage move-out';
            }, 3000)
            massage.querySelector('.close').onclick = function () {
                this.parentNode.className = 'massage move-out';
            }
        } else {
            document.querySelector('.massage-container').style.display = 'none';
        }
    }, 3500)
}
function logout() {
    let login = document.querySelector('.header-top').querySelector('.login');
    let avatar = login.querySelector('.avatar');
    let logout = avatar.querySelector('.logout');
    let a = logout.querySelector('a');
    a.addEventListener('click', function () {
        if (sessionStorage.getItem('phone')) {
            sessionStorage.removeItem('phone');
            sessionStorage.removeItem('password');
            sessionStorage.removeItem('uid');
            location.reload(true);
        }
    })
}
window.addEventListener('load', function () {
    volume();
    login();
    progressbar();
    playPause();
    logout();
})


