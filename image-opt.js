const sharp = require('sharp');
const fs = require('fs');

const errNoSuchFileOrDir = 'ENOENT';

const allImagesDirPath = './img';
const originalImagesDirPath = './img/original';
const imageSizes = [260, 520, 800];

// get names of original images
let originalImages = [];
fs.readdir(originalImagesDirPath, (err, files) => {
  if (err) return;
  originalImages = files;
})

// convert images to wanted formats
for (let imageSize of imageSizes) {
  const convertedImagesDirPath = `${allImagesDirPath}/${imageSize}`

  // check if directory exists
  fs.readdir(convertedImagesDirPath, (err, files) => {
    let dirExists = true;
    if (err) {
      if (err.code !== errNoSuchFileOrDir) {
        console.log(`error when looking for directory: ${err}`);
        dirExists = false;
        return;
      }
      fs.mkdir(convertedImagesDirPath, err => {
        if (err) {
          console.log(`error when creating directory: ${err}`);
          dirExists = false;
          return;
        }
      });
    }
    if (!dirExists) return;

    // if directory exists 
    for (let imageName of originalImages) {
      const inputImagePath = `${originalImagesDirPath}/${imageName}`
      const outputImagePath = ``
      sharp(inputImagePath)
        .resize(imageSize, 1)
        .min()
        .jpeg({
          quality: 60
        })
        .toFile(`${convertedImagesDirPath}/${imageName}`)
        .then(info => {
          console.log(info);
        })
        .catch(err => {
          console.log('error when resizing image: ' + err);
        });
    }
  })
}