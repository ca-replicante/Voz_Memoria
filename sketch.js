let video;
let mic;
let amp;
let threshold = 0.01;  // Umbral para detectar sonido
let videoVisible = false;
let fadeLevel = 255;  // Nivel de desvanecimiento inicial (255 = completamente visible para la imagen)
let fadeSpeed = 5;    // Velocidad de desvanecimiento (ajustada para que sea más suave)
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
  video.loop();  // Reproduce el video en bucle
}

function draw() {
  background(0);
  
  let vol = amp.getLevel();  // Obtener nivel de amplitud del micrófono

  // Si se presiona la tecla 'espacio' y el sonido es mayor que el umbral
  if (keyIsPressed && key === ' ' && vol > threshold) {
    videoVisible = true;
  } else {
    videoVisible = false;
  }

  if (videoVisible) {
    // Aparecer el video suavemente
    fadeLevel -= fadeSpeed;  // Reduce el nivel de desvanecimiento
    if (fadeLevel < 0) fadeLevel = 0;  // Asegurarse de que no baje de 0 (completamente visible)
  } else {
    // Aparecer la imagen suavemente
    fadeLevel += fadeSpeed;  // Aumenta el nivel de desvanecimiento para ocultar el video
    if (fadeLevel > 255) fadeLevel = 255;  // Asegurarse de que no supere 255 (completamente visible la imagen)
  }

  // Controlar la opacidad del video
  if (videoVisible) {
    video.volume(map(fadeLevel, 255, 0, 0, 1));  // Ajustar el volumen del video según el fade
    tint(255, 255 - fadeLevel);  // Aplicar fade al video (inverso de la imagen)
    image(video, 0, 0, width, height);
    video.play();  // Asegurarse de que el video se esté reproduciendo
  } else {
    video.pause();  // Pausar el video cuando no hay sonido
    tint(255, fadeLevel);  // Aplicar fade a la imagen
    image(img, 0, 0, width, height);
  }
}
