let video;
let mic;
let amp;
let threshold = 0.01;  // Umbral para detectar sonido
let videoVisible = false;
let fadeLevel = 255;  // Nivel de desvanecimiento inicial (255 = completamente negro)
let fadeSpeed = 10;   // Velocidad de desvanecimiento
let img;

function preload() {
  // Cargar el video y la imagen
  video = createVideo('assets/video.mp4');
  img = loadImage('assets/fondo.png'); // La imagen que aparecerá cuando no hay sonido
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Configurar el micrófono
  mic = new p5.AudioIn();
  mic.start();
  
  amp = new p5.Amplitude();
  amp.setInput(mic);
  
  video.hide();  // Ocultar controles del video
}

function draw() {
  background(0);
  
  let vol = amp.getLevel();  // Obtener nivel de amplitud del micrófono

  // Si se presiona la tecla 'espacio' y el sonido es mayor que el umbral
  if (keyIsPressed && key === 'r' && vol > threshold) {
    videoVisible = true;
  } else {
    videoVisible = false;
  }

  if (videoVisible) {
    fadeLevel -= fadeSpeed;  // Reduce el nivel de desvanecimiento para mostrar el video
    if (fadeLevel < 0) fadeLevel = 0;  // Asegúrate de que no sea menos de 0 (completamente visible)
  } else {
    fadeLevel += fadeSpeed;  // Aumenta el nivel de desvanecimiento para ocultar el video
    if (fadeLevel > 255) fadeLevel = 255;  // Asegúrate de que no sea más de 255 (completamente negro)
  }

  if (videoVisible) {
    // Mostrar el video cuando haya sonido
    video.volume(map(fadeLevel, 255, 0, 0, 1));  // Ajustar el volumen del video según el nivel de opacidad
    image(video, 0, 0, width, height);
    video.play();
  } else {
    // Mostrar la imagen cuando no hay sonido
    video.pause();
    tint(255, fadeLevel);  // Aplicar desvanecimiento a la imagen
    image(img, 0, 0, width, height);
  }
}
