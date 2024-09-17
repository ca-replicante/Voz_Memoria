let video;
let mic;
let amp;
let threshold = 0.01;  // Umbral para detectar sonido
let videoVisible = false;
let fadeLevel = 255;  // Nivel de desvanecimiento inicial (255 = completamente visible para la imagen)
let fadeSpeed = 5;    // Velocidad de desvanecimiento (ajustada para que sea más suave)
let img;
let videoStarted = false; // Control para saber si el video ha sido activado

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
  
  // Detectar el nivel de volumen del micrófono
  let vol = amp.getLevel();  // Obtener nivel de amplitud del micrófono

  // Detectar si se presiona la tecla 'espacio' y activar el video
  if (keyIsPressed && key === ' ' && !videoStarted) {
    video.loop();  // Reproduce el video en bucle
    videoStarted = true;  // Marcar que el video ya ha sido activado
  }

  // Solo si el video ya ha sido activado, detectar el sonido
  if (videoStarted) {
    if (keyIsPressed && key === ' ' && vol > threshold) {
      videoVisible = true;  // Mostrar el video si el volumen supera el umbral
    } else {
      videoVisible = false;  // Ocultar el video si no hay suficiente sonido
    }

    // Controlar el fade del video e imagen
    if (videoVisible) {
      fadeLevel -= fadeSpeed;  // Reducir el nivel de desvanecimiento para el video
      if (fadeLevel < 0) fadeLevel = 0;  // Evitar que baje de 0 (completamente visible)
    } else {
      fadeLevel += fadeSpeed;  // Aumentar el nivel de desvanecimiento para ocultar el video
      if (fadeLevel > 255) fadeLevel = 255;  // Evitar que supere 255 (completamente visible la imagen)
    }

    // Controlar la opacidad del video y la imagen
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
}
