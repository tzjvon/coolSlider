;(function (root, factory) {
	if (typeof exports === "object") {
		module.exports = factory()
	}else if (typeof define === "function" && define.amd) {
		define([], factory())
	}else {
		root.Utils = factory()
	}
})(this || window, function () {
	var Utils = (function () {
		var e = document.createElement("fakeElement");
		var TRANSITION_END_EVENT, BROWSER_PREFIX;

		[
			['WebkitTransition', 'webkitTransitionEnd', 'webkit'],
			['transition', 'transitionend', null],
			['MozTransition', 'transitionend', 'moz'],
			['OTransition', 'oTransitionEnd', 'o']
		].some(function (t) {
			if (e.style[t[0]] !== undefined) {
				TRANSITION_END_EVENT = t[1];
				BROWSER_PREFIX = t[2];
				return true;
			}
		});



		var me = {
			TRANSITION_END_EVENT: TRANSITION_END_EVENT,
			BROWSER_PREFIX: BROWSER_PREFIX,

			isDom: function (obj) {
				try {
					return obj instanceof HTMLElement
				} catch(e) {
					return (typeof obj === "object") &&
						(obj.nodeType ===1) && (typeof obj.style === "object") &&
						(typeof obj.ownerDocument === "object")
				}
			},
			Blob: window.Blob || window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder,

			extend: function (target, obj, deep) {
				for (var key in obj) {
					if (deep) {
						target[key] =  target[key]  || obj[key]
					}else {
						if (Object.prototype.hasOwnProperty.call(obj, key)) {
							target[key] = target[key]  || obj[key]
						}else {
							continue;
						}
					}
				}
			},
			hasClass: function (el, cl) {return el.className.match(new RegExp("(\\s|^)("+cl+")(\\s|$)")) },
			addClass: function (el, cl) {if (!this.hasClass(el, cl)) {el.className += " " + cl } },
			removeClass: function (el, cl) {
				if (this.hasClass(el, cl)) {
					var arrNames = el.className.split(/\s+/)
					arrNames.splice(arrNames.indexOf(cl), 1)
					el.className = arrNames.join(" ")
				}
			},
			addEvent: function (el, type, fn, capture) {el.addEventListener(type, fn, capture || false) },
			removeEvent: function (el, type, fn) {el.removeEventListener(type, fn) },
			donwloadImg: function (img, fileName, callback, fileType, quality) {
				/*
				* img HTMLImageElement
				* fileName 下载之后的图片名字
				* fileType 图片类型 如（"image/png"  "image/jpg"  "image/jpeg"）
				* quality 表示图片质量
				*/

				var self = this
				var aEl = document.createElement("a");
				quality = quality || 1
				// fileType = fileType || "image/" + fileName.match(/\.([a-z]+)$/i)[1],
				fileType = fileType || "image/jpg"
				aEl.download = fileName

				var canvas = self.createCanvas(img.width, img.height);
					canvas.getContext("2d").drawImage(img, 0, 0)
					canvas.toBlob(function (blob) {
						aEl.href = self.createObjectURL(blob)
						aEl.click()
						aEl.remove()
						typeof callback === "function" && callback(blob)

					}, fileType, quality)
			},
			createObjectURL: function (blob) {
				var url = window.URL || window.webkitURL || window.mozURL || window.msURL
				return url['createObjectURL'](blob);
			},
			createCanvas: function (width, height) {
				var canvas = document.createElement("canvas")
				canvas.width = width
				canvas.height = height
				return canvas
			},
			clearCanvas: function (myCanvas) {
				var myCxt = myCanvas.getContext("2d")
				myCxt.setTransform(1, 0, 0, 1, 0, 0)
				myCxt.clearRect(0,0, myCanvas.width, myCanvas.height)
			},
			getSingle: function (fn) {
				var single;
				return function () {
					return single || (single = fn.apply(this.arguments))
				}
			},
			isParent: function (el, parentEl) {
				while (el !== undefined && el !== null && el.tagName.toUpperCase() !== "BODY" && el.tagName.toUpperCase() !== "HTML") {
					if (el === parentEl) {
						return true
					}
					el = el.parentNode
				}
				return false
			},
			_bind: function (fn, obj) {
				return function () {
					return fn.apply(obj, arguments)
				}
			},
			type: function (obj) {
				return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, "")
			},
			isArray: function (list) {
				return this.type(list) === "Array"
			},
			isString: function (list) {
				return this.type(list) === "String"
			},
			IU: function (word) {
				return word.replace(/^[a-z]/, function (t) {
					return t.toUpperCase();
				});
			},
			setStyles: function (dom, obj) {
				for (var key in obj) {
					if (Object.prototype.hasOwnProperty.call(obj, key)) {
						var _key = key
						if (key.match(/(transform|animation|transition)/)) {
							_key = this.prefix() + this.IU(key)
						}
						dom.style[_key] = obj[key]
					}
				}

			},


			partialPrint: function () {

			}
		}


		return me
	})()



	return Utils;
})
