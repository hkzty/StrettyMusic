(function () {
  var buttons = document.querySelectorAll('.stack-btn');
  var center = document.getElementById('floating-center');

  function setMode(mode) {
    document.body.classList.remove('mode-1', 'mode-2', 'mode-3');
    document.body.classList.add(mode);
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setMode(btn.getAttribute('data-mode'));
    });
  });

  setMode('mode-3');

  function animateFloating() {
    if (!center) return;
    var rect = center.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    var progress = Math.max(-1, Math.min(1, (vh / 2 - rect.top) / vh));
    center.style.setProperty('--tilt', (progress * 8).toFixed(2) + 'deg');
    center.style.setProperty('--lift', (Math.abs(progress) * 16).toFixed(0) + 'px');
  }

  window.addEventListener('scroll', animateFloating, { passive: true });
  animateFloating();
})();
