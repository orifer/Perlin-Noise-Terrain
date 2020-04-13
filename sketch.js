// Code by Oriol Fernandez // https://github.com/DIVIIK
// Thanks to Daniel Shiffman

let cols,rows;
let scl = 20;
let w = 2300;
let h = 1200;
let fly = 0;
let terrain = [];

let bckColor, terrainColor, wireColor, sclSlider, speedSlider, strengthSlider1, strengthSlider2, toggleWireframe = true;

let inconsolata;
function preload() {
  inconsolata = loadFont('assets/inconsolata.otf');
}

function setup() {
  // Canvas
  createCanvas(windowWidth-4, windowHeight-4, WEBGL); // Here because of performance
  textFont(inconsolata);
  textSize(20);

  // Define nested array
  for (let i = 0; i < 400; i++) // 400(rows) is the max
    terrain[i] = [];

  // UI
  bckColor = createColorPicker('#2B2B2B');
  bckColor.position(10, 10);

  wireColor = createColorPicker('#005069');
  wireColor.position(10, 50);

  terrainColor = createColorPicker('#0082A9');
  terrainColor.position(10, 90);

  button = createButton('Toggle wireframe');
  button.position(10, 130);
  button.mousePressed(wireframeAction);

  sclSlider = createSlider(10, 100, 40);
  sclSlider.position(400, 10);

  speedSlider = createSlider(-0.4, 0.4, 0.1,0.01);
  speedSlider.position(400, 50);

  strengthSlider1 = createSlider(0, 400, 200);
  strengthSlider1.position(700, 10);

  strengthSlider2 = createSlider(0.001, 0.5, 0.1,0.001);
  strengthSlider2.position(700, 50);
}

function draw() {
  let fps = frameRate();

  // Terrain
  w = windowWidth*2;
  h = windowHeight*2;
  cols = w / scl;
  rows = h / scl;
  scl = sclSlider.value();

  // Scene
  background(bckColor.color());

  // UI
  fill(255);
  text('Background color', -width/2+70, -height/2+30);
  text('Wire color', -width/2+70, -height/2+70);
  text('Terrain color', -width/2+70, -height/2+110);
  text('Scale', -width/2+340, -height/2+30);
  text('Speed', -width/2+340, -height/2+70);
  text('Strenght1', -width/2+600, -height/2+30);
  text('Strenght2', -width/2+600, -height/2+70);
  text('Oriol Fernandez Briones | github.com/diviik', -width/2, height/2-1);
  text("FPS: " + fps.toFixed(2),width/2-150, -height/2+30);
  text("Vertex: " + round(((rows-1)*cols)*2),width/2-150, -height/2+60);

  // Terrain colors
  if (toggleWireframe) {
    noFill();
  } else {
    fill(terrainColor.color());
  }
  stroke(wireColor.color());

  // Scene position
  translate(-windowWidth,-windowHeight/2);
  rotateX(PI/3);
  translate(0,-1100,-400);

  fly -= speedSlider.value(); // Fly speed

  // Perlin noise generation
  let yoff = fly;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff,yoff),0,1,-strengthSlider1.value(),strengthSlider1.value());
      xoff += strengthSlider2.value();
    }
    yoff += strengthSlider2.value();
  }

  // Terrain vertex generation
  for (let y = 0; y < rows-1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < cols; x++) {
      vertex(x*scl,y*scl, terrain[x][y]);
      vertex(x*scl,(y+1)*scl,terrain[x][y+1]);
    }
    endShape();
  }
}

function wireframeAction() {
  toggleWireframe = !toggleWireframe;
}
