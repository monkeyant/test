let xhr = new XMLHttpRequest()
// http.withCredentials = true 部分请求或许需要该配置，具体请先查看文档
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(JSON.parse(xhr.responseText))
    }
}
xhr.open("GET", `http://musicapi.leanapp.cn/playlist/detail?id=620195682`, true);
xhr.send();
let http = new XMLHttpRequest()
// http.withCredentials = true 部分请求或许需要该配置，具体请先查看文档
http.onreadystatechange = function () {
    if (http.readyState === 4 && http.status === 200) {
        console.log(JSON.parse(http.responseText))
    }
    console.log(this.responseText)
    console.log(http.status)
}
http.open("GET", `http://musicapi.leanapp.cn/user/subcount`, true);
http.send();