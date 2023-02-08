function selected(option) {
	var defaultSettings = {
		defaultSettings:{
			deSelectedStyle: "border: 2px solid green;background-color: #D6DFF7;",
			deBoxStyle: "position:absolute;width:0px;height:0px;border: 1px dashed rgb(95,174,227);background-color: rgb(95,174,227,0.2);"
		}
	};
	var disposition = {
		// 是否需要(允许)处理鼠标的移动事件,默认识不处理
		select: false,
		lis: document.querySelectorAll(option.dom),
		parent: document.querySelector(option.parentDom),
		// 定义移动元素div
		rect: null,
		// 记录鼠标按下时的坐标
		downX: 0,
		downY: 0,
		//选中元素
		selectedDom: [],
		// 记录鼠标抬起时候的坐标
		mouseX2: this.downX,
		mouseY2: this.downY,
	}
	var events = {
		evn: {
			fun1: null,//回调函数
			fun2: null,//回调函数
		}
	}
	if (option !== undefined) {
		this.pragram = Object.assign({}, option, defaultSettings, disposition, events)
	}
	let _this = this
	_this.pragram.parent.addEventListener('mousedown', function (event) {
		if(event.button == 0){
			_this.down(_this.pragram, event)
		}
	});
	_this.pragram.parent.addEventListener('mouseup', function (event) {
		if(event.button == 0){
			_this.up(_this.pragram, event)
		}
	});
	_this.pragram.parent.addEventListener('mousemove', function (event) {
		_this.move(_this.pragram, event)
	});
	_this.pragram.parent.addEventListener('contextmenu',function (){
		_this.cancel(_this.pragram)
	})
}
var result
selected.prototype.move = function (option, event) {
	if (option.select) {
		// 取得鼠标移动时的坐标位置
		option.mouseX2 = event.clientX;
		option.mouseY2 = event.clientY;
		// 显示框选元素
		if (option.rect.style.display == "none") {
			option.rect.style.display = "";
		}
		option.rect.style.left = Math.min(option.mouseX2, option.downX) + "px";
		option.rect.style.top = Math.min(option.mouseY2, option.downY) + "px";
		option.rect.style.width = Math.abs(option.mouseX2 - option.downX) + "px";
		option.rect.style.height = Math.abs(option.mouseY2 - option.downY) + "px";
		// 判断框选位置
		if (option.mouseX2 < option.downX && option.mouseY2 < option.downY) {
			option.rect.style.left = option.mouseX2;
			option.rect.style.top = option.mouseY2;
		}
		// 判断框选位置
		if (option.mouseX2 > option.downX && option.mouseY2 < option.downY) {
			option.rect.style.left = option.downX;
			option.rect.style.top = option.mouseY2;
		}
		// 判断框选位置
		if (option.mouseX2 < option.downX && option.mouseY2 > option.downY) {
			option.rect.style.left = option.mouseX2;
			option.rect.style.top = option.downY;
		}
		// 判断框选位置
		if (option.mouseX2 > option.downX && option.mouseY2 > option.downY) {
			option.rect.style.left = option.downX;
			option.rect.style.top = option.downY;
		}

	}
	// 禁止鼠标右键
	// if (window.Event)
	// 	document.captureEvents(Event.MOUSEUP);
	// function nocontextmenu() {
	// 	event.cancelBubble = true
	// 	event.returnValue = false;
	// 	return false;
	// }
	// // 禁止鼠标右键
	// document.oncontextmenu = nocontextmenu; // for IE5+
	// document.onmousedown = norightclick; // for all others
}
selected.prototype.down = function (option, event) {
	// 鼠标按下时才允许处理鼠标的移动事件
	option.select = true;
	option.rect = document.createElement("div");
	// 框选div 样式
	if (option.selectedStyle === undefined) {
		option.rect.style.cssText = option.defaultSettings.deBoxStyle;
	} else {
		option.rect.style = option.boxStyle;
		var sty1 = Object.keys(option.boxStyle);
		var sty2 = Object.values(option.boxStyle);
		for (var i = 0; i < sty1.length; i++) {
			option.rect.style[sty1[i]] = sty2[i]
		}
		option.rect.style.position = "relative";
		option.rect.style.zIndex = "100";
		option.rect.style.width = "0px";
		option.rect.style.height = "0px";
	}
	for (let i = 0; i < option.lis.length; i++) {
		option.lis[i].style.userSelect = 'none'
	}
	option.rect.id = "kxBox";
	// 添加到父级下
	option.parent.appendChild(option.rect);

	// 取得鼠标按下时的坐标位置
	option.downX = event.x || event.clientX;
	option.downY = event.y || event.clientY;
	option.rect.style.left = option.downX + "px";
	option.rect.style.top = option.downY + "px";
	//设置你要画的矩形框的起点位置
	option.rect.style.left = option.downX;
	option.rect.style.top = option.downY;
}
selected.prototype.up = function (option, event) {
	var _this = this;
	option.selectedDom = []
	for (let i = 0; i < option.lis.length; i++) {
		//将移动的div的四个点和和div元素的四个点进行比较
		if (
				//判断div元素 右边框的位置大于移动div的左起始点
				option.rect.offsetLeft < (option.lis[i].offsetLeft + option.lis[i].offsetWidth) &&
				//判断div元素 下边框的位置大于移动div的上起始点
				(option.lis[i].offsetTop + option.lis[i].offsetHeight) > option.rect.offsetTop
				&&
				// 判断div元素左边框的位置小于移动div的右起始点
				option.rect.offsetLeft + option.rect.offsetWidth > option.lis[i].offsetLeft &&
				// 判断div元素上边框的位置小于移动div的下起始点
				option.rect.offsetTop + option.rect.offsetHeight > option.lis[i].offsetTop
		) {
			//将已选中的样式改变
			if (option.lis[i].className.indexOf('seled') === -1) {
				option.lis[i].classList.add('seled');
				if (option.selectedStyle === undefined) {
					option.lis[i].style.cssText = option.defaultSettings.deSelectedStyle
				} else {
					var sty1 = Object.keys(option.selectedStyle);
					var sty2 = Object.values(option.selectedStyle);
					for (var j = 0; j < sty1.length; j++) {
						option.lis[i].style[sty1[j]] = sty2[j]
					}
				}
			}
		} else {
			//如果没有选中则清除样式
			if (option.lis[i].className.indexOf('seled') !== -1) {
				option.lis[i].classList.remove('seled');
				option.lis[i].style.cssText = ""
			}
		}
	}
	for (let i = 0; i < option.lis.length; i++) {
		if (option.lis[i].className.indexOf('seled') !== -1) {
			option.selectedDom.push(option.lis[i])
		}
	}
	//隐藏图层
	_this.cancel(option)
	//鼠标抬起,就不允许在处理鼠标移动事件
	option.select = false;
}
selected.prototype.cancel = function (option){
	if (option.rect) {
		var kxBox = document.getElementById('kxBox')
		if(kxBox){
			option.parent.removeChild(kxBox);
		}
	}
	//鼠标抬起,就不允许在处理鼠标移动事件
	option.select = false;
}
