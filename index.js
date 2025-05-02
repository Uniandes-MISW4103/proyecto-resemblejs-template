function browser(b){
    return `<div class=" browser" id="test0">
    <div class="imgline">
      <div class="imgcontainer">
        <span class="imgname">Reference</span>
        <img class="img2" src="before-${b}.png" id="refImage" label="Reference">
      </div>
      <div class="imgcontainer">
        <span class="imgname">Test</span>
        <img class="img2" src="after-${b}.png" id="testImage" label="Test">
      </div>
    </div>
    <div class="imgline">
      <div class="imgcontainer">
        <span class="imgname">Diff</span>
        <img class="imgfull" src="./compare-${b}.png" id="diffImage" label="Diff">
      </div>
    </div>
  </div>`
}

function createReport(resultInfo){
    return `
    <html>
        <head>
            <title> VRT Report </title>
            <link href="index.css" type="text/css" rel="stylesheet">
        </head>
        <body>
            <h1>Report for 
                 <a href="${resultInfo.url}"> ${resultInfo.url}</a>
            </h1>
            
            <div id="visualizer">
                ${resultInfo.browsers.map(b=>browser(b))}
            </div>
        </body>
    </html>`
}

const fs = require("fs");
const resultInfo = {
  browsers: ["chromium"],
  url: "https://monitor177.github.io/color-palette"
};

fs.writeFileSync(`./test-results/example-color-palette-vrt-chromium/index.html`, createReport(resultInfo));
fs.copyFileSync('./public/index.css', `./test-results/example-color-palette-vrt-chromium/index.css`);