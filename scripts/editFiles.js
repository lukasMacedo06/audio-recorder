const fs = require('fs');
const glob = require('glob');

const regexManifest = new RegExp("http\:\/\/localhost\:[0-9]\+", "g")
const regexAssets = new RegExp("\/static\/[^\/]\+/", "g");
const regexAssetsMain = new RegExp("url.\/", "g");

function editFile(filePath, searchValue, newValue) {
  glob(filePath, (err, files) => {
    if (err) {
      console.log(err.message);
    }
    files.forEach((filePath) => {
      const fileData = fs.readFileSync(filePath, { encoding: 'utf8' });
      const fileEditted = fileData.replace(searchValue, newValue);
      fs.writeFileSync(filePath, fileEditted);
    })
  });
}

editFile('build/manifest.json', regexManifest, 'assets/index.html');
editFile('build/assets/asset-manifest.json', regexAssets, '');
editFile('build/assets/index.html', regexAssets, '');
editFile('build/assets/precache-manifest.*', regexAssets, '');
editFile('build/assets/main.*.chunk.css', regexAssetsMain, 'url(');
