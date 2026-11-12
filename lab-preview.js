document.querySelectorAll('[data-lab-mode]').forEach(link => {
  link.addEventListener('click', () => {
    const mode = link.dataset.labMode;
    document.querySelector(`[data-mode="${mode}"]`)?.click();
  });
});
