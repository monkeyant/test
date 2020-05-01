if (sessionStorage.getItem('flag')) {
    sessionStorage.removeItem('flag');
}
sessionStorage.setItem('flag', 'false');
// 点击暂停播放按钮
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
            audio.oncanplay = function () {
                audio.play();
            }
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
    let audio = document.querySelector('audio');
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
        changeMusic(audioList, num1, num2);
    }
    if (arguments.length == 2) {
        audioInf = audioList[num1];
        changeMusic(audioList, num1);
    }
    let info = document.querySelector('.info');
    let play = info.querySelector('.play')
    let btns = info.querySelector('.btns');
    let pic = play.querySelector('img');
    let songname = play.querySelector('.songsname');
    let author = play.querySelector('.author');
    //播放按钮变化
    if (sessionStorage.getItem('flag') == 'true') {
        btns.children[1].click();
        audio.src = audioInf.audioSrc;
        setTimeout(function () {
            btns.children[1].click();
        }, 200);
    } else {
        audio.src = audioInf.audioSrc;
        btns.children[1].click();
    }
    pic.src = audioInf.picUrl;
    songname.innerHTML = audioInf.songname;
    author.innerHTML = audioInf.author;
    audio.volume = 0.3;
    audio.addEventListener('ended', function () {
        btns.children[2].click();
    })
}

//退出登录
// let logout = avatar.querySelector('.logout');
// let a = logout.querySelector('a');
// a.addEventListener('click', function () {
//     
// ajax({
//     type: 'get',
//     url: 'http://musicapi.leanapp.cn/logout',
//     success: function (responseText, xhr) {
//         avatar.style.display = 'none';
//         img.src = '';
//         login_btn.style.display = 'block';
//         console.log(responseText);
//     },
//     error: function (responseText, xhr) {
//         console.log(responseText);
//     }
// })
// })
window.addEventListener('load', function () {
    volume();
    progressbar();
    playPause();
})


