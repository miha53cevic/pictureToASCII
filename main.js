class Pixel {
    constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}

function getASCIISymbol(greyShade) {
    if (greyShade >= 230)
        return " ";
    else if (greyShade >= 205)
        return ".";
    else if (greyShade >= 190)
        return "-";
    else if (greyShade >= 165)
        return ":";
    else if (greyShade >= 140)
        return "=";
    else if (greyShade >= 115)
        return "+";
    else if (greyShade >= 90)
        return "x";
    else if (greyShade >= 65)
        return "#";
    else if (greyShade >= 40)
        return "%";
    else if (greyShade >= 0)
        return "@";
}

function getCOORD(x, y, width) {
    return (y * width) + x;
}

function grayScale(pixels, imgWidth, imgHeight) {
    /*
     * The greyscale value is calculated according to
     * the following formula
     * GREY = 0.299 * RED + 0.587 * GREEN + 0.114 * BLUE
     * For more information see http://en.wikipedia.org/wiki/Grayscale
     */
    const redPart = 0.299;
    const greenPart = 0.587;
    const bluePart = 0.114;

    // ascii version of the picture storead as a string
    let asciiPicture = "";

    for (let i = 0; i < imgHeight; i++) {
        for (let j = 0; j < imgWidth; j++) {
            let pixel = pixels[getCOORD(j, i, imgWidth)];

            let greyShade = redPart * pixel.r + greenPart * pixel.g + bluePart * pixel.b;

            asciiPicture += getASCIISymbol(greyShade);
        }

        asciiPicture += "\n";
    }

    return asciiPicture;
}

function grayScaleGroup(pixels, imgWidth, imgHeight, Width) {
    /*
     * The greyscale value is calculated according to
     * the following formula
     * GREY = 0.299 * RED + 0.587 * GREEN + 0.114 * BLUE
     * For more information see http://en.wikipedia.org/wiki/Grayscale
     */
    const redPart = 0.299;
    const greenPart = 0.587;
    const bluePart = 0.114;

    let asciiPicture = "";

    let ValueHolder = [];

    for (let i = 0; i < parseInt((imgHeight / Width).toString()); i++) {
        for (let j = 0; j < parseInt((imgWidth / Width).toString()); j++) {

            for (let k = 0; k < Width; k++) {
                for (let l = 0; l < Width; l++) {
                    //Gleda sve piksele desno i ispod toga piksela koji je pocetni
                    let pixelColor = pixels[getCOORD(j * Width + k, i * Width + l, imgWidth)];

                    let greyShade = redPart * pixelColor.r + greenPart * pixelColor.g + bluePart * pixelColor.b;

                    ValueHolder.push(greyShade);
                }
            }

            let sum = 0;

            for (let i of ValueHolder) {
                sum += i;
            }

            greyShade = sum / ValueHolder.length;
            ValueHolder = [];

            asciiPicture += getASCIISymbol(greyShade);
        }

        asciiPicture += "\n";
    }

    return asciiPicture;
}

function getPixelArray(img) {
    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    let ctx = canvas.getContext('2d');

    // DEBUG: Draw fullsize picture 
    //document.body.appendChild(canvas);
    ctx.drawImage(img, 0, 0);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let pixels = [];

    for (let i = 0; i < imageData.length; i += 4) {
        pixels.push(new Pixel(imageData[i], imageData[i + 1], imageData[i + 2], imageData[i + 3]));
    }

    return pixels;
}

function init() {

    let pixels = [];

    let img = document.getElementById('userImage');

    // Input by local Picture
    let userInput = document.getElementById('imageInput').addEventListener('change', function (e) {

        // Potrebno jer javascript inace ne ceka da se slika prenese na img.src
        img.onload = function () {

            pixels = getPixelArray(img);
    
            document.getElementById('asciiArea').textContent = grayScaleGroup(pixels, img.width, img.height, Grouping);
    
            // Fit content za text area and make it visible
            document.getElementById('asciiArea').style.width = (img.width * fontSize / Grouping * 0.75).toString() + 'px';
            document.getElementById('asciiArea').style.height = (img.height * fontSize / Grouping).toString() + 'px';
            document.getElementById('asciiArea').style.visibility = 'visible';
    
            // Stavi da je preview manji od cijele slike nakon što se pošalje cijela slika
            img.style.width = '200px';
            img.style.height = '200px';
        }

        img.src = URL.createObjectURL(e.target.files[0]);

        // Clear previous asciiArt if it exists
        document.getElementById('asciiArea').textContent = null;
        pixels = [];

        // Reset width and height to auto so the new picture isn't 200x200
        img.style.width = 'auto';
        img.style.height = 'auto';

        // Get current options
        options();
    })

    // Input by URL
    let urlInput = document.getElementById('submit').addEventListener('click', function () {

        // Prvo se stavlja handler onda se mjenja slika tako da event nebi prosel
        // Potrebno jer javascript inace ne ceka da se slika prenese na img.src
        img.onload = function () {
            pixels = getPixelArray(img);
    
            document.getElementById('asciiArea').textContent = grayScaleGroup(pixels, img.width, img.height, Grouping);
    
            // Fit content za text area and make it visible
            document.getElementById('asciiArea').style.width = (img.width * fontSize / Grouping).toString() + 'px';
            document.getElementById('asciiArea').style.height = (img.height * fontSize / Grouping).toString() + 'px';
            document.getElementById('asciiArea').style.visibility = 'visible';
    
            // Stavi da je preview manji od cijele slike nakon što se pošalje cijela slika
            img.style.width = '200px';
            img.style.height = '200px';
        }
    
        img.src = document.getElementById('url').value;

        // Clear previous asciiArt if it exists
        document.getElementById('asciiArea').textContent = null;
        pixels = [];

        // Reset width and height to auto so the new picture isn't 200x200
        img.style.width = 'auto';
        img.style.height = 'auto';

        // Get current options
        options();
    })
}

function NavBarSetup () {
    let fromFile = document.getElementById('pictureInput');
    let fromURL = document.getElementById('urlInput');

    // Nav bar event handler
    document.getElementById('fromFile').addEventListener('click', function() {
        fromFile.style.display = 'block';
        fromURL.style.display = 'none';
    })
    document.getElementById('fromURL').addEventListener('click', function() {
        fromFile.style.display = 'none';
        fromURL.style.display = 'block';
    })
}

window.onload = function() {
    NavBarSetup();
    init();
};