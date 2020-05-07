#  ajax

ajax可以说是这段期间学的最大的知识点了，其实说起来也只有几行代码，下面是封装的ajax

```javascript
//options是传入的对象。
function ajax (options){
    var defaults = {
        type: 'get',//请求类型
        url: '', //请求地址
        data: {}, //请求数据
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },//请求头
        async: true, //是否是异步调用 
        success: function() {}, //成功时返回的函数
        error: function() {} //失败时返回的函数
    }
    //defaults是默认的属性值
    Object.assign(defaults,options);
    //Object.assign是对象属性替换，调用该方法的目的是如果用户没有传入相关的属性值，那么就用默认的属性值代替，由于该方法时自动覆盖defaults相关的属性，所以不需要在进行赋值
    var xhr = new XMLHttpRequest();
    var params = '';
    for (var attr in defaults.data){
        params += attr + '=' + defaults.data[attr] + '&';
    }
    //遍历defaults对象的data对象，将params组装成“属性名=属性值&……”的形式。
    params = params.substr(0,params.length - 1);
   //最后params会多出一个&，删去
    if(defaults.type == 'get'){
        defaults.url = defaults.url + '?' + params;
    }
    //get请求，直接将params加上？拼接在url后面
    xhr.open(defaults.type,defaults.url,defaults.async);
    if (defaults.type == 'post'){
        var contentType = defaults.header['Content-Type'];
        xhr.setRequestHeader('Content-Type',contentType);
        if(contentType == 'application/json'){
            xhr.send(JSON.stringify(defaults.data))
        }else{
            xhr.send(params);
        }
    }else{
        xhr.send();
    }
    //如果是post请求，需要设置请求头的'content-Type'属性，即请求参数传递的形式
    //如果是“属性名=属性值&……”的形式，'content-Type'属性是'application/x-www-form-urlencoded'
    //如果是以json形式传递的参数，’content-Type‘属性是'application/json'而且在进行参数传递时就不需要拼接，直接将json数据转化成字符串，放在send中
    xhr.onload = function() {
        var contentType = xhr.getResponseHeader('Content-Type');
        var responseText = xhr.responseText;
        if (contentType.includes('application/json')) {
            responseText = JSON.parse(responseText);
        }
        if (xhr.status == 200){
            defaults.success(responseText,xhr);
        }else{
            defaults.error(responseText,xhr);
        }        
    }
}
//数据返回时大多数时候会返回json数据类型，但是是以字符串形式传递的，此时我们需要将传递过来的字符串转化成json数据类型，方法是JSON.parse()
```

但我们还可以用jQuery给我们封装好的ajax,例子如下

```javascript
$.ajax({
        url: "/Home/PostAlbum",
        type: "POST",
        dataType: "json",
        //dataType设置的是返回数据的格式
     	contentType: "application/json"
     	//这里表述传入参数的格式
        data: { AlbumName: "shanghai", Entered: "5/9/2013" },
        success: function (result) {
            alert(result);
        },
        error: function (xhr, status, p3, p4) {
            var err = "Error " + " " + status + " " + p3;
            if (xhr.responseText && xhr.responseText[0] == "{")
                err = JSON.parse(xhr.responseText).message;
            alert(err);
        }
    });
//success，error都是回调函数，还有其他的回调函数如complete，无论成功失败都执行
```

jQuery封装的ajax还有其他众多参数，难以一一列举。但是使用方法都是差不多