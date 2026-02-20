(function () {
  var intro = document.getElementById('logo-intro');
  var skip = document.getElementById('skip-intro');

  if (!intro) return;

  function closeIntro() {
    intro.classList.add('done');
    document.body.classList.add('intro-finished');
    setTimeout(function () {
      if (intro && intro.parentNode) {
        intro.parentNode.removeChild(intro);
      }
    }, 1400);
  }

  if (skip) {
    skip.addEventListener('click', closeIntro);
  }

  setTimeout(closeIntro, 4200);
})();
