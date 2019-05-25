/*! Some code, such as regular expressions, and ideas are from Jon Kantner's CSS-tricks article. https://css-tricks.com/converting-color-spaces-in-javascript/. Formulas for HSL conversions come from https://www.vocal.com/video/rgb-and-hsvhsihsl-color-space-conversion/ */

function tincture(color, options) {
	color = color ? color : "";
	options = options || {};

	if (color instanceof tincture) {
		return color;
	};

	if (!(this instanceof tincture)) {
		return new tincture(color, options);
	}

	let output = {
		original: color
	};

	output.originalFormat = this.getFormat(color);
	switch (output.originalFormat) {
		case "RGB":
			output.hasAlpha = false;
			output.rgb = color;
			output.hsl = this.RGBToHSL(color, true);
			output.hex = this.RGBToHEX(color);

			break;
		case "RGBA":
			output.hasAlpha = true;
			output.rgb = color;
			output.hsl = this.RGBAToHSLA(color);
			output.hex = this.RGBAToHEXA(color);

			break;
		case "HEX":
			output.hasAlpha = false;
			output.hex = color.toLowerCase();
			output.rgb = this.HEXToRGB(color);
			output.hsl = this.HEXToHSL(color);
			break;
		case "HEXA":
			output.hasAlpha = true;
			output.hex = color.toLowerCase();
			output.rgb = this.HEXAToRGBA(color);
			output.hsl = this.HEXAToHSLA(color);
			break;
		case "HSL":
			output.hasAlpha = false;
			output.hsl = color;
			output.rgb = this.HSLToRGB(color, true);
			output.hex = this.HSLToHEX(color, true);
			break;
		case "HSLA":
			output.hasAlpha = true;
			output.hsl = color;
			output.rgb = this.HSLAToRGBA(color, true);
			output.hex = this.HSLAToHEXA(color, true);
			break;
		default:
			console.error("Invalid input color: " + color);
			break;
	}

	return output;
}

