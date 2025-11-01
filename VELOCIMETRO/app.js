// ===== Configurações Gerais =====
const APP_VERSION = "1.0.0";
document.getElementById("version").textContent = `Versão ${APP_VERSION}`;

// ===== Registrar Service Worker =====
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./service-worker.js", { scope: "./" })
    .then(() => console.log("✅ Service Worker registrado"))
    .catch((err) => console.error("Erro SW:", err));
}

// ===== Forçar Prompt Automático de Instalação =====
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log("💡 PWA pronto para instalação");

  // Espera 2 segundos e mostra o prompt automaticamente
  setTimeout(() => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice) => {
        console.log("📲 Escolha do usuário:", choice.outcome);
        if (choice.outcome === "accepted") {
          console.log("✅ App instalado com sucesso!");
        }
        deferredPrompt = null;
      });
    }
  }, 2000);
});

window.addEventListener("appinstalled", () => {
  console.log("📲 Aplicativo instalado!");
});

// ===== Lógica do Velocímetro =====
const c = document.getElementById("gauge");
const ctx = c.getContext("2d");
const speedValue = document.getElementById("speedValue");
const status = document.getElementById("status");

let running = false, target = 0, x = 0, v = 0;
const MAX = 200, STIFF = 16, DAMP = 8;

function drawBg() {
  const w = c.width, h = c.height, cx = w / 2, cy = h * 0.9, r = w * 0.38;
  ctx.clearRect(0, 0, w, h);
  ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 12; ctx.stroke();
}

function drawNeedle(speed) {
  const w = c.width, h = c.height, cx = w / 2, cy = h * 0.9, r = w * 0.38;
  const a = Math.PI + Math.min(speed / MAX, 1) * Math.PI;
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#06b6d4");
  grad.addColorStop(1, "#60a5fa");
  ctx.beginPath(); ctx.strokeStyle = grad; ctx.lineWidth = 8;
  ctx.arc(cx, cy, r - 6, Math.PI, a); ctx.stroke();
  const nx = cx + Math.cos(a) * (r - 40), ny = cy + Math.sin(a) * (r - 40);
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, ny);
  ctx.strokeStyle = "#ff6b6b"; ctx.lineWidth = 3; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff"; ctx.fill();
}

function anim() {
  if (!running) return;
  const dt = 0.016;
  const a = STIFF * (target - x) - DAMP * v;
  v += a * dt; x += v * dt;
  drawBg(); drawNeedle(x);
  speedValue.textContent = Math.round(x);
  requestAnimationFrame(anim);
}

function start() {
  if (running) return;
  running = true; requestAnimationFrame(anim);
  if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(
      (pos) => {
        target = Math.min((pos.coords.speed || 0) * 3.6, MAX);
        status.textContent = "Atualizado";
      },
      (err) => (status.textContent = "Erro: " + err.message),
      { enableHighAccuracy: true }
    );
  }
}

function stop() {
  running = false;
  drawBg(); drawNeedle(0);
  speedValue.textContent = "0";
  status.textContent = "Parado";
}

drawBg(); drawNeedle(0);
document.getElementById("startBtn").onclick = start;
document.getElementById("stopBtn").onclick = stop;
