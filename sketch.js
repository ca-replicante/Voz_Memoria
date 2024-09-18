let mic;
let amp;
let threshold = 0.01;  // Umbral para detectar sonido
let imgFondo;
let imgCurrent;  // Imagen actual que se muestra
let imgArray = [];  // Array para almacenar las imágenes de la carpeta
let fadeLevel = 255;  // Nivel de desvanecimiento inicial (255 = completamente visible para la imagen fondo)
let fadeSpeed = 5;  // Velocidad de desvanecimiento
let imgChangeDelay = 2000;  // Tiempo mínimo de visualización de cada imagen (3 segundos)
let lastImageChange = 0;  // Momento en que se cambió la imagen por última vez
let imgVisible = false;
let imgStarted = false;  // Control para saber si el sonido ha activado la visualización de imágenes
let currentImageIndex = -1;  // Índice de la imagen actual
let audioStarted = false;  // Control para saber si el AudioContext ha sido iniciado
let holdingImage = false;  // Control para mantener la imagen visible por 3 segundos
let soundActive = false;  // Saber si el sonido está activo o no

function preload() {
  // Cargar la imagen de fondo y todas las imágenes de la carpeta
  imgFondo = loadImage('assets/fondo.png');
  
  // Aquí asumimos que las imágenes tienen el nombre "imagen1.png", "imagen2.png", etc.
  for (let i = 1; i <= 3; i++) {  // Cambia el número según la cantidad de imágenes que tengas
    imgArray.push(loadImage(`assets/imagenes/imagen${i}.png`));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255);

  // Mostrar mensaje para que el usuario presione una tecla
  text("Presiona cualquier tecla para iniciar", width / 2, height / 2);
}

function draw() {
  background(0);
  
  if (!audioStarted) {
    // Mostrar mensaje si el audio no ha sido iniciado
    text("Presiona la barra espaciadora para iniciar el micrófono", width / 2, height / 2);
    return;  // Salir de draw hasta que el audio sea iniciado
  }

  // Detectar el nivel de volumen del micrófono
  let vol = amp.getLevel();
  
  // Detectar si se presiona la tecla 'espacio'
  if (keyIsPressed && key === ' ' && vol > threshold) {
    imgVisible = true;  // Mostrar una imagen de la carpeta si el volumen supera el umbral
    
    if (millis() - lastImageChange >= imgChangeDelay) {
      // Cambiar a una nueva imagen aleatoria cada 3 segundos si se sigue recibiendo audio
      currentImageIndex = int(random(imgArray.length));  // Seleccionar una imagen aleatoria
      imgCurrent = imgArray[currentImageIndex];  // Establecer la imagen actual
      lastImageChange = millis();  // Reiniciar el tiempo de cambio
    }

    holdingImage = true;  // Mantener la imagen visible
    soundActive = true;  // Indicar que el sonido está activo
  } else if (millis() - lastImageChange >= imgChangeDelay) {
    soundActive = false;  // Si pasan 3 segundos, el sonido ya no está activo
  }

  // Mantener la imagen visible por 3 segundos mínimo
  if (holdingImage && millis() - lastImageChange < imgChangeDelay) {
    imgVisible = true;  // Forzar que la imagen se mantenga visible
  } else if (millis() - lastImageChange >= imgChangeDelay && !keyIsPressed) {
    holdingImage = false;  // Permitir que la lógica normal de cambio de imagen vuelva a funcionar
    imgVisible = false;  // Desactivar la imagen para mostrar la imagen de fondo
  }

  // Controlar el fade de las imágenes
  if (imgVisible) {
    fadeLevel -= fadeSpeed;  // Reducir el nivel de desvanecimiento para mostrar las imágenes
    if (fadeLevel < 0) fadeLevel = 0;
    
    tint(255, 255 - fadeLevel);  // Aplicar fade inverso (opacidad a la imagen actual)
    image(imgCurrent, 0, 0, width, height);  // Mostrar la imagen actual
    
  } else {
    fadeLevel += fadeSpeed;  // Aumentar el nivel de desvanecimiento para ocultar la imagen
    if (fadeLevel > 255) fadeLevel = 255;
    
    tint(255, fadeLevel);  // Aplicar fade a la imagen de fondo
    image(imgFondo, 0, 0, width, height);  // Mostrar la imagen de fondo
    imgStarted = false;  // Reiniciar el control de la imagen al volver al fondo
  }
}

function keyPressed() {
  // Iniciar el micrófono y el AudioContext cuando el usuario presiona la barra espaciadora
  if (!audioStarted && key === ' ') {
    mic = new p5.AudioIn();
    mic.start();
    
    amp = new p5.Amplitude();
    amp.setInput(mic);
    
    audioStarted = true;  // Marcar que el AudioContext ha sido iniciado
  }
}