tincture.prototype = {
	isRGB: function(str) {
		let expression = /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i;
		return expression.test(str);
	},

	isRGBA: function(str) {
		let expression = /^rgba\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){3}))|(((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){3}))\/\s)((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;
		return expression.test(str);
	},

	isHEX: function(str) {
		let expression = /^#([\da-f]{3}){1,2}$/i;
		return expression.test(str);
	},

	isHEXA: function(str) {
		let expression = /^#([\da-f]{4}){1,2}$/i;
		return expression.test(str);
	},

	isHSL: function(str) {
		let expression = /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i;
		return expression.test(str);
	},

	isHSLA: function(str) {
		let expression = /^hsla\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)(((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2},\s?)|((\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}\s\/\s))((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;
		return expression.test(str);
	},

	getFormat: function(str) {
		if (this.isRGB(str) == true) return "RGB";
		if (this.isRGBA(str) == true) return "RGBA";
		if (this.isHEX(str) == true) return "HEX";
		if (this.isHEXA(str) == true) return "HEXA";
		if (this.isHSL(str) == true) return "HSL";
		if (this.isHSLA(str) == true) return "HSLA";
		console.error("Invalid input color: " + str);
		return;
	},

	HEXToRGB: function(str, returnObj) {
		if (this.isHEX(str)) {
			let r = 0,
				g = 0,
				b = 0;

			if (str.length == 4) {
				r = "0x" + str[1] + str[1];
				g = "0x" + str[2] + str[2];
				b = "0x" + str[3] + str[3];
			} else if (str.length == 7) {
				r = "0x" + str[1] + str[2];
				g = "0x" + str[3] + str[4];
				b = "0x" + str[5] + str[6];
			}
			if (returnObj) {
				return {r: +r, g: +g, b: +b};
			} else {
				return "rgb(" + +r + "," + +g + "," + +b + ")";
			}
		} else {
			console.error("Invalid input color: " + str);
			return;
		}
	},

	HEXToHSL: function(str, returnObj) {
		if (this.isHEX(str)) {
			str = this.HEXToRGB(str);
			return this.RGBToHSL(str);
		} else {
			console.error("Invalid input color: " + str);
			return;
		}
	},

	HEXAToRGBA: function(str, returnObj) {
		if (this.isHEXA(str)) {
			let r = 0,
				g = 0,
				b = 0;
			a = 1;

			if (str.length == 5) {
				r = "0x" + str[1] + str[1];
				g = "0x" + str[2] + str[2];
				b = "0x" + str[3] + str[3];
				a = "0x" + str[4] + str[4];
			} else if (str.length == 9) {
				r = "0x" + str[1] + str[2];
				g = "0x" + str[3] + str[4];
				b = "0x" + str[5] + str[6];
				a = "0x" + str[7] + str[8];
			}

			a = +(a / 255).toFixed(3);

			return "rgba(" + +r + "," + +g + "," + +b + "," + a + ")";
		} else {
			console.error("Invalid input color: " + str);
			return;
		}
	},

	HEXAToHSLA: function(str, returnObj) {
		if (this.isHEXA(str)) {
			str = this.HEXAToRGBA(str);
			return this.RGBAToHSLA(str);
		} else {
			console.error("Invalid input color: " + str);
			return;
		}
	},

	HSLToRGB: function(str, returnObj) {
		returnObj = returnObj === true;
		if (this.isHSL(str)) {
			let sep = str.indexOf(",") > -1 ? "," : " ";
			str = str
				.substr(4)
				.split(")")[0]
				.split(sep);

			let h = str[0],
				s = str[1].substr(0, str[1].length - 1) / 100,
				l = str[2].substr(0, str[2].length - 1) / 100;

			if (h.indexOf("deg") > -1) {
				h = h.substr(0, h.length - 3);
			} else if (h.indexOf("rad") > -1) {
				h = Math.round(h.substr(0, h.length - 3) * (180 / Math.PI));
			} else if (h.indexOf("turn") > -1) {
				h = Math.round(h.substr(0, h.length - 4) * 360);
			}

			if (h >= 360) h %= 360;

			let c = (1 - Math.abs(2 * l - 1)) * s,
				x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
				m = l - c / 2,
				r = 0,
				g = 0,
				b = 0;

			if (h >= 0 && h < 60) {
				r = c;
				g = x;
				b = 0;
			} else if (h >= 60 && h < 120) {
				r = x;
				g = c;
				b = 0;
			} else if (h >= 120 && h < 180) {
				r = 0;
				g = c;
				b = x;
			} else if (h >= 180 && h < 240) {
				r = 0;
				g = x;
				b = c;
			} else if (h >= 240 && h < 300) {
				r = x;
				g = 0;
				b = c;
			} else if (h >= 300 && h < 360) {
				r = c;
				g = 0;
				b = x;
			}

			r = Math.round((r + m) * 255);
			g = Math.round((g + m) * 255);
			b = Math.round((b + m) * 255);
			if (returnObj) {
				return { r: r, b: b, g: g };
			}
			return "rgb(" + r + "," + g + "," + b + ")";
		} else {
			console.error("Invalid input color: " + str);
			return;
		}
	},

	HSLToHEX: function(str) {
		return null;
	},

	HSLAToRGBA: function(str, returnObj) {
		returnObj = returnObj === true;
		if (this.isHSLA(str)) {
			let sep = str.indexOf(",") > -1 ? "," : " ";
			str = str
				.substr(5)
				.split(")")[0]
				.split(sep);

			if (str.indexOf("/") > -1) str.splice(3, 1);

			let h = str[0],
				s = str[1].substr(0, str[1].length - 1),
				l = str[2].substr(0, str[2].length - 1),
				a = str[3];

			if (a.indexOf("%") > -1) {
				a = +a.substr(0, a.length - 1) / 100;
			}

			if (h.indexOf("deg") > -1) {
				h = h.substr(0, h.length - 3);
			} else if (h.indexOf("rad") > -1) {
				h = Math.round(h.substr(0, h.length - 3) * (180 / Math.PI));
			} else if (h.indexOf("turn") > -1) {
				h = Math.round(h.substr(0, h.length - 4) * 360);
			}

			if (h >= 360) h %= 360;

			let obj = this.HSLToRGB(
				"hsl(" + h + "," + s + "%," + l + "%)",
				true
			);
			obj.a = +a;
			if (returnObj) {
				return obj;
			}
			return (
				"rgba(" +
				arr[0] +
				"," +
				arr[1] +
				"," +
				arr[2] +
				"," +
				a +
				")"
			);
		} else {
			console.error("Invalid input color: " + str);
			return;
		}
	},

	HSLAToHEXA: function(str) {
		return null;
	},

	RGBToHEX: function(str) {
		if (this.isRGB(str)) {
			let sep = str.indexOf(",") > -1 ? "," : " ";
			str = str
				.substr(4)
				.split(")")[0]
				.split(sep);

			for (let i in str) {
				let r = str[i];
				if (r.indexOf("%") > -1)
					str[i] = Math.round(
						(r.substr(0, r.length - 1) / 100) * 255
					);
			}

			let r = (+str[0]).toString(16),
				g = (+str[1]).toString(16),
				b = (+str[2]).toString(16);

			if (r.length == 1) r = "0" + r;
			if (g.length == 1) g = "0" + g;
			if (b.length == 1) b = "0" + b;

			return "#" + r + g + b;
		} else {
			console.error("Invalid input color: " + str);
			return;
		}
	},

	RGBToHSL: function(str, returnObj) {
		returnObj = returnObj === true;
		if (this.isRGB(str)) {
			let sep = str.indexOf(",") > -1 ? "," : " ";
			str = str
				.substr(4)
				.split(")")[0]
				.split(sep);

			for (let i in str) {
				let r = str[i];
				if (r.indexOf("%") > -1)
					str[i] = Math.round(
						(r.substr(0, r.length - 1) / 100) * 255
					);
			}

			let r = str[0] / 255,
				g = str[1] / 255,
				b = str[2] / 255;

			let cmin = Math.min(r, g, b),
				cmax = Math.max(r, g, b),
				delta = cmax - cmin,
				h = 0,
				s = 0,
				l = 0;

			if (delta == 0) {
				h = 0;
			} else if (cmax == r) {
				h = ((g - b) / delta) % 6;
			} else if (cmax == g) {
				h = (b - r) / delta + 2;
			} else {
				h = (r - g) / delta + 4;
			}

			h = Math.round(h * 60);

			if (h < 0) {
				h += 360;
			}

			l = (cmax + cmin) / 2;
			s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

			s = +(s * 100).toFixed(1);
			l = +(l * 100).toFixed(1);
			if (returnObj) {
				return { h: h, s: s, l: l };
			}
			return "hsl(" + h + "," + s + "%," + l + "%)";
		} else {
			console.error("Invalid input color: " + str);
			return;
		}
	},

	RGBAToHEXA: function(str) {
		if (this.isRGBA(str)) {
			let sep = str.indexOf(",") > -1 ? "," : " ";
			str = str
				.substr(5)
				.split(")")[0]
				.split(sep);

			if (str.indexOf("/") > -1) str.splice(3, 1);

			for (let i in str) {
				let r = str[i];
				if (r.indexOf("%") > -1) {
					let p = r.substr(0, r.length - 1) / 100;

					if (this.i < 3) {
						str[i] = Math.round(p * 255);
					} else {
						str[i] = p;
					}
				}
			}
			let r = (+str[0]).toString(16),
				g = (+str[1]).toString(16),
				b = (+str[2]).toString(16),
				a = Math.round(+str[3] * 255).toString(16);

			if (r.length == 1) r = "0" + r;
			if (g.length == 1) g = "0" + g;
			if (b.length == 1) b = "0" + b;
			if (a.length == 1) a = "0" + a;

			return "#" + r + g + b + a;
		} else {
			console.error("Invalid input color: " + str);
			return;
		}
	},

	RGBAToHSLA: function(str, returnObj) {
		returnObj = returnObj === true;
		if (this.isRGBA(str)) {
			let sep = str.indexOf(",") > -1 ? "," : " ";
			str = str
				.substr(5)
				.split(")")[0]
				.split(sep);

			if (str.indexOf("/") > -1) str.splice(3, 1);

			for (let i in str) {
				let r = str[i];
				if (r.indexOf("%") > -1) {
					let p = r.substr(0, r.length - 1) / 100;

					if (this.i < 3) {
						str[i] = Math.round(p * 255);
					} else {
						str[i] = p;
					}
				}
			}

			let r = str[0] / 255,
				g = str[1] / 255,
				b = str[2] / 255,
				a = str[3];

			let cmin = Math.min(r, g, b),
				cmax = Math.max(r, g, b),
				delta = cmax - cmin,
				h = 0,
				s = 0,
				l = 0;

			if (delta == 0) {
				h = 0;
			} else if (cmax == r) {
				h = ((g - b) / delta) % 6;
			} else if (cmax == g) {
				h = (b - r) / delta + 2;
			} else {
				h = (r - g) / delta + 4;
			}

			h = Math.round(h * 60);

			if (h < 0) {
				h += 360;
			}

			l = (cmax + cmin) / 2;
			s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

			s = +(s * 100).toFixed(1);
			l = +(l * 100).toFixed(1);

			if (returnObj) {
				return { h: +h, s: +s / 100, l: +l / 100, a: +a };
			}
			return "hsl(" + h + "," + s + "%," + l + "%," + a + ")";
		} else {
			console.error("Invalid input color: " + str);
			return;
		}
	}
};
