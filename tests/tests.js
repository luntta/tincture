console.time("TESTS");
const testColors = [
	// RGB
	"rgb(0,0,255)",
	"rgb(0 0 255)",
	// RGB with percents
	"rgb(0%,0%,100%)",
	"rgb(0% 0% 100%)",
	// RGBA
	"rgba(0,0,255,0.5)",
	"rgba(0 0 255 / 0.5)",
	// RGBA with percents
	"rgba(0%,50%,100%,0.5)",
	"rgba(0%,50%,100%,50%)",
	"rgba(0% 50% 100% / 0.5)",
	"rgba(0% 50% 100% / 50%)",
	// HEX
	"#0000ff",
	"#00f",
	// HEXA
	"#0000ff80",
	"#00f8",
	// HSL
	"hsl(240,100%,50%)",
	"hsl(240deg,100%,50%)",
	"hsl(3.14rad,100%,50%)",
	"hsl(0.5turn,100%,50%)",
	"hsl(240 100% 50%)",
	"hsl(240deg 100% 50%)",
	"hsl(3.14rad 100% 50%)",
	"hsl(0.5turn 100% 50%)",
	// HSLA
	"hsla(240,100%,50%,0.5)",
	"hsla(240deg,100%,50%,0.5)",
	"hsla(3.14rad,100%,50%,0.5)",
	"hsla(0.5turn,100%,50%,0.5)",
	"hsla(240,100%,50%,50%)",
	"hsla(240deg,100%,50%,50%)",
	"hsla(3.14rad,100%,50%,50%)",
	"hsla(0.5turn,100%,50%,50%)",
	"hsla(240 100% 50% / 0.5)",
	"hsla(240deg 100% 50% / 0.5)",
	"hsla(3.14rad 100% 50% / 0.5)",
	"hsla(0.5turn 100% 50% / 0.5)",
	"hsla(240 100% 50% / 50%)",
	"hsla(240deg 100% 50% / 50%)",
	"hsla(3.14rad 100% 50% / 50%)",
	"hsla(0.5turn 100% 50% / 50%)",
	// NAME
	"blue"
];

for (let i = 0; i < testColors.length; i++) {
	let testNumber = i + 1;
	console.time("TEST " + testNumber);
	console.log(tincture(testColors[i]));
	console.timeEnd("TEST " + testNumber);
}

console.timeEnd("TESTS");
