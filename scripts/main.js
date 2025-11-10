// Main JavaScript controlling visual background, simple Three.js scene and interactions
// No external build required — uses CDN three.min.js and gsap loaded in index.html

// Subtle WebAudio intro tone (generated programmatically)
(function playIntroTone(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 220;
    g.gain.value = 0.0001;
    o.connect(g); g.connect(ctx.destination); o.start();
    // ramp up and fade
    g.gain.exponentialRampToValueAtTime(0.02, ctx.currentTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 2.0);
    setTimeout(()=>{ o.stop(); ctx.close(); }, 2100);
  }catch(e){console.log('Audio init failed', e)}
})();

// Canvas background: floating particles + parallax using three.js
(function bgScene(){
  const canvas = document.getElementById('bgCanvas');
  canvas.width = innerWidth; canvas.height = innerHeight;
  const renderer = new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true});
  renderer.setSize(innerWidth, innerHeight);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, innerWidth/innerHeight, 0.1, 1000);
  camera.position.z = 30;
  // particles
  const geom = new THREE.BufferGeometry();
  const count = 1200;
  const positions = new Float32Array(count * 3);
  for(let i=0;i<count*3;i++){ positions[i] = (Math.random()-0.5) * 120; }
  geom.setAttribute('position', new THREE.BufferAttribute(positions,3));
  const material = new THREE.PointsMaterial({size:0.6,color:0x00aeefff,transparent:true,opacity:0.85});
  const points = new THREE.Points(geom, material);
  scene.add(points);
  // subtle rotation
  function animate(){
    points.rotation.y += 0.0008;
    points.rotation.x += 0.0003;
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
  }
  animate();

  // responsive
  window.addEventListener('resize', ()=>{ renderer.setSize(innerWidth,innerHeight); camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); });
})();

// Wireframe 3D mock in About section (simple rotating wireframe box to evoke a site wireframe)
(function wireframeMock(){
  const wrap = document.getElementById('wireframe3d');
  const w = wrap.clientWidth || 480;
  const h = Math.max(300, window.innerHeight*0.35);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, w/h, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setSize(w,h); wrap.appendChild(renderer.domElement);
  camera.position.z = 5;
  const geo = new THREE.BoxGeometry(2.6,1.6,0.2);
  const mat = new THREE.MeshBasicMaterial({color:0xffffff,wireframe:true,opacity:0.9});
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
  function tick(){ mesh.rotation.y += 0.008; mesh.rotation.x += 0.004; renderer.render(scene,camera); requestAnimationFrame(tick); }
  tick();
  window.addEventListener('resize', ()=>{});
})();