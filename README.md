### coolSlider

#### usage
```js
coolSlider(el, opts)
```
`opts`参数有：
* data 数据
* activeIndex   首屏展示的页面
* loop  是否循环轮播，默认为false
* duration    动画切换时间
* interval   每隔多少秒轮播一次

支持的事件有 slideend ,slidestart

#### example
```js
let list = [
	{
		content: "<div style='height: 100%;background:red;'></div>"
	},
	{
		content: "<div style='height: 100%;background:blue;'></div>"
	},
	{
		content: "<div style='height: 100%;background:pink;'></div>"
	},
	{
		content: "<div style='height: 100%;background:yellow;'></div>"
	}
]
let S = new coolSlider(el, {
	data: list,
	activeIndex: 2,
	loop: 1,
	duration: 400,
	interval: 5200
})
S.on("slidestart", function () {
	console.log("start")
})
S.on("slideend", function (index) {
	console.log(index)
	console.log("end")
})
```

