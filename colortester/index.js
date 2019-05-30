customElements.define(
	"tincture-card",
	class extends HTMLElement {
		static get observedAttributes() {
			return ["data-title", "data-color1", "data-color2"];
		}

		constructor() {
			super();
			let template = document.getElementById("tincture-card");
			let templateContent = template.content;

			const shadowRoot = this.attachShadow({ mode: "open" }).appendChild(
				templateContent.cloneNode(true)
			);

			const component = this;

			component.shadowRoot.querySelector(
				".card__title",
				component.dataset.title
			);
		}

		attributeChangedCallback(name, oldValue, newValue) {
			let card = this.shadowRoot;
			if (newValue != oldValue) {
				if (name == "data-title") {
					card.querySelector(
						".card__title"
					).textContent = this.dataset.title;
				}

				if (name == "data-color1") {
					let color = tincture(this.dataset.color1);
					let colorBlindColor1 = color.toColorBlindRGB(
						this.dataset.colorBlindnessType
					);
					let colorBlindColor1String = color.RGBObjToRGBString(
						colorBlindColor1
					);
					let colorBlindColorWhite = color.toColorBlindRGB(
						this.dataset.colorBlindnessType,
						{ r: 255, g: 255, b: 255 }
					);
					let colorBlindColorWhiteString = color.RGBObjToRGBString(
						colorBlindColorWhite
					);
					let colorBlindColorBlack = color.toColorBlindRGB(
						this.dataset.colorBlindnessType,
						{ r: 0, g: 0, b: 0 }
					);
					let colorBlindColorBlackString = color.RGBObjToRGBString(
						colorBlindColorBlack
					);
					let contrastToWhite = color.getContrast(
						colorBlindColorWhite,
						colorBlindColor1
					);
					let contrastToBlack = color.getContrast(
						colorBlindColorBlack,
						colorBlindColor1
					);
					let color2;
					let contrast;
					if (contrastToBlack > contrastToWhite) {
						color2 = colorBlindColorBlackString;
						contrast = contrastToBlack;
					} else {
						color2 = colorBlindColorWhiteString;
						contrast = contrastToWhite;
					}
					let colorContainer = card.querySelector(
						".visualization"
					);
					let foregroundContainer = colorContainer.querySelector(
						".foreground"
					);
					let backgroundContainer = colorContainer.querySelector(
						".background"
					);

					foregroundContainer.style.color = colorBlindColor1String;
					foregroundContainer.style.backgroundColor = color2;

					backgroundContainer.style.color = color2;
					backgroundContainer.style.backgroundColor = colorBlindColor1String;
					card.querySelector('.contrast__value').textContent = +contrast.toFixed(2) + ":1";

					let normalAAALabel = card.querySelector('.wcag__section--normal dd.aaa .label');
					let normalAALabel = card.querySelector('.wcag__section--normal dd.aa .label');
					let largeAAALabel = card.querySelector('.wcag__section--large dd.aaa .label');
					let largeAALabel = card.querySelector('.wcag__section--large dd.aa .label');
					let uiAALabel = card.querySelector('.wcag__section--ui dd.aa .label');

					if (contrast >= 3) {
						largeAALabel.textContent = "Pass";
						largeAALabel.classList.remove('label--fail');
						largeAALabel.classList.add('label--success');

						uiAALabel.textContent = "Pass";
						uiAALabel.classList.remove('label--fail');
						uiAALabel.classList.add('label--success');
					} else {
						largeAALabel.textContent = "Fail";
						largeAALabel.classList.remove('label--success');
						largeAALabel.classList.add('label--fail');

						uiAALabel.textContent = "Fail";
						uiAALabel.classList.remove('label--success');
						uiAALabel.classList.add('label--fail');
					}

					if (contrast >= 4.5) {
						largeAAALabel.textContent = "Pass";
						largeAAALabel.classList.remove('label--fail');
						largeAAALabel.classList.add('label--success');

						normalAALabel.textContent = "Pass";
						normalAALabel.classList.remove('label--fail');
						normalAALabel.classList.add('label--success');
					} else {
						largeAAALabel.textContent = "Fail";
						largeAAALabel.classList.remove('label--success');
						largeAAALabel.classList.add('label--fail');

						normalAALabel.textContent = "Fail";
						normalAALabel.classList.remove('label--success');
						normalAALabel.classList.add('label--fail');
					}

					if (contrast >= 7) {
						normalAAALabel.textContent = "Pass";
						normalAAALabel.classList.remove("label--fail");
						normalAAALabel.classList.add("label--success");
					} else {
						normalAAALabel.textContent = "Fail";
						normalAAALabel.classList.remove("label--success");
						normalAAALabel.classList.add("label--fail");
					}
				}
			}
		}
	}
);

customElements.define(
	"tincture-color-tester",
	class extends HTMLElement {
		constructor() {
			super();
			let template = document.getElementById("tincture-color-tester");
			let templateContent = template.content;

			const colorBlindnessTypes = [
				"True",
				"Protanopia",
				"Protanomaly",
				"Deuteranopia",
				"Deuteranomaly",
				"Tritanopia",
				"Tritanomaly",
				"Achromatopsia",
				"Achromatomaly"
			];

			const shadowRoot = this.attachShadow({ mode: "open" }).appendChild(
				templateContent.cloneNode(true)
			);

			const component = this;

			const input = component.shadowRoot.querySelector(".test__input");

			input.addEventListener("input", function(event) {
				let color = tincture(this.value);
				if (color.isValid) {
					component
						.querySelectorAll("tincture-card")
						.forEach(function(element) {
							element.dataset.color1 = color.toRgbString();
						});
				}
			});

			if (input.value == "") {
				input.value = "#efc818";
			}

			colorBlindnessTypes.forEach(function(type) {
				const element = document.createElement("tincture-card");
				element.dataset.colorBlindnessType = type;
				element.dataset.title = type;
				element.dataset.color1 = input.value;
				element.setAttribute("id", "tincture-" + type);
				element.setAttribute("slot", "cards");
				component.appendChild(element);
			});
		}
	}
);
