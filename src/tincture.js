/*! Some code, such as regular expressions, and ideas are from Jon Kantner's CSS-tricks article. https://css-tricks.com/converting-color-spaces-in-javascript/. Formulas for HSL conversions come from https://www.vocal.com/video/rgb-and-hsvhsihsl-color-space-conversion/ */

function tincture(color, options) {
	color = color ? color : "";
	options = options || {};

	if (color instanceof tincture) {
		return color;
	}

	if (!(this instanceof tincture)) {
		return new tincture(color, options);
	}

	this._original = color;

	this._originalFormat = this.getFormat(color);
	switch (this._originalFormat) {
		case "RGB":
			this.hasAlpha = false;
			this.rgb = this.RGBStringToRGBObj(color, this.hasAlpha);
			break;
		case "RGBA":
			this.hasAlpha = true;
			this.rgb = this.RGBStringToRGBObj(color, this.hasAlpha);
			break;
		case "HEX":
			this.hasAlpha = false;
			this.rgb = this.HEXToRGB(color, true);
			break;
		case "HEXA":
			this.hasAlpha = true;
			this.rgb = this.HEXAToRGBA(color, true);
			break;
		case "HSL":
			this.hasAlpha = false;
			this.rgb = this.HSLToRGB(color, true);
			break;
		case "HSLA":
			this.hasAlpha = true;
			this.rgb = this.HSLAToRGBA(color, true);
			break;
		default:
			console.error("Invalid input color: " + color);
			return;
	}

	if (this.hasAlpha) {
		this.hex = this.RGBAToHEXA(this.RGBObjToRGBString(this.rgb), true);
		this.hsl = this.RGBAToHSLA(this.RGBObjToRGBString(this.rgb), true);
	} else {
		this.hex = this.RGBToHEX(this.RGBObjToRGBString(this.rgb), true);
		this.hsl = this.RGBToHSL(this.RGBObjToRGBString(this.rgb), true);
	}
}

