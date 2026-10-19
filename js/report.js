/**
 * CivicConnect — Report a Problem Logic (js/report.js)
 * Strictly Vanilla JavaScript | Frontend-only client-side validation & Geolocation
 */

document.addEventListener('DOMContentLoaded', () => {
  initReportForm();
});

function initReportForm() {
  const form = document.getElementById('reportProblemForm');
  const confirmationBox = document.getElementById('reportConfirmation');
  const clearFormBtn = document.getElementById('clearFormBtn');
  const resetFormFromSuccessBtn = document.getElementById('resetFormFromSuccessBtn');
  const useLocationBtn = document.getElementById('useMyLocationBtn');
  const locationStatusMsg = document.getElementById('locationStatusMsg');

  if (!form) return;

  const titleInput = document.getElementById('problemTitle');
  const descriptionInput = document.getElementById('problemDescription');
  const locationInput = document.getElementById('problemLocation');
  const categorySelect = document.getElementById('problemCategory');

  // --------------------------------------------------------------------------
  // 1. Browser Geolocation API ("Use My Location")
  // --------------------------------------------------------------------------
  function showLocationStatus(type, message) {
    if (!locationStatusMsg) return;
    locationStatusMsg.className = `location-status-msg location-status-msg--${type}`;
    locationStatusMsg.textContent = message;
    locationStatusMsg.style.display = 'block';
  }

  if (useLocationBtn && locationInput) {
    useLocationBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        showLocationStatus('error', 'Browser geolocation is not supported in this browser.');
        return;
      }

      showLocationStatus('loading', 'Requesting browser location...');
      useLocationBtn.disabled = true;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          useLocationBtn.disabled = false;
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = Math.round(position.coords.accuracy);

          locationInput.value = `Approx. Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)} (±${accuracy}m)`;

          const locGroup = locationInput.closest('.form-group');
          if (locGroup) {
            locGroup.classList.remove('has-error');
            const errEl = locGroup.querySelector('.field-error');
            if (errEl) errEl.textContent = '';
          }

          showLocationStatus('success', `Location detected (${lat.toFixed(4)}, ${lng.toFixed(4)}). You can append a landmark, village, or ward name.`);
        },
        (error) => {
          useLocationBtn.disabled = false;
          let msg = 'Unable to determine your location. Please type your location manually.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              msg = 'Location permission was denied. Please enter your village, neighborhood, or landmark manually.';
              break;
            case error.POSITION_UNAVAILABLE:
              msg = 'Location signal is unavailable. Please enter your location manually.';
              break;
            case error.TIMEOUT:
              msg = 'Location detection timed out. Please enter your location manually.';
              break;
          }
          showLocationStatus('error', msg);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  // --------------------------------------------------------------------------
  // 2. Field Validation Helper
  // --------------------------------------------------------------------------
  function validateField(inputEl, condition, errorMsg) {
    const parentGroup = inputEl.closest('.form-group');
    const errorEl = parentGroup ? parentGroup.querySelector('.field-error') : null;

    if (!condition) {
      if (parentGroup) parentGroup.classList.add('has-error');
      if (errorEl) errorEl.textContent = errorMsg;
      return false;
    } else {
      if (parentGroup) parentGroup.classList.remove('has-error');
      if (errorEl) errorEl.textContent = '';
      return true;
    }
  }

  [titleInput, descriptionInput, locationInput, categorySelect].forEach(el => {
    if (!el) return;
    el.addEventListener('input', () => {
      const parent = el.closest('.form-group');
      if (parent && parent.classList.contains('has-error')) {
        parent.classList.remove('has-error');
        const err = parent.querySelector('.field-error');
        if (err) err.textContent = '';
      }
    });
    el.addEventListener('change', () => {
      const parent = el.closest('.form-group');
      if (parent && parent.classList.contains('has-error')) {
        parent.classList.remove('has-error');
        const err = parent.querySelector('.field-error');
        if (err) err.textContent = '';
      }
    });
  });

  // --------------------------------------------------------------------------
  // 3. Supporting Evidence File Input Preview (Frontend-only)
  // --------------------------------------------------------------------------
  const evidenceInput = document.getElementById('supportingEvidenceInput');
  const evidencePreviewWrap = document.getElementById('evidencePreviewWrap');
  const evidenceFileName = document.getElementById('evidenceFileName');
  const removeEvidenceBtn = document.getElementById('removeEvidenceBtn');

  if (evidenceInput && evidencePreviewWrap && evidenceFileName) {
    evidenceInput.addEventListener('change', () => {
      if (evidenceInput.files && evidenceInput.files.length > 0) {
        const file = evidenceInput.files[0];
        evidenceFileName.textContent = `Selected: ${file.name}`;
        evidencePreviewWrap.style.display = 'block';
      } else {
        evidencePreviewWrap.style.display = 'none';
        evidenceFileName.textContent = '';
      }
    });

    if (removeEvidenceBtn) {
      removeEvidenceBtn.addEventListener('click', () => {
        evidenceInput.value = '';
        evidencePreviewWrap.style.display = 'none';
        evidenceFileName.textContent = '';
      });
    }
  }

  // --------------------------------------------------------------------------
  // 4. Form Submit Handler
  // --------------------------------------------------------------------------
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let firstInvalid = null;

    const titleVal = (titleInput.value || '').trim();
    const isTitleValid = validateField(
      titleInput,
      titleVal.length >= 5,
      'Please enter a short title describing the problem (at least 5 characters).'
    );
    if (!isTitleValid && !firstInvalid) firstInvalid = titleInput;

    const descVal = (descriptionInput.value || '').trim();
    const isDescValid = validateField(
      descriptionInput,
      descVal.length >= 15,
      'Please explain what is happening in a few sentences (at least 15 characters).'
    );
    if (!isDescValid && !firstInvalid) firstInvalid = descriptionInput;

    const locVal = (locationInput.value || '').trim();
    const isLocValid = validateField(
      locationInput,
      locVal.length >= 3,
      'Please provide an example village, town, ward, or landmark.'
    );
    if (!isLocValid && !firstInvalid) firstInvalid = locationInput;

    const catVal = categorySelect.value;
    const isCatValid = validateField(
      categorySelect,
      catVal && catVal !== '' && catVal !== 'select',
      'Please choose a broad category (select "Not sure" if you are uncertain).'
    );
    if (!isCatValid && !firstInvalid) firstInvalid = categorySelect;

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    form.style.display = 'none';
    if (confirmationBox) {
      confirmationBox.style.display = 'block';
      confirmationBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  // --------------------------------------------------------------------------
  // 5. Form Reset
  // --------------------------------------------------------------------------
  function resetForm() {
    form.reset();
    document.querySelectorAll('.form-group.has-error').forEach(group => {
      group.classList.remove('has-error');
    });
    if (locationStatusMsg) {
      locationStatusMsg.style.display = 'none';
      locationStatusMsg.textContent = '';
    }
    if (evidencePreviewWrap) {
      evidencePreviewWrap.style.display = 'none';
      if (evidenceFileName) evidenceFileName.textContent = '';
    }
    if (confirmationBox) confirmationBox.style.display = 'none';
    form.style.display = 'block';
    titleInput.focus();
  }

  if (clearFormBtn) {
    clearFormBtn.addEventListener('click', resetForm);
  }

  if (resetFormFromSuccessBtn) {
    resetFormFromSuccessBtn.addEventListener('click', resetForm);
  }
}
