(function () {
  var sw = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty('--scrollbar-width', sw + 'px');
})();

// Odometer effect — each digit is a vertical strip 0-9 that scrolls to the target
function odometerCounter(el, finalText) {
  var chars = finalText.split('');
  el.innerHTML = '';
  el.style.display = 'inline-flex';
  el.style.alignItems = 'flex-start';

  var columns = [];

  chars.forEach(function (ch) {
    if (/[0-9]/.test(ch)) {
      var col = document.createElement('span');
      col.style.cssText = 'display:inline-block;overflow:hidden;height:1em;line-height:1;';

      var inner = document.createElement('span');
      inner.style.cssText = 'display:flex;flex-direction:column;will-change:transform;';

      for (var d = 0; d <= 9; d++) {
        var digit = document.createElement('span');
        digit.style.cssText = 'display:block;height:1em;line-height:1;';
        digit.textContent = d;
        inner.appendChild(digit);
      }

      col.appendChild(inner);
      el.appendChild(col);
      columns.push({ inner: inner, target: parseInt(ch, 10) });
    } else {
      var plain = document.createElement('span');
      plain.style.cssText = 'display:inline-block;';
      plain.textContent = ch;
      el.appendChild(plain);
    }
  });

  // Stagger columns left-to-right
  columns.forEach(function (col, idx) {
    setTimeout(function () {
      col.inner.style.transition = 'transform 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      col.inner.style.transform = 'translateY(-' + col.target + 'em)';
    }, idx * 150 + 80);
  });
}

if ('IntersectionObserver' in window) {
  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      statsObserver.unobserve(entry.target);
      entry.target.querySelectorAll('.stats__number[data-target]').forEach(function (el) {
        odometerCounter(el, el.dataset.target + (el.dataset.suffix || ''));
      });
    });
  }, { threshold: 0.3 });

  var statsSection = document.querySelector('.stats');
  if (statsSection) statsObserver.observe(statsSection);
}

document.addEventListener('DOMContentLoaded', function () {
  var navbar = document.querySelector('.navbar');
  var toggle = document.querySelector('.navbar__toggle');

  if (navbar && toggle) {
    toggle.addEventListener('click', function () {
      var isOpen = navbar.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  document.querySelectorAll('.navbar__dropdown > a').forEach(function (link) {
    var caret = link.querySelector('.navbar__caret');
    if (!caret) return;

    caret.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      link.parentElement.classList.toggle('is-open');
    });
  });
});
