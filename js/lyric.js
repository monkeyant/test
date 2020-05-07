window.addEventListener('load', function () {
    let main = document.querySelector('.main');
    let leftModule = document.querySelector('.leftModule');
    let rightModule = main.querySelector('.rightModule');
    //浏览器窗口高度变化，个人收藏页左高度发生变化
    function changehigh() {
        let wrapper = main.querySelector('.wrapper');
        leftModule.style.height = this.innerHeight - 100 + 'px';
        wrapper.style.height = this.innerHeight + 'px';
        window.onresize = function () {
            leftModule.style.height = this.innerHeight + 'px';
            wrapper.style.height = this.innerHeight + 'px';
        }
    }
    changehigh();
    let songs = [];
    let id = 0;
    function getsong() {
        let arr = [];
        let params = decodeURIComponent(location.search.substr(1));
        arr = params.split('&');
        songs[0] = {
            songname: arr[0].split('=')[1],
            author: arr[1].split('=')[1],
            picUrl: arr[2].substr(7),
            audioSrc: 'https://music.163.com/song/media/outer/url?id=' + arr[3].split('=')[1] + '.mp3'
        }
        id = arr[3].split('=')[1];
        startPlay(songs, 0);
        let em = rightModule.querySelector('.column').querySelector('h3').querySelector('em');
        em.innerHTML = songs[0].songname;
        leftModule.querySelector('.img').querySelector('img').src = songs[0].picUrl;
        rightModule.querySelector('h4').children[0].children[1].innerHTML = songs[0].author;
    }
    getsong();
    //获取歌词
    function getlyric(id) {
        let audio = document.querySelector('audio');
        let data = 'id=' + id;
        $.ajax({
            type: 'post',
            url: 'http://music.163.com/api/song/media',
            dataType: 'jsonp',
            data: data,
            success: function (responseText) {
                let ul = rightModule.querySelector('.lyric')
                let li = rightModule.querySelector('.lyric').querySelector('li');
                let arr = responseText.lyric.split('\n');
                for (let i = 0; i < arr.length; i++) {
                    let time = arr[i].substr(arr[i].indexOf('[') + 1, arr[i].indexOf(']') - 1);
                    let word = arr[i].substr(arr[i].indexOf(']') + 1);
                    arr[i] = {
                        time: time,
                        word: word
                    }
                }
                for (let i = 1; i < arr.length; i++) {
                    let temp = li.cloneNode(true);
                    ul.append(temp);
                }
                let lis = ul.querySelectorAll('li');
                for (let i = 0; i < lis.length; i++) {
                    lis[i].innerHTML = arr[i].word;
                    let s = parseInt(arr[i].time.split(':')[0]) * 60 + parseFloat(arr[i].time.split(':')[1]);
                    lis[i].setAttribute('time', s);
                }
                let timer = setInterval(function () {
                    for (let i = 0; i < lis.length; i++) {
                        if (lis[i].getAttribute('time') > audio.currentTime) {
                            for (let i = 0; i < lis.length; i++) {
                                lis[i].className = '';
                            }
                            if (i - 1 >= 0) {
                                lis[i - 1].className = 'current';
                                ul.scrollTop = lis[i - 1].offsetTop - 150;
                            }
                            break;
                        }
                        for (let i = 0; i < lis.length; i++) {
                            lis[i].className = '';
                        }
                        lis[lis.length - 1].className = 'current';
                        ul.scrollTop = lis[lis.length - 1].offsetTop - 150;
                    }
                }, 500)
            }
        })
    }
    getlyric(id);
    //图片旋转
    function spin() {
        let audio = document.querySelector('audio');
        let img = leftModule.querySelector('.img');
        let info = document.querySelector('.info');
        let btns = info.querySelector('.btns');
        btns.children[1].addEventListener('click', function () {
            if (audio.paused == true) {
                img.className = 'img';
            } else {
                img.className = 'img spin';
            }
        })
    }
    spin();
})