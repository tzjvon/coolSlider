import util from "./Utils.js"

export const trf_x = function(dom, x) {
	var trf = util.IU(util.BROWSER_PREFIX) + util.IU("transform")
	dom.style[trf] = "translateZ(0) translateX("+ x +"px)"
}
