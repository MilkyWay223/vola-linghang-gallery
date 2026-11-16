let viewerPromise;
let viewerReady = false;
let pendingMode;

function loadViewer() {
  if (!viewerPromise) {
    viewerPromise = import('./viewer-v2.js?v=fast11').catch(error => {
      console.error('VOLA viewer:', error);
      document.querySelector('#loading').hidden = true;
      const notice = document.querySelector('#modelError');
      notice.hidden = false;
      notice.querySelector('p').textContent = '三维程序未能加载。请检查网络后刷新重试。';
      document.querySelector('#retryModel').onclick = () => location.reload();
      throw error;
    });
  }
  return viewerPromise;
}

function activatePendingMode() {
  if (!viewerReady || !pendingMode) return;
  document.querySelector(`[data-mode="${pendingMode}"]`)?.click();
  pendingMode = undefined;
}

document.addEventListener('vola:ready', () => {
  viewerReady = true;
  activatePendingMode();
});

const stage = document.querySelector('#viewport');
const observer = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting) return;
  observer.disconnect();
  loadViewer().catch(() => {});
}, { rootMargin: '250px' });
observer.observe(stage);

document.querySelectorAll('[data-lab-mode]').forEach(link => {
  link.addEventListener('click', () => {
    pendingMode = link.dataset.labMode;
    loadViewer().then(activatePendingMode).catch(() => {});
  });
});