tincture.prototype = {
	RGBStringToRGBObj: function(color) {
		if (this.isRGBAString(color)) {
			let sep = color.indexOf(",") > -1 ? "," : " ";
			color = color
				.substr(5)
				.split(")")[0]
				.split(sep);

			if (color.indexOf("/") > -1) color.splice(3, 1);

			for (let i in color) {
				let r = color[i];
				if (r.indexOf("%") > -1) {
					let p = r.substr(0, r.length - 1) / 100;

					if (i < 3) {
						color[i] = Math.round(p * 255);
					} else {
						color[i] = p;
					}
				}
			}

			let r = color[0],
				g = color[1],
				b = color[2],
				a = color[3];

			return { r: +r, g: +g, b: +b, a: +a };
		} else if (this.isRGBString(color)) {
			let sep = color.indexOf(",") > -1 ? "," : " ";
			color = color
				.substr(4)
				.split(")")[0]
				.split(sep);

			for (let i in color) {
				let r = color[i];
				if (r.indexOf("%") > -1)
					color[i] = Math.round(
						(r.substr(0, r.length - 1) / 100) * 255
					);
			}

			let r = color[0],
				g = color[1],
				b = color[2];

			return { r: +r, g: +g, b: +b };
		}
	},
	RGBObjToRGBString: function(color) {
		if (typeof color === "object") {
			if (color.hasOwnProperty("a")) {
				return (
					"rgba(" +
					+color.r +
					"," +
					+color.g +
					"," +
					+color.b +
					"," +
					+color.a +
					")"
				);
			} else {
				return (
					"rgb(" + +color.r + "," + +color.g + "," + +color.b + ")"
				);
			}
		}
	},
	HSLObjToHSLString: function(color) {
		if (typeof color === "object") {
			if (color.hasOwnProperty("a")) {
				return (
					"hsla(" +
					+color.h +
					"," +
					+color.s +
					"%," +
					+color.l +
					"%," +
					+color.a +
					")"
				);
			} else {
				return (
					"hsl(" + +color.h + "," + +color.s + "%," + +color.l + "%)"
				);
			}
		}
	},
	toRgb: function() {
		return this.rgb;
	},
	toRgbString: function() {
		return this.RGBObjToRGBString(this.rgb);
	},
	toHsl: function() {
		return this.hsl;
	},
	toHslString: function() {
		return this.HSLObjToHSLString(this.hsl);
	},
	toHex: function() {
		return this.hex;
	},
	isRGBString: function(color) {
		color = color ? color : this._original;
		let expression = /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i;
		return expression.test(color);
	},

	isRGBAString: function(color) {
		color = color ? color : this._original;
		let expression = /^rgba\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){3}))|(((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){3}))\/\s)((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;
		return expression.test(color);
	},

	isHEX: function(color) {
		color = color ? color : this._original;
		let expression = /^#([\da-f]{3}){1,2}$/i;
		return expression.test(color);
	},

	isHEXA: function(color) {
		color = color ? color : this._original;
		let expression = /^#([\da-f]{4}){1,2}$/i;
		return expression.test(color);
	},

	isHSLString: function(color) {
		color = color ? color : this._original;
		let expression = /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i;
		return expression.test(color);
	},

	isHSLAString: function(color) {
		color = color ? color : this._original;
		let expression = /^hsla\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)(((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2},\s?)|((\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}\s\/\s))((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;
		return expression.test(color);
	},

	getFormat: function(color) {
		if (
			color.hasOwnProperty("r") &&
			color.hasOwnProperty("g") &&
			color.hasOwnProperty("b")
		) {
			if (color.hasOwnProperty("a")) {
				let color =
					"rgba(" +
					color.r +
					"," +
					color.g +
					"," +
					color.b +
					"," +
					a +
					")";
				if (this.isRGBAString(color) == true) return "RGBAObj";
			}
			let color = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
			if (this.isRGBString(color) == true) return "RGBObj";
		}

		if (
			color.hasOwnProperty("h") &&
			color.hasOwnProperty("s") &&
			color.hasOwnProperty("l")
		) {
			if (color.hasOwnProperty("a")) {
				color =
					"hsla(" +
					color.h +
					"," +
					color.s +
					"," +
					color.l +
					"," +
					a +
					")";
				if (this.isHSLAString(color) == true) return "HSLAObj";
			}
			color = "hsl(" + color.h + "," + color.s + "," + color.l + ")";
			if (this.isHSLString(color) == true) return "HSLObj";
		}

		if (typeof color === "string") {
			if (this.isRGBString(color) == true) return "RGB";
			if (this.isRGBAString(color) == true) return "RGBA";
			if (this.isHEX(color) == true) return "HEX";
			if (this.isHEXA(color) == true) return "HEXA";
			if (this.isHSLString(color) == true) return "HSL";
			if (this.isHSLAString(color) == true) return "HSLA";
		}
		console.error("Invalid input color: " + color);
		return;
	},

	HEXToRGB: function(color, returnObj) {
		if (this.isHEX(color)) {
			let r = 0,
				g = 0,
				b = 0;

			if (color.length == 4) {
				r = "0x" + color[1] + color[1];
				g = "0x" + color[2] + color[2];
				b = "0x" + color[3] + color[3];
			} else if (color.length == 7) {
				r = "0x" + color[1] + color[2];
				g = "0x" + color[3] + color[4];
				b = "0x" + color[5] + color[6];
			}
			if (returnObj) {
				return { r: +r, g: +g, b: +b };
			} else {
				return "rgb(" + +r + "," + +g + "," + +b + ")";
			}
		} else {
			console.error("Invalid input color: " + color);
			return;
		}
	},

	HEXToHSL: function(color, returnObj) {
		returnObj = returnObj === true;
		if (this.isHEX(color)) {
			color = this.HEXToRGB(color);
			return this.RGBToHSL(color, returnObj);
		} else {
			console.error("Invalid input color: " + color);
			return;
		}
	},

	HEXAToRGBA: function(color, returnObj) {
		returnObj = returnObj === true;
		if (this.isHEXA(color)) {
			let r = 0,
				g = 0,
				b = 0;
			a = 1;

			if (color.length == 5) {
				r = "0x" + color[1] + color[1];
				g = "0x" + color[2] + color[2];
				b = "0x" + color[3] + color[3];
				a = "0x" + color[4] + color[4];
			} else if (color.length == 9) {
				r = "0x" + color[1] + color[2];
				g = "0x" + color[3] + color[4];
				b = "0x" + color[5] + color[6];
				a = "0x" + color[7] + color[8];
			}

			a = +(a / 255).toFixed(3);

			if (returnObj) {
				return { r: +r, g: +g, b: +b, a: +a };
			}

			return "rgba(" + +r + "," + +g + "," + +b + "," + a + ")";
		} else {
			console.error("Invalid input color: " + color);
			return;
		}
	},

	HEXAToHSLA: function(color, returnObj) {
		returnObj = returnObj === true;
		if (this.isHEXA(color)) {
			color = this.HEXAToRGBA(color);
			return this.RGBAToHSLA(color, returnObj);
		} else {
			console.error("Invalid input color: " + color);
			return;
		}
	},

	HSLToRGB: function(color, returnObj) {
		returnObj = returnObj === true;
		if (this.isHSLString(color)) {
			let sep = color.indexOf(",") > -1 ? "," : " ";
			color = color
				.substr(4)
				.split(")")[0]
				.split(sep);

			let h = color[0],
				s = color[1].substr(0, color[1].length - 1) / 100,
				l = color[2].substr(0, color[2].length - 1) / 100;

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
			console.error("Invalid input color: " + color);
			return;
		}
	},

	HSLToHEX: function(color) {
		if (this.isHSLString(color)) {
			color = this.HSLToRGB(color);
			return this.RGBToHEX(color);
		} else {
			console.error("Invalid input color: " + color);
			return;
		}
	},

	HSLAToRGBA: function(color, returnObj) {
		returnObj = returnObj === true;
		if (this.isHSLAString(color)) {
			let sep = color.indexOf(",") > -1 ? "," : " ";
			color = color
				.substr(5)
				.split(")")[0]
				.split(sep);

			if (color.indexOf("/") > -1) color.splice(3, 1);

			let h = color[0],
				s = color[1].substr(0, color[1].length - 1),
				l = color[2].substr(0, color[2].length - 1),
				a = color[3];

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
			return "rgba(" + obj.r + "," + obj.g + "," + obj.b + "," + a + ")";
		} else {
			console.error("Invalid input color: " + color);
			return;
		}
	},

	HSLAToHEXA: function(color) {
		if (this.isHSLAString(color)) {
			color = this.HSLAToRGBA(color);
			return this.RGBAToHEXA(color);
		} else {
			console.error("Invalid input color: " + color);
			return;
		}
	},

	RGBToHEX: function(color) {
		if (this.isRGBString(color)) {
			let sep = color.indexOf(",") > -1 ? "," : " ";
			color = color
				.substr(4)
				.split(")")[0]
				.split(sep);

			for (let i in color) {
				let r = color[i];
				if (r.indexOf("%") > -1)
					color[i] = Math.round(
						(r.substr(0, r.length - 1) / 100) * 255
					);
			}

			let r = (+color[0]).toString(16),
				g = (+color[1]).toString(16),
				b = (+color[2]).toString(16);

			if (r.length == 1) r = "0" + r;
			if (g.length == 1) g = "0" + g;
			if (b.length == 1) b = "0" + b;

			return "#" + r + g + b;
		} else {
			console.error("Invalid input color: " + color);
			return;
		}
	},

	RGBToHSL: function(color, returnObj) {
		returnObj = returnObj === true;
		if (this.isRGBString(color)) {
			let sep = color.indexOf(",") > -1 ? "," : " ";
			color = color
				.substr(4)
				.split(")")[0]
				.split(sep);

			for (let i in color) {
				let r = color[i];
				if (r.indexOf("%") > -1)
					color[i] = Math.round(
						(r.substr(0, r.length - 1) / 100) * 255
					);
			}

			let r = color[0] / 255,
				g = color[1] / 255,
				b = color[2] / 255;

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
			console.error("Invalid input color: " + color);
			return;
		}
	},

	RGBAToHEXA: function(color) {
		if (this.isRGBAString(color)) {
			let sep = color.indexOf(",") > -1 ? "," : " ";
			color = color
				.substr(5)
				.split(")")[0]
				.split(sep);

			if (color.indexOf("/") > -1) color.splice(3, 1);

			for (let i in color) {
				let r = color[i];
				if (r.indexOf("%") > -1) {
					let p = r.substr(0, r.length - 1) / 100;

					if (i < 3) {
						color[i] = Math.round(p * 255);
					} else {
						color[i] = p;
					}
				}
			}
			let r = (+color[0]).toString(16),
				g = (+color[1]).toString(16),
				b = (+color[2]).toString(16),
				a = Math.round(+color[3] * 255).toString(16);

			if (r.length == 1) r = "0" + r;
			if (g.length == 1) g = "0" + g;
			if (b.length == 1) b = "0" + b;
			if (a.length == 1) a = "0" + a;
			return "#" + r + g + b + a;
		} else {
			console.error("Invalid input color: " + color);
			return;
		}
	},

	RGBAToHSLA: function(color, returnObj) {
		returnObj = returnObj === true;
		if (this.isRGBAString(color)) {
			let sep = color.indexOf(",") > -1 ? "," : " ";
			color = color
				.substr(5)
				.split(")")[0]
				.split(sep);

			if (color.indexOf("/") > -1) color.splice(3, 1);

			for (let i in color) {
				let r = color[i];
				if (r.indexOf("%") > -1) {
					let p = r.substr(0, r.length - 1) / 100;

					if (i < 3) {
						color[i] = Math.round(p * 255);
					} else {
						color[i] = p;
					}
				}
			}

			let r = color[0] / 255,
				g = color[1] / 255,
				b = color[2] / 255,
				a = color[3];

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
				return { h: +h, s: +s, l: +l, a: +a };
			}
			return "hsl(" + h + "," + s + "%," + l + "%," + a + ")";
		} else {
			console.error("Invalid input color: " + color);
			return;
		}
	}
};
