import globalHeader from './components/layout/header/index.js';
import globalFooter from './components/layout/footer/index.js';

//variables
var artBoard = document.getElementById('artBoard');
var imgUrl = document.getElementById('imgUrl');
var sizeSelect = document.getElementById('boardSize');
var clearBoard = document.getElementById('clearBoard');
var c = artBoard.getContext('2d');
var preview = document.querySelector('.bg-image');
var imgMsg  = document.querySelector('.img-msg');
var convertButton = document.getElementById('convert');
var convertToLego = document.getElementById('convertToLego');
var circles = []; //create a new array for the bubbles
var uniqueColors = [];
var raw =[];
var legoColors = [];
var convertedColors = [];
var radius = 3.84;
var num = radius + .6;
var amount = 108;

axios({
        method: 'get',
        responseType: 'json',
        url: 'https://rebrickable.com/api/v3/lego/colors/?key=b1225b13eeb9efde6bcb38032a01922f'
    })
    .then(function (response) {
        // console.log(response.data.results);
        response.data.results.forEach(function(result, i){
            if(!result.is_trans) {
                legoColors.push(
                    { 
                        id: result.id,
                        name: result.name,
                        color: hexToRgb(result.rgb),
                    }
                );
            }
        });
        console.log('lego colors ', legoColors);
    })
    .catch(function (error) {
        console.log(error);
    });
//settings
// c.strokeStyle = 'black';
// c.lineWidth = 1;

//Draw Grid
c.fillStyle = 'transparent';
c.strokeStyle = 'transparent';

function drawGrid() {
    // c.fillStyle = 'rgba(225,225,225,.5)';
    c.globalCompositeOperation = "destination-over";
    // //draw circles
    for(let i = 1; i <= amount; i+=2 ){
        for(let j = 1; j <= amount; j+=2 ){
            var circle = new Circle(num*j,num*i);
            circle.draw(num*j,num*i);
            circles.push(circle.props);
        }
    }
}

function Circle(x,y) {
    this.props = { x:x, y:y, fill: ''}
    this.draw = function(x,y,fill) {
        c.fillStyle = fill;
        c.strokeStyle = fill;
        c.save();
        c.beginPath();
        c.arc(x,y,radius,0, Math.PI * 2, false);
        c.stroke();
        c.fill();
        c.restore();
    };
}

//functions
function drawImageFromUrl(sourceurl) {
    var img = new Image();
    img.addEventListener('load', function() {
        c.drawImage(
            img, 
            0,
            0,
            img.width,
            img.height,
            0,
            0,
            artBoard.width,
            artBoard.height
        );
        // c.globalCompositeOperation = "source-over";
        // drawGrid();
    });
    img.setAttribute('src', sourceurl);
    // c.globalCompositeOperation = "source-over";
}

function compareColors(color, colorList) {
    let r1 = color[0];
    let g1 = color[1];
    let b1 = color[2];
    let distanceList = [];
    for(let i = 0; i < colorList.length; i++) {
        let r2 = colorList[i].color.r;
        let g2 = colorList[i].color.g;
        let b2 = colorList[i].color.b;
        let d = Math.sqrt( Math.pow(r1-r2, 2) + Math.pow(g1-g2, 2) + Math.pow(b1-b2, 2) );      
        distanceList.push({distance: d, index: i});
    };
    distanceList = distanceList.sort(function(a, b) {
        return a.distance - b.distance;
    });
    return distanceList[0];
}  

const fileTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "image/x-icon"
];

function newCircle() { //create function for a new bubble
    circles.push(new circle());
}

function validFileType(file) {
    return fileTypes.includes(file.type);
}

function returnFileSize(number) {
    if(number < 1024) {
      return number + 'bytes';
    } else if(number >= 1024 && number < 1048576) {
      return (number/1024).toFixed(1) + 'KB';
    } else if(number >= 1048576) {
      return (number/1048576).toFixed(1) + 'MB';
    }
}

function convertPixels() {
    artBoard.classList.add('converted');
}

//event listeners
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var obj = result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
    return obj;
  }

convertButton.addEventListener('click', function(e){
    convert();
    // console.log(circles);

    //consolidate colors
    circles.forEach((circle, i) => {
        if(!uniqueColors.includes(circles[i].fill)){
            uniqueColors.push(circles[i].fill); 
        }
    });
    console.log(uniqueColors.sort());
    convertToLego.removeAttribute('disabled');
});

convertToLego.addEventListener('click', function(){
    //reset
    c.clearRect(0, 0, artBoard.width, artBoard.height);
    //draw circles
    for(let i = 0; i < circles.length; i++) {
        let circle = new Circle();
        let closestColor = compareColors(splitRGB(circles[i].fill), legoColors);
        let newColor = `${legoColors[closestColor.index].color.r},${legoColors[closestColor.index].color.g},${legoColors[closestColor.index].color.b}`;
        circle.draw(circles[i].x,circles[i].y, `rgb( ${newColor} )`);
        //add result to circle
        circles[i].fill = newColor;
    }
    console.log(circles);
});

sizeSelect.addEventListener('change', function(e){
    artBoard.className = sizeSelect.value;
});

imgUrl.addEventListener('change', function(){
    if(this.files && this.files[0]) {
        drawImageFromUrl(URL.createObjectURL(this.files[0]))
    }
});

window.onload = function() {
    drawGrid();
};

//----------------------------------------------------------------//
//for each circle
var calculateResult = (x,y) => {
    let store = {};
    const imgData = c.getImageData(x, y, radius, radius); //x, y, width, height
    const data = imgData.data;

    const total_pixels = radius * radius;
    const coverage = total_pixels / radius;

    const max_pixel_index = total_pixels - 1;

    for (let i = 0; i < coverage; ++i) {
        const x = getPixelIndex(Math.floor(Math.random() * max_pixel_index));
        const key = `${data[x]},${data[x + 1]},${data[x + 2]}`;
        const val = store[key];
        store[key] = val ? val + 1 : 1;
    }

    const rgb_code = Object.keys(store).reduce((a, b) =>
        store[a] > store[b] ? a : b
    );

    return rgb_code;
};

function splitRGB(str) {
   return str.trim().split(',');
}

function getPixelIndex(numToRound) {
    //Each pixel is 4 units long: r,g,b,a
    const remainder = numToRound % 4;
    if (remainder == 0) return numToRound;
    return numToRound + 4 - remainder;
}

function convert(x,y) {
    var results = [];
    //get colors
    for(let i = 1; i <= amount; i+=2 ){
        for(let j = 1; j <= amount; j+=2 ){
            raw.push(calculateResult(num*j,num*i));
            results.push( calculateResult(num*j,num*i) );
        }
    }
    //reset
    c.clearRect(0, 0, artBoard.width, artBoard.height);
    //draw circles
    for(let i = 0; i < circles.length; i++){
        var circle = new Circle();
        circle.draw(circles[i].x,circles[i].y, `rgb( ${results[i]} )`);
        //add result to circle
        circles[i].fill = results[i];
    }
}


