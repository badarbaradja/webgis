const cursor = document.querySelector('.cursor');
  const trails = [];
  const numTrails = 12;

  for(let i = 0; i < numTrails; i++) {
    const t = document.createElement('div');
    t.classList.add('trail');
    document.body.appendChild(t);
    trails.push({el: t, x: window.innerWidth/2, y: window.innerHeight/2});
  }

  let mouseX = window.innerWidth/2;
  let mouseY = window.innerHeight/2;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';

    trails.forEach((trail, i) => {
      const next = trails[i - 1] || {x: mouseX, y: mouseY};
      trail.x += (next.x - trail.x) * 0.2;
      trail.y += (next.y - trail.y) * 0.2;
      trail.el.style.left = trail.x + 'px';
      trail.el.style.top = trail.y + 'px';
    });

    requestAnimationFrame(animate);
  }

  animate();

  // klik efek: membesar sebentar dan glow lebih terang
  document.addEventListener('mousedown', () => {
    cursor.style.width = '40px';
    cursor.style.height = '40px';
    cursor.style.boxShadow = '0 0 20px #00ffff, 0 0 40px #00ffff88, 0 0 60px #00ffff55';
    setTimeout(() => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursor.style.boxShadow = '0 0 10px #00ffff, 0 0 20px #00ffff55, 0 0 30px #00ffff33';
    }, 200);
  });



const body = document.body;

// ambil warna sesuai attribute
const pageColor = body.dataset.cursor || 'blue'; // default biru
let colorVar;

switch(pageColor) {
  case 'purple': colorVar = getComputedStyle(document.documentElement).getPropertyValue('--color-purple'); break;
  case 'green': colorVar = getComputedStyle(document.documentElement).getPropertyValue('--color-green'); break;
  case 'blue': colorVar = getComputedStyle(document.documentElement).getPropertyValue('--color-blue'); break;
  case 'redorange': colorVar = getComputedStyle(document.documentElement).getPropertyValue('--color-redorange'); break;
  case 'tosca': colorVar = getComputedStyle(document.documentElement).getPropertyValue('--color-tosca'); break;
  default: colorVar = getComputedStyle(document.documentElement).getPropertyValue('--color-blue');
}

// set warna cursor
cursor.style.backgroundColor = colorVar.trim();
cursor.style.boxShadow = `0 0 10px ${colorVar.trim()}, 0 0 20px ${colorVar.trim()}55, 0 0 30px ${colorVar.trim()}33`;
