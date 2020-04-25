window.addEventListener('load', function () {
    // 轮播图
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
    //登录界面弹出
    function login() {
        let login = document.querySelector('.header-top').querySelector('.login');
        let login_btn = login.children[0];
        let contain = login.querySelector('.contain');
        let bg = login.querySelector('.bg');
        let close = contain.querySelector('.close');
        let body = document.getElementsByTagName('body')[0];
        login_btn.addEventListener('click',function() {
            contain.style.display = 'block';
            bg.style.display = 'block';
            body.style.overflow = 'hidden';
        });
        close.addEventListener('click',function() {
            contain.style.display = 'none';
            bg.style.display = 'none';
            body.style.overflow = 'scroll';
        })
    }
    login();
    //底部歌曲信息
    function info(){
        let info = document.querySelector('.info');
        let btns = info.querySelector('.btns');
        let play = info.querySelector('.play');
        let volume = info.querySelector('.volume');
        let lock = info.querySelector('.lock');
        let flag = 1;
        btns.children[1].addEventListener('click',function (){
            if (flag){
                this.style.backgroundPosition = "-40px -204px";
                flag = 0;
            }else{
                this.style.backgroundPosition = "-40px -165px";
                flag = 1;
            }
        });
        let box = info.querySelector('.box');
        let outbox = [];
        outbox[0] = play.querySelector('.outbox');
        outbox[1] = volume.querySelector('.outbox');
        outbox[0].addEventListener('click',function(e) {
            let x = (e.pageX - this.offsetLeft) / this.offsetWidth;
            this.children[0].style.width = x * 100 + '%';
        });
        outbox[1].addEventListener('click',function(e) {
            console.log(box.offsetTop);
            console.log(e.pageY)
        });
    }
    info();
})