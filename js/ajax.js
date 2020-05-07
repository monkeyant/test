function ajax (options){
    var defaults = {
        type: 'get',
        url: '',
        data: {},
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        async: true,
        withCredentials: false,
        success: function() {},
        error: function() {}
    }
    Object.assign(defaults,options);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = defaults.withCredentials;
    var params = '';
    for (var attr in defaults.data){
        params += attr + '=' + defaults.data[attr] + '&';
    }
    params = params.substr(0,params.length - 1);
    if(defaults.type == 'get'){
        defaults.url = defaults.url + '?' + params;
    }
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