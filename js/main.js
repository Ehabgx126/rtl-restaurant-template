/* =========================================
   قالب ديوان RTL — Restaurant Template
   الملف: js/main.js
   التفاعلات: القائمة، الفلترة، الحركات، النموذج
   ========================================= */

(function () {
  'use strict';

  /* ===== 1) شريط التنقل: خلفية عند التمرير ===== */
  var navbar = document.getElementById('navbar');
  function onScroll() {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ===== 2) قائمة الجوال ===== */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('open');
  });

  // إغلاق القائمة عند اختيار أي رابط (تجربة جوال أفضل)
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
    });
  });

  /* ===== 3) فلترة قائمة الطعام ===== */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var menuCards = document.querySelectorAll('.menu-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // تحديث حالة الأزرار
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');

      menuCards.forEach(function (card) {
        var cat = card.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          // إعادة تشغيل حركة الظهور للعناصر الظاهرة
          card.classList.remove('visible');
          void card.offsetWidth; // إعادة تدفق لتحريك الأنيميشن
          card.classList.add('visible');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ===== 4) ظهور العناصر عند التمرير ===== */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ===== 5) العدّاد الرقمي في قسم Hero ===== */
  var counters = document.querySelectorAll('[data-count]');
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseInt(el.getAttribute('data-count'), 10);
      var duration = 1400;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // تسارع ناعم
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach(function (c) { counterObserver.observe(c); });

  /* ===== 6) نموذج الحجز: تحقق ورسالة نجاح ===== */
  var form = document.getElementById('reservationForm');
  var msg = document.getElementById('formMsg');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('fName');
    var phone = document.getElementById('fPhone');
    var date = document.getElementById('fDate');
    var valid = true;

    // تنظيف حالة الحقول السابقة
    [name, phone, date].forEach(function (f) { f.classList.remove('invalid'); });
    msg.className = 'form-msg';

    if (name.value.trim().length < 3) {
      name.classList.add('invalid');
      valid = false;
    }

    // تحقق بسيط من رقم الجوال: 10 إلى 15 خانة رقمية (يسمح بـ + ومسافات)
    var phoneDigits = phone.value.replace(/\D/g, '');
    if (phoneDigits.length < 9 || phoneDigits.length > 15) {
      phone.classList.add('invalid');
      valid = false;
    }

    if (!date.value) {
      date.classList.add('invalid');
      valid = false;
    }

    if (!valid) {
      msg.textContent = 'يرجى تعبئة الحقول المطلوبة بشكل صحيح (الاسم، الجوال، التاريخ).';
      msg.classList.add('error');
      return;
    }

    /* نقطة الربط مع خدمة الإرسال:
       لجعل النموذج يرسل إلى بريدك فعليًا:
       1) سجّل مجانًا في https://formspree.io وأنشئ نموذجًا
       2) خذ الرابط المكتوب فيه مثل https://formspree.io/f/xxxxxx
       3) استبدل السطر التالي بـ:
          fetch('https://formspree.io/f/xxxxxx', { method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: new FormData(form) });
    */
    msg.textContent = 'تم استلام طلب حجزك بنجاح يا ' + name.value.trim() + '! سيتواصل معك فريق الاستقبال قريبًا لتأكيد الموعد.';
    msg.classList.add('success');
    form.reset();
  });

  /* ===== 7) سنة الحقوق تلقائيًا ===== */
  document.getElementById('year').textContent = new Date().getFullYear();

})();
