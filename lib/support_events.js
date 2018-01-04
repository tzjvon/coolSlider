let EVENTS = [
	"slideend",
	"slidestart"
]

export const evnets_funcs = {
		"slideend": [],
		"slidestart": []
	};

export default {
	on:function (type, fn) {
		if (EVENTS.indexOf(type) > -1 && typeof fn === "function") {
			this.evnets_funcs[type].push(fn)
		}
	},
	fire: function (type) {
		let funcs = this.evnets_funcs[type],
			len = funcs.length
		if (len > 0) {
			for (let i = 0; i < len; i++) {
				funcs[i].call(this, this.activeIndex)
			}
		}

	}
}
