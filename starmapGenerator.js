
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const width = 0;
// Customizations
const starColor = '#ffe224';
const starOpacity = 1;
const starSize = 7;
const backgroundColor = '#000000';
const constellationColor = '#ffffff';
const constellationOpacity = 1;
const constellationWidth = 1;
const graticuleColor = '#ffffff';
const graticuleOpacity = 0.35;
const graticuleWidth = 0.6;
const graticuleDash = 1;
const latitude = 39.434;
const longitude = -77.096;
const year = 2021;
const month = 10;
const day = 16;
const hour = 0;
const minute = 0;



const dom = new JSDOM(`<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>D3-Celestial Starmap</title>
  <script type="text/javascript" src="/javascripts/d3.geo.projection.min.js"></script>
  <script type="text/javascript" src="/javascripts/d3.geo.projection.min.js"></script>
  <script type="text/javascript" src="/javascripts/celestial.min.js"></script>
  <link rel="stylesheet" href="/javascripts/celestial.css">
</head>

<body>
  <div style="overflow:hidden;">
    <div id="celestial-map"></div>
  </div>
  <div id="celestial-form"></div>

  <script type="text/javascript">
    const width = 0;
    // Customizations
    const starColor = '#ffe224';
    const starOpacity = 1;
    const starSize = 7;
    const backgroundColor = '#000000';
    const constellationColor = '#ffffff';
    const constellationOpacity = 1;
    const constellationWidth = 1;
    const graticuleColor = '#ffffff';
    const graticuleOpacity = 0.35;
    const graticuleWidth = 0.6;
    const graticuleDash = 1;
    const latitude = 39.434;
    const longitude = -77.096;
    const year = 2021;
    const month = 10;
    const day = 16;
    const hour = 0;
    const minute = 0;

    Celestial.display({
      width: width,
      disableAnimations: true,
      advanced: false,
      form: false,
      controls: false,
      formFields: { download: false },
      location: false,
      projection: "airy",
      datapath: "../data/",
      planets: { show: false },
      dsos: { show: false },
      constellations: {
        names: false,      // Show constellation names 
        lines: true,   // Show constellation lines, style below
        lineStyle: { stroke: '` + `${constellationColor}` + `', width: constellationWidth, opacity: constellationOpacity }
      },
      mw: { show: false },
      lines: {  // Display & styles for graticule & some planes
        graticule: {
          show: true, stroke: '` + `${graticuleColor}` + `', width: graticuleWidth, opacity: graticuleOpacity, dash: [graticuleDash], // Sets the dashed lines
          // grid values: "outline", "center", or [lat,...] specific position
          lon: { pos: [""], fill: "#eee", font: "10px Helvetica, Arial, sans-serif" },
          // grid values: "outline", "center", or [lon,...] specific position
          lat: { pos: [""], fill: "#eee", font: "10px Helvetica, Arial, sans-serif" }
        },
        equatorial: { show: false },
        ecliptic: { show: false },
        galactic: { show: false },
        supergalactic: { show: false }
      },
      background: { // Background style
        fill: '` + `${backgroundColor}` + `',   // Area fill
        opacity: 1,
        stroke: '`+ `${backgroundColor}` + `', // Outline
        width: 4
      },
      horizon: { show: false },
      stars: {
        show: true,    // Show stars
        limit: 6,      // Show only stars brighter than limit magnitude
        colors: false,  // Show stars in spectral colors, if not use default color
        style: { fill: '` + `${starColor}` + `', opacity: starOpacity }, // Default style for stars
        designation: false, // Show star names (Bayer, Flamsteed, Variable star, Gliese or designation, 
        size: starSize,       // Maximum size (radius) of star circle in pixels
        exponent: -0.28, // Scale exponent for star size, larger = more linear
        data: 'stars.6.json' // Data source for stellar data, 
        // number indicates limit magnitude
      },
    });

    Celestial.skyview({ "location": [latitude, longitude] });
    Celestial.skyview({ "date": new Date(Date.UTC(year, month, day, hour, minute)) });
    // Download SVG
    document.querySelector('#download-svg').click();
  </script>

  <footer id="d3-celestial-footer">
    <p><a href="https://github.com/ofrohn/d3-celestial"><b>D3-Celestial</b></a> released under <a
        href="http://opensource.org/licenses/BSD-3-Clause">BSD license</a>. Copyright 2015-19 <a
        href="http://armchairastronautics.blogspot.com/" rel="author">Olaf Frohn</a>.</p>
  </footer>
</body>

</html>`, { runScripts: "dangerously", resources: "usable", url: 'https://www.talmadge.tech' });
console.log(dom.window.document.querySelector("p").textContent); // "Hello world"



