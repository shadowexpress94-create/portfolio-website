/* contact.js - form validation.
   Rules from the brief: no field is empty, the email format is valid,
   and the phone number contains only digits. */

(function () {
  'use strict';

  var form = document.getElementById('contactForm');
  var fields = {
    name: document.getElementById('cName'),
    email: document.getElementById('cEmail'),
    phone: document.getElementById('cPhone'),
    msg: document.getElementById('cMsg')
  };

  // each rule returns an error message, or '' when the value is fine
  var rules = {
    name: function (v) {
      if (v.trim() === '') { return 'Name is required.'; }
      return v.trim().length < 2 ? 'Enter your full name.' : '';
    },
    email: function (v) {
      if (v.trim() === '') { return 'Email address is required.'; }
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email, like name@example.com.';
    },
    phone: function (v) {
      if (v.trim() === '') { return 'Phone number is required.'; }
      return /^\d+$/.test(v.trim()) ? '' : 'Use digits only: no spaces, plus sign or dashes.';
    },
    msg: function (v) {
      if (v.trim() === '') { return 'Message is required.'; }
      return v.trim().length < 20 ? 'Write at least 20 characters so I know how to help.' : '';
    }
  };

  function check(key) {
    var field = document.getElementById('c-' + key);
    var message = rules[key](fields[key].value);
    field.classList.toggle('bad', message !== '');
    field.classList.toggle('good', message === '');
    field.querySelector('.err').textContent = message;
    fields[key].setAttribute('aria-invalid', message !== '' ? 'true' : 'false');
    return message === '';
  }

  Object.keys(fields).forEach(function (key) {
    fields[key].addEventListener('blur', function () { check(key); });
    fields[key].addEventListener('input', function () {
      var f = document.getElementById('c-' + key);
      if (f.classList.contains('bad') || f.classList.contains('good')) { check(key); }
    });
  });

  fields.msg.addEventListener('input', function () {
    document.getElementById('cCount').textContent = fields.msg.value.length + ' / 600';
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var okBox = document.getElementById('okBox');
    var firstBad = null;
    Object.keys(fields).forEach(function (key) {
      if (!check(key) && !firstBad) { firstBad = key; }
    });
    if (firstBad) {
      okBox.classList.remove('on');
      fields[firstBad].focus();
      return;
    }
    okBox.classList.add('on');
    form.reset();
    document.getElementById('cCount').textContent = '0 / 600';
    Array.prototype.forEach.call(form.querySelectorAll('.field'), function (f) { f.classList.remove('good', 'bad'); });
  });

  var copyBtn = document.getElementById('copyMail');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var address = 'y.yusuf6179@miva.edu.ng';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(address).then(
          function () { window.YY.toast('Email copied'); },
          function () { window.YY.toast('Select the email and copy it'); }
        );
      } else {
        window.YY.toast('Select the email and copy it');
      }
    });
  }
})();
