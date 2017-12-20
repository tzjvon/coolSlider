import util from "./../lib/Utils.js"

import support_events, {evnets_funcs} from "./../lib/support_events.js"

import "./../sass/index.scss"
import {trf_x} from "./../lib/propto.js"
// console.log(util.BROWSER_PREFIX)
let trs = util.IU(util.BROWSER_PREFIX) + util.IU("transition")



let SS = function(el, opts) {
	if (!util.isDom(el)) {throw new Error("SS first param must be a HTMLElement") }

	this.opts = {
		loop: 0
	}
	util.extend(this.opts, opts)

	if (!this.opts.data && this.opts.data.length < 2) {throw new Error("SS data param must can not empty and must be is string") }

	this.ul = document.createElement("ul")
	el.appendChild(this.ul)
	this.activeIndex = this.opts.activeIndex || 1
	this.el = el
	this.lis = []
	this.insertData()
	this.init()
	this._bindHandler()
	this.start_x = 0
	this.start_y = 0


	this.lock = false
	this.isTraning = false
	this.exec_once = 0

	this.evnets_funcs = evnets_funcs

}

let propto = {
	version: "0.0.1",
	handleEvent: function (e) {
		switch (e.type) {
			case "touchstart":
				this._start(e)
				break;
			case "touchmove":
				this._move(e)
				break;
			case "touchend":
			case "touchcancel":
				this._end(e)
				break;
		}
	},
	_bindHandler: function () {
		util.addEvent(this.el, "touchstart", this, false)
		util.addEvent(this.el, "touchmove", this, false)
		util.addEvent(this.el, "touchend", this, false)
		util.addEvent(this.el, "touchcancel", this, false)
	},
	insertData: function () {
		util.addClass(this.ul, "ss-outer")
		this.opts.data.forEach(item => {
			let li = document.createElement("li")
			util.addClass(li, "ss-html")
			li.innerHTML = item.content
			this.lis.push(li)
			this.ul.appendChild(li)
		})
	},
	init: function () {
		this.grid_distance = this.ul.getBoundingClientRect().width

		var {prevIndex, nextIndex} = this.computIndex()

		this.prevEl = this.lis[prevIndex]
		this.activeEl = this.lis[this.activeIndex]
		this.nextEl = this.lis[nextIndex]

		util.addClass(this.prevEl, "ss-prev")
		util.addClass(this.activeEl, "ss-active")
		util.addClass(this.nextEl, "ss-next")

		this.reStyle()

	},

	_start: function (e) {
		// e.preventDefault()
		// if (this.isTraning) {return}
		this.exec_once =0
		this.lock = false
		this.start_x = e.touches[0].pageX
		this.start_y = e.touches[0].pageY

		this.prevEl.style[trs] = ""
		this.activeEl.style[trs] = ""
		this.nextEl.style[trs] = ""
	},
	_move: function (e) {
		if (this.lock || this.isTraning) {return}

		let m_x = e.touches[0].pageX,
			m_y = e.touches[0].pageY,
			m_dis_x = m_x - this.start_x,
			m_dis_y = m_y - this.start_y

		if (this.exec_once === 0) {
			if (Math.abs(m_dis_y) > Math.abs(m_dis_x)) {
				this.lock = true
				return e.preventDefault()
			}
		}
		this.exec_once++

		e.preventDefault()

		trf_x(this.prevEl , m_dis_x - this.grid_distance)
		trf_x(this.activeEl, m_dis_x)
		trf_x(this.nextEl, this.grid_distance + m_dis_x)

	},
	_end: function (e) {
			// console.log("touchend")
		if (this.lock || this.isTraning) {return}

		let end_x = e.changedTouches[0].pageX,
			end_dis_x = end_x - this.start_x

		if (Math.abs(end_dis_x) < 30) {return this.reStyle()}

		this.fire("slidestart")
		if (end_dis_x>0) {
			this.slidePrev()
		}else if (end_dis_x < 0) {
			this.slideNext()
		}

		this.lock = false
	},
	slideTo: function (index) {
		let prevEl , activeEl , nextEl

		util.removeClass(this.prevEl, "ss-prev")
		util.removeClass(this.activeEl, "ss-active")
		util.removeClass(this.nextEl, "ss-next")
		this.activeIndex = index

		let {prevIndex, nextIndex} = this.computIndex()

		prevEl = this.lis[prevIndex]
		nextEl = this.lis[nextIndex]
		activeEl = this.lis[this.activeIndex]

		util.addClass(prevEl, "ss-prev")
		util.addClass(activeEl, "ss-active")
		util.addClass(nextEl, "ss-next")

		this.prevEl = prevEl
		this.nextEl = nextEl
		this.activeEl = activeEl

		this.reStyle()

		// this.fire("slideChanged")
	},
	slidePrev: function () {
		this.isTraning = true
		trf_x(this.prevEl,  0)
		trf_x(this.activeEl, this.grid_distance * 1)
		trf_x(this.nextEl, this.grid_distance * 2)

		this.prevEl.style[trs] = "200ms"
		this.activeEl.style[trs] = "200ms"
		// this.nextEl.style[trs] = ""

		setTimeout(function () {
			this.slideTo(--this.activeIndex)
			this.isTraning = false
			this.fire("slideend")
		}.bind(this), 200)
	},
	slideNext: function () {
		this.isTraning = true
		trf_x(this.prevEl, this.grid_distance * -2)
		trf_x(this.activeEl, this.grid_distance * -1)
		trf_x(this.nextEl, 0)

		// this.prevEl.style[trs] = ""
		this.activeEl.style[trs] = "200ms"
		this.nextEl.style[trs] = "200ms"

		setTimeout(function () {
			this.slideTo(++this.activeIndex)
			this.isTraning = false
			this.fire("slideend")
		}.bind(this), 200)
	},
	initialLiClass: function () {
		this.lis.forEach(item => {item.className = "ss-html"})
	},
	computIndex: function () {
		let len = this.lis.length,
			prevIndex,
			nextIndex
		if (this.activeIndex > len - 1) {this.activeIndex = 0 }
		if (this.activeIndex < 0) {this.activeIndex = len - 1}

		if (this.activeIndex < len-1 && this.activeIndex > 0) {
			prevIndex = this.activeIndex - 1
			nextIndex = this.activeIndex + 1
		}else if (this.activeIndex === 0) {
			prevIndex = len - 1
			nextIndex = this.activeIndex + 1
		}else if (this.activeIndex === len - 1) {
			prevIndex = this.activeIndex - 1
			nextIndex = 0
		}

		return {
			prevIndex,
			nextIndex
		}
	},
	reStyle: function () {
		trf_x(this.prevEl, this.grid_distance * -1)
		trf_x(this.activeEl, 0)
		trf_x(this.nextEl, this.grid_distance * 1)
	}
}

util.extend(SS.prototype, propto)
util.extend(SS.prototype, support_events)

module.exports = SS




// let el = document.getElementById("carrousel")
// let list = [
// 	{
// 		content: "<div style='height: 100%;background:red;'></div>"
// 	},
// 	{
// 		content: "<div style='height: 100%;background:blue;'></div>"
// 	},
// 	{
// 		content: "<div style='height: 100%;background:pink;'></div>"
// 	},
// 	{
// 		content: "<div style='height: 100%;background:yellow;'></div>"
// 	}
// ]
// let S = new SS(el, {
// 	data: list,
// 	activeIndex: 2
// })
// S.on("slidestart", function () {
// 	console.log("start")
// })
// S.on("slideend", function (e) {
// 	console.log(e)
// 	console.log("end")
// })
