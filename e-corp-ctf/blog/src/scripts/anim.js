const canvasWidth = 800;
const canvasHeight = 600;
const myCanvas = new canvas(canvasWidth, canvasHeight, 'main');
const starfield = new starfield3D(myCanvas, 1000, 0.5, canvasWidth, canvasHeight,
  canvasWidth / 2, canvasHeight / 2, '#FFFFFF ', 120, 0, 0);

function animLoop() {
  myCanvas.fill('#000000');
  starfield.draw();

  requestAnimFrame(animLoop);
}

window.addEventListener('load', () => {
  animLoop();

  window.setInterval(() => {
    const cursorEls = document.getElementsByClassName('blink');
    for (let i = 0; i < cursorEls.length; i++) {
      const cursorEl = cursorEls[i];
      cursorEl.style.visibility = (cursorEl.style.visibility == 'hidden') ? 'visible' : 'hidden';
    }
  }, 400);
});