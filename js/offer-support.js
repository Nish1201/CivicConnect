/**
 * CivicConnect — Partner Support Offer Form Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initSupporterOfferForm();
});

function initSupporterOfferForm() {
  const form = document.getElementById('supporterOfferForm');
  const confirmationBox = document.getElementById('offerConfirmation');
  const resetBtn = document.getElementById('resetOfferFormBtn');
  const backLink = document.getElementById('backLinkSupporter');
  const cancelBtn = document.getElementById('cancelOfferBtn');

  if (!form) return;

  const urlParams = new URLSearchParams(window.location.search);
  const problemId = urlParams.get('id');

  const contextBox = document.getElementById('challengeContextBox');
  const contextTitleEl = document.getElementById('contextProblemTitle');
  const contextLocationEl = document.getElementById('contextProblemLocation');
  const supportTargetInput = document.getElementById('supportTarget');

  if (problemId && typeof SAMPLE_PROBLEMS !== 'undefined') {
    const matchedProblem = SAMPLE_PROBLEMS.find(p => p.id === problemId);
    if (matchedProblem) {
      if (contextBox) contextBox.style.display = 'block';
      if (contextTitleEl) contextTitleEl.textContent = matchedProblem.title;
      if (contextLocationEl) {
        contextLocationEl.textContent = `Location: ${matchedProblem.location} (${matchedProblem.category})`;
      }
      if (supportTargetInput) {
        supportTargetInput.value = `${matchedProblem.title} — ${matchedProblem.location}`;
      }
      if (backLink) {
        backLink.href = `details.html?id=${encodeURIComponent(matchedProblem.id)}`;
        backLink.innerHTML = `<span aria-hidden="true">&larr;</span> Back to Challenge Details`;
      }
      if (cancelBtn) {
        cancelBtn.href = `details.html?id=${encodeURIComponent(matchedProblem.id)}`;
      }
    }
  }

  const otherCb = document.getElementById('supportOfferOther');
  const otherWrap = document.getElementById('supportOfferOtherWrap');
  if (otherCb && otherWrap) {
    otherCb.addEventListener('change', () => {
      otherWrap.style.display = otherCb.checked ? 'block' : 'none';
    });
  }

  function setFieldError(element, errorSpanId, message) {
    const errorSpan = document.getElementById(errorSpanId);
    if (errorSpan) errorSpan.textContent = message;
    const parentGroup = element ? element.closest('.form-group') : null;
    if (parentGroup) parentGroup.classList.add('has-error');
  }

  function clearFieldError(element, errorSpanId) {
    if (errorSpanId) {
      const errorSpan = document.getElementById(errorSpanId);
      if (errorSpan) errorSpan.textContent = '';
    }
    const parentGroup = element ? element.closest('.form-group') : null;
    if (parentGroup) parentGroup.classList.remove('has-error');
  }

  form.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('input', () => {
      const parent = input.closest('.form-group');
      if (parent && parent.classList.contains('has-error')) {
        parent.classList.remove('has-error');
        const err = parent.querySelector('.field-error');
        if (err) err.textContent = '';
      }
    });
    input.addEventListener('change', () => {
      const parent = input.closest('.form-group');
      if (parent && parent.classList.contains('has-error')) {
        parent.classList.remove('has-error');
        const err = parent.querySelector('.field-error');
        if (err) err.textContent = '';
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    let firstInvalid = null;

    const requireText = (id, errorId, msg, minLen) => {
      const el = document.getElementById(id);
      if (!el) return;
      const val = (el.value || '').trim();
      if (val.length < minLen) {
        setFieldError(el, errorId, msg);
        isValid = false;
        if (!firstInvalid) firstInvalid = el;
      } else {
        clearFieldError(el, errorId);
      }
    };

    requireText('supporterName', 'supporterNameError', 'Please enter your name.', 2);
    requireText('supporterRole', 'supporterRoleError', 'Please describe your role or expertise.', 2);

    const emailEl = document.getElementById('supporterEmail');
    if (emailEl) {
      const email = (emailEl.value || '').trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        setFieldError(emailEl, 'supporterEmailError', 'Please enter a valid email address.');
        isValid = false;
        if (!firstInvalid) firstInvalid = emailEl;
      } else {
        clearFieldError(emailEl, 'supporterEmailError');
      }
    }

    requireText('supportCapability', 'supportCapabilityError', 'Please describe the support you can provide.', 10);
    requireText('supportTarget', 'supportTargetError', 'Please specify the challenge or project.', 3);
    requireText('whySupport', 'whySupportError', 'Please explain why you are interested.', 10);
    requireText('offerDescription', 'offerDescriptionError', 'Please describe your offer.', 10);
    requireText('collaborationExpectations', 'collaborationExpectationsError', 'Please share brief collaboration expectations.', 10);

    const checkedTypes = document.querySelectorAll('input[name="supportOfferTypes"]:checked');
    const typesError = document.getElementById('supportOfferTypesError');
    if (checkedTypes.length === 0) {
      if (typesError) typesError.textContent = 'Please select at least one support type.';
      isValid = false;
      if (!firstInvalid) firstInvalid = document.querySelector('input[name="supportOfferTypes"]');
    } else if (typesError) {
      typesError.textContent = '';
    }

    if (otherCb && otherCb.checked) {
      const otherText = document.getElementById('supportOfferOtherText');
      if (otherText && (otherText.value || '').trim().length < 2) {
        setFieldError(otherText, null, 'Please describe the other support type.');
        isValid = false;
        if (!firstInvalid) firstInvalid = otherText;
      }
    }

    const availability = document.getElementById('supporterAvailability');
    if (availability && !availability.value) {
      setFieldError(availability, 'supporterAvailabilityError', 'Please select your availability.');
      isValid = false;
      if (!firstInvalid) firstInvalid = availability;
    } else if (availability) {
      clearFieldError(availability, 'supporterAvailabilityError');
    }

    if (!isValid) {
      if (firstInvalid && typeof firstInvalid.focus === 'function') firstInvalid.focus();
      return;
    }

    form.style.display = 'none';
    if (confirmationBox) {
      confirmationBox.style.display = 'block';
      confirmationBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.querySelectorAll('.form-group.has-error').forEach(g => g.classList.remove('has-error'));
      form.querySelectorAll('.field-error').forEach(err => { err.textContent = ''; });
      if (otherWrap) otherWrap.style.display = 'none';
      form.style.display = 'block';
      if (confirmationBox) confirmationBox.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
