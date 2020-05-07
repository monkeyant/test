# jquery

jquery是一个js库，里面是对我们常用的函数进行封装，使用起来更加方便。

### 1.dom对象jQuery对象相互转化

以dom获取的对象，转化成jQuery只需要转化$()  ,括号中加上dom对象

```javascript
var div = document.querySelector('div');
$(div)
```

jQuery对象转化成dom对象,以数组方式转化或者使用get

```javascript
$('div')[0]
$('div').get(0)
```

### 2.jQuery对象中常用的api

选择器  $() 括号中加上css样式

```javascript
$('.main') //选出类名是main的元素
```

筛选选择器

```javascript
$('li:first')  //筛选出第一个
$('li:last') //筛选出最后一个
$('li:eq(index)')//筛选出第index个
$('li:odd')//筛选出奇数个
$('li:even')//筛选出偶数个
//和css筛选方法都是相同的
```

筛选方法

```javascript
$('li').parent(); //返回父级
$('ul').children('li'); //返回ul的最近一级的儿子
$('ul').find('li'); //相当于$('ul li'),后代选择器
$('.first').siblings('li'); //查找兄弟节点，不包括自己本身
$('.first').nextAll(); //查找当前元素之后所有的同辈元素
$('.last').prevAll(); //查找当前元素之前所有的同辈元素
$('div').hasClass('protected') //检查当前元素是否含有某个特定的类，返回布尔值
$('li').eq(index) 相当于$('li:eq(index)')
```

### 3.jquery的隐式迭代

想要多选一的效果，需要用到排他思想，但是jquery对原生js封装，使我们可以快速实现这种效果。

```javascript
$(this).css('color','red');
$(this).css.siblings().css('color','');
//这里的sibling会逐个遍历
```

### 4.jquery的入口函数

```javascript
$(function(){})//相当于原生js中的window.onload = function(){}
```

### 5jquery中获取当前元素的索引号：

```javascript
$(this).index()
```

### 6jquery中的css方法

1.参数只写属性名，则是返回属性值

```javascript
$(this).css('color');
```

2.参数是属性名，属性值，逗号分隔，是设置一组样式，属性必须加引号，属性值如果是数字可以不用加单位和引号

```javascript
$(this).css('color','red')
```

3.参数可以是对象形式，方便设置多组样式。属性名和属性值用冒号隔开，属性可以不用加引号

```javascript
$(this).css({'color':'white','font-size':'20px'})
```



### 7jquery中的链式编程

```javascript
$('this').css('color','red').sibling().css(';color','');
```

这样可以让代码看起来更加简洁

### 8jquery中设置类样式

```javascript
$('div').addClass('current');//添加类
$('div').removeClass('current');//移除类
$('div').toggleClass('current');//切换类
```

### 9jquery中有很多封装的动画效果，常见的有：

显示隐藏

```
show()
hide()
toggle
```

滑动

```
slideDown（）
slideUp（）
slideToggle（）
```

淡入淡出

```
fadeIn（）
fadeOut（）
fadeToggle（）、
fadeTo（）
```

上面的函数的参数基本相同，以show()为例

show(speed,easing,fn)

1.speed 用于表示动画的快慢，可选值有

​	slow’：慢

​	fast：快

​	normal： 正常

​	也可以直接写数字用于表示动画时长的毫秒值

2.easing

​	用于指定切换效果，默认是’swing‘，也用’linear‘

3fn

​	回调函数

fadeTo()函数属性有些不同

fadeTo（opacity，spend，earing，fn）

opacity：设置透明度，这个属性一定要写

speed：设置速度，同样要写

其余同上

### 10自定义动画

```javascript
annimate(params,speed,earing,fn)
//params是想要更改的样式属性，以对象的形式传递，必须写。属性名可以不用带引号，如果是符合属性则需要采用驼峰命名法。
```

### 11获取元素的属性

```javascript
element.prop()
element.attr()
element.data()
//括号中都是写的属性名，如果要修改改属性，可以在属性名后面加上逗号和属性值，如
$('a').prop('href')
$('a').prop('href','www.baidu.com')
//prop获取的是元素的固有属性
$('li:first').attr('index')
$('li:first').attr('index','1')
//attr获取的是元素的自定义属性
//data的属性是存放在内存中的，在dom中是看不到的
```

### 12对元素内容进行修改

```javascript
text()
html() //获取元素的内容
text('内容')
html('内容') //设置元素的内容
$('input').val('内容') //修改表单内容
$('div').parents('.main') //选出div的祖先级元素类名是div的
price = price.toFixed(2) //保留两位小数
```

### 13遍历元素

如果想对元素进行不同操作的话，不能使用隐式迭代，需要逐个遍历。

```javascript
$('div').each(function(index,domEle){xxx;})
//里面的回调函数有两个参数，index是每一个元素的索引号，demEle是每个DOM元素的对象，不是jQuery对象
$.each(object,function(index,element){xxx;})
//$.each可以遍历对象或者数组
```

### 14元素操作

```javascript
var li = $('<li></li>')//创建li
$('ul').append(li) //内部添加到内容最后面
$('ul').prepend(li) //内部添加到内容最前面
var div = $('<div></div>')
$('test').after(div)//外部添加到内容最后面
$('test').before(div)//外部添加到内容最前面
//删除元素
$('ul').remove()//可以删除匹配的元素
$('ul').empty（）//可以删除匹配元素的子节点
$('ul').html('')//删除匹配元素的子节点
```



### 15事件注册

```javascript
$('div').click(function(){}) //单个事件注册
//事件注册on事件
element.on(events,[selector],fn)
//events：一个或多个用空格分隔的事件类型，如‘click’或者‘keydown’
//selector：元素的子元素选择器
//fn：回调函数 即绑定在元素身上的监听函数
$('div').on({
    mouseenter:function(){},
    click:function(){}
})
//如果事件处理程序是相同的
$('div').on('mouseenter mouseleave',function(){})
//事件委托
$('ul').on('click','li',function(){})
//on可以给动态创建的元素绑定事件
$('ol').on('click','li',function(){})
var li = $('<li></li>')
$('ol').append(li)
```

### 16事件解绑

```javascript
$('div').off() //解绑div上所有的事件
$('div').off('click') //解绑div身上的点击事件
$('ul').off('click','li');//解绑事件委托
//one绑定的事件只能触发一次
$('div').one('click',function(){}).
```

### 17自动触发事件

```javascript
$('div').on('click',function(){})
$('div').click()//自动调用点击事件
$('div').trigger('click') //同上
$('div').triggerHandler('click')//不会触发元素的默认行为
```

### 18事件对象

```javascript
$('div').on('click',function(e){
    e.stopPropagation() //阻止冒泡，和原生相同
    e.preventDefault() //阻止默认行为
})
```

### 19其他方法

```javascript
//拷贝对象
$.extend([deep],target,object1,[objectN])
//deep：如果是true是深拷贝，默认是false 浅拷贝
//target： 要拷贝的目标对象
// object1： 待拷贝到第一个对象的对象，把object1拷贝给target
var targetObj = {};
var obj = {
    id: 1,
    name: andy
}
$.extend(targetObj,obj)
```

