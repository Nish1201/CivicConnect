/**
 * CivicConnect — Student Solution Proposal Logic (js/student-request.js)
 * Strictly Vanilla JavaScript | Frontend-only validation
 */

document.addEventListener('DOMContentLoaded', () => {
  initStudentRequestForm();
});

function initStudentRequestForm() {
  const form = document.getElementById('studentRequestForm');
  const confirmationBox = document.getElementById('requestConfirmation');
  const resetBtn = document.getElementById('resetRequestFormBtn');
  const backLink = document.getElementById('backLink');
  const cancelBtn = document.getElementById('cancelRequestBtn');

  if (!form) return;

  // --------------------------------------------------------------------------
  // 1. URL ?id= challenge prefill
  // --------------------------------------------------------------------------
  const urlParams = new URLSearchParams(window.location.search);
  const problemId = urlParams.get('id');

  const contextBox = document.getElementById('challengeContextBox');
  const contextTitleEl = document.getElementById('contextProblemTitle');
  const contextLocationEl = document.getElementById('contextProblemLocation');
  const challengeTopicInput = document.getElementById('challengeTopic');

  if (problemId && typeof SAMPLE_PROBLEMS !== 'undefined') {
    const matchedProblem = SAMPLE_PROBLEMS.find(p => p.id === problemId);
    if (matchedProblem) {
      if (contextBox) contextBox.style.display = 'block';
      if (contextTitleEl) contextTitleEl.textContent = matchedProblem.title;
      if (contextLocationEl) {
        contextLocationEl.textContent = `Location: ${matchedProblem.location} (${matchedProblem.category})`;
      }
      if (challengeTopicInput) {
        challengeTopicInput.value = `${matchedProblem.title} — ${matchedProblem.location}`;
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

  // --------------------------------------------------------------------------
  // 2. Supporting materials file list (UI only)
  // --------------------------------------------------------------------------
  const materialsInput = document.getElementById('supportingMaterialsInput');
  const materialsFileList = document.getElementById('materialsFileList');

  function renderMaterialsList() {
    if (!materialsFileList || !materialsInput) return;
    materialsFileList.innerHTML = '';
    if (!materialsInput.files || materialsInput.files.length === 0) return;

    Array.from(materialsInput.files).forEach((file) => {
      const li = document.createElement('li');
      li.className = 'file-list__item';
      const sizeKb = Math.max(1, Math.round(file.size / 1024));
      li.innerHTML = `<span>${file.name}</span><span class="form-helper">${sizeKb} KB</span>`;
      materialsFileList.appendChild(li);
    });
  }

  if (materialsInput) {
    materialsInput.addEventListener('change', renderMaterialsList);
  }

  // --------------------------------------------------------------------------
  // 3. Show "Other" support text when Other is checked
  // --------------------------------------------------------------------------
  const supportOtherWrap = document.getElementById('supportOtherWrap');
  const supportNeededOther = document.getElementById('supportNeededOther');
  const supportOtherText = document.getElementById('supportOtherText');

  function updateSupportOtherVisibility() {
    const otherChecked = supportNeededOther && supportNeededOther.checked;
    if (supportOtherWrap) {
      supportOtherWrap.style.display = otherChecked ? 'block' : 'none';
    }
    if (!otherChecked && supportOtherText) {
      supportOtherText.value = '';
    }
  }

  document.querySelectorAll('input[name="supportNeeded"]').forEach((cb) => {
    cb.addEventListener('change', () => {
      updateSupportOtherVisibility();
      const supportError = document.getElementById('supportNeededError');
      if (supportError) {
        const group = supportError.closest('.form-group');
        if (group) group.classList.remove('has-error');
        supportError.textContent = '';
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. Validation helpers
  // --------------------------------------------------------------------------
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

  form.querySelectorAll('input, textarea, select').forEach((input) => {
    const clear = () => {
      const parent = input.closest('.form-group');
      if (parent && parent.classList.contains('has-error')) {
        parent.classList.remove('has-error');
        const err = parent.querySelector('.field-error');
        if (err) err.textContent = '';
      }
    };
    input.addEventListener('input', clear);
    input.addEventListener('change', clear);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function requireText(id, errorId, message, minLen, firstInvalidRef) {
    const el = document.getElementById(id);
    const val = (el && el.value || '').trim();
    if (!val || val.length < minLen) {
      setFieldError(el, errorId, message);
      if (!firstInvalidRef.current) firstInvalidRef.current = el;
      return false;
    }
    clearFieldError(el, errorId);
    return true;
  }

  // --------------------------------------------------------------------------
  // 5. Submit
  // --------------------------------------------------------------------------
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstInvalidRef = { current: null };

    requireText('projectTitle', 'projectTitleError', 'Please enter a clear project name (at least 5 characters).', 5, firstInvalidRef);
    requireText('challengeTopic', 'challengeTopicError', 'Please specify the challenge title or topic of interest.', 3, firstInvalidRef);
    requireText('institution', 'institutionError', 'Please enter your college or university name.', 3, firstInvalidRef);

    const teamSizeInput = document.getElementById('teamSize');
    const teamSizeVal = parseInt(teamSizeInput.value, 10);
    if (isNaN(teamSizeVal) || teamSizeVal < 1 || teamSizeVal > 20) {
      setFieldError(teamSizeInput, 'teamSizeError', 'Please enter a valid team size between 1 and 20.');
      if (!firstInvalidRef.current) firstInvalidRef.current = teamSizeInput;
    } else {
      clearFieldError(teamSizeInput, 'teamSizeError');
    }

    requireText('contactPerson', 'contactPersonError', 'Please provide the name of the primary student contact.', 2, firstInvalidRef);

    const contactEmailInput = document.getElementById('contactEmail');
    const contactEmailVal = (contactEmailInput.value || '').trim();
    if (!contactEmailVal || !isValidEmail(contactEmailVal)) {
      setFieldError(contactEmailInput, 'contactEmailError', 'Please enter a valid email address (e.g. name@example.com).');
      if (!firstInvalidRef.current) firstInvalidRef.current = contactEmailInput;
    } else {
      clearFieldError(contactEmailInput, 'contactEmailError');
    }

    requireText('specificProblem', 'specificProblemError', 'Please describe the specific problem (at least 10 characters).', 10, firstInvalidRef);
    requireText('whoAffected', 'whoAffectedError', 'Please describe who is affected (at least 5 characters).', 5, firstInvalidRef);
    requireText('currentGap', 'currentGapError', 'Please describe the current gap or limitation (at least 10 characters).', 10, firstInvalidRef);

    requireText('proposedSolution', 'proposedSolutionError', 'Please describe your proposed solution (at least 10 characters).', 10, firstInvalidRef);
    requireText('approachDifference', 'approachDifferenceError', 'Please explain what makes your approach different (at least 10 characters).', 10, firstInvalidRef);
    requireText('howItWorks', 'howItWorksError', 'Please explain how it works (at least 10 characters).', 10, firstInvalidRef);
    requireText('validationPlan', 'validationPlanError', 'Please describe how it can be explored, tested, or validated (at least 10 characters).', 10, firstInvalidRef);
    requireText('expectedOutcome', 'expectedOutcomeError', 'Please describe the expected outcome (at least 10 characters).', 10, firstInvalidRef);

    const checkedSupport = document.querySelectorAll('input[name="supportNeeded"]:checked');
    const supportError = document.getElementById('supportNeededError');
    if (checkedSupport.length === 0) {
      if (supportError) {
        supportError.textContent = 'Please select at least one form of support that would help your team.';
        const group = supportError.closest('.form-group');
        if (group) group.classList.add('has-error');
      }
      if (!firstInvalidRef.current) {
        firstInvalidRef.current = document.querySelector('input[name="supportNeeded"]');
      }
    } else {
      if (supportError) {
        supportError.textContent = '';
        const group = supportError.closest('.form-group');
        if (group) group.classList.remove('has-error');
      }
      if (supportNeededOther && supportNeededOther.checked) {
        const otherVal = (supportOtherText && supportOtherText.value || '').trim();
        if (!otherVal) {
          setFieldError(supportOtherText, null, 'Please describe the other support you need.');
          const wrapGroup = supportOtherWrap;
          if (wrapGroup) wrapGroup.classList.add('has-error');
          if (!firstInvalidRef.current) firstInvalidRef.current = supportOtherText;
        }
      }
    }

    const projectStageSelect = document.getElementById('projectStage');
    if (!projectStageSelect.value) {
      setFieldError(projectStageSelect, 'projectStageError', 'Please select your current project stage.');
      if (!firstInvalidRef.current) firstInvalidRef.current = projectStageSelect;
    } else {
      clearFieldError(projectStageSelect, 'projectStageError');
    }

    if (firstInvalidRef.current) {
      firstInvalidRef.current.focus();
      return;
    }

    form.style.display = 'none';
    if (confirmationBox) {
      confirmationBox.style.display = 'block';
      confirmationBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // --------------------------------------------------------------------------
  // 6. Reset
  // --------------------------------------------------------------------------
  function resetForm() {
    form.reset();
    document.querySelectorAll('.form-group.has-error').forEach((group) => {
      group.classList.remove('has-error');
    });
    document.querySelectorAll('.field-error').forEach((err) => {
      err.textContent = '';
    });
    if (materialsFileList) materialsFileList.innerHTML = '';
    updateSupportOtherVisibility();
    if (confirmationBox) confirmationBox.style.display = 'none';
    form.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetForm);
  }
}
