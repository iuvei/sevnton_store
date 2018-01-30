var manyPictures = document.getElementById('manyPictures');
var imgs = manyPictures.getElementsByClassName('imgs');//获取到底部6张小图片
var small = document.getElementById('small');
var big = document.getElementById('big');
var areaDiv = document.getElementById('area');
var smallImg = document.getElementById('smallimg'); 
var bigImg = document.getElementById('bigimg');
var conD = document.getElementById('con_drawing');
var storeName = document.getElementById('hailanHome');
var data=[1,2,3,4,5];
var data1 = [];
	for (var i = 0;i < data.length;i++) {
	var img = '<img class="imgs" src="img/seach/SS'+data[i]+'.png"/>';
	data1.push(img);
	$('#move').html(data1)
}


//为轮播图添加鼠标移入事件
for (var i = 0;i < imgs.length;i++) {
	imgs[i].onmouseenter = function  () {
		for (var j = 1;j <imgs.length+1;j++) {
			if (this == imgs[j-1]) {
				bigImg.src = 'img/seach/SS' + j + '.png';
				smallImg.src = 'img/seach/SS' + j + '.png';
			}
		}
	}
}
//为大图添加鼠标移入事件
small.onmouseenter = function  () {
	areaDiv.style.display = 'block';
	big.style.display = 'block';
}
//鼠标移出事件
small.onmouseleave = function (){
	areaDiv.style.display = 'none';
	big.style.display = 'none';
}

var content = document.getElementById("content");
var con = document.getElementById('con_wrap');
var con_drawing = document.getElementById("con_drawing");
//添加鼠标移动事件
small.onmousemove = function  (e) {
	
	var event1 = window.event || e;
	
	var mouseX = event1.clientX - $("#small").offset().left - $("#area").width() / 2;
	var mouseY = event1.clientY - $("#small").offset().top + $(document).scrollTop() - $("#area").height() / 2;
	
	var maxX = small.offsetWidth - areaDiv.offsetWidth;
	var maxY = small.offsetHeight - areaDiv.offsetHeight;
	if (mouseX < 0) {
		mouseX = 0;
	}
	if (mouseX > maxX) {
		mouseX = maxX;
	}
	if (mouseY < 0) {
		mouseY = 0;
	}
	if (mouseY > maxY) {
		mouseY = maxY;
	}
	
	//修改areaDiv的位置,随鼠标移动
	areaDiv.style.left = mouseX + 'px';
	areaDiv.style.top = mouseY + 'px';
	
	
//	//修改大图的移动
	big.scrollLeft = (bigImg.offsetWidth - big.clientWidth) * mouseX/maxX;
	big.scrollTop = (bigImg.offsetHeight - big.clientHeight) * mouseY/maxY;
}