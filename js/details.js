/**
 * CivicConnect — Problem Details Logic (js/details.js)
 * Strictly Vanilla JavaScript | Reads URL query parameter ?id=... from shared js/data.js
 */

document.addEventListener('DOMContentLoaded', () => {
  initProblemDetails();
});

function initProblemDetails() {
  const contentContainer = document.getElementById('detailsContent');
  const notFoundContainer = document.getElementById('detailsNotFound');

  if (!contentContainer || !notFoundContainer || typeof SAMPLE_PROBLEMS === 'undefined') return;

  // Read URL query parameter: ?id=...
  const urlParams = new URLSearchParams(window.location.search);
  const problemId = urlParams.get('id');

  // Look up problem in shared dataset (supports "CC-001" and backward-compatible slugs)
  const problem = (typeof findProblemById === 'function')
    ? findProblemById(problemId)
    : SAMPLE_PROBLEMS.find(p => p.id === problemId || p.slug === problemId);

  if (!problem) {
    contentContainer.style.display = 'none';
    notFoundContainer.style.display = 'block';
    return;
  }

  // Found matching problem: Populate DOM elements
  notFoundContainer.style.display = 'none';
  contentContainer.style.display = 'block';

  // Update page title dynamically
  document.title = `${problem.id}: ${problem.title} — CivicConnect`;

  // Problem ID tag
  const idEl = document.getElementById('detailProblemId');
  if (idEl) {
    idEl.textContent = problem.id;
  }

  // Priority badge in top tags
  const priorityVal = problem.priority || 'Medium';
  const priorityClass = `tag-priority--${priorityVal.toLowerCase()}`;
  const priorityEl = document.getElementById('detailPriority');
  if (priorityEl) {
    priorityEl.textContent = `${priorityVal} Priority`;
    priorityEl.className = `tag-priority ${priorityClass}`;
  }

  const priorityBadgeEl = document.getElementById('detailPriorityBadge');
  if (priorityBadgeEl) {
    priorityBadgeEl.textContent = `${priorityVal} Priority`;
    priorityBadgeEl.className = `tag-priority ${priorityClass}`;
  }

  // Populate Priority Evaluation Factors Card (Transparent, Rule-based Assessment)
  const factorPriority = document.getElementById('factorPriorityVal');
  if (factorPriority) factorPriority.textContent = priorityVal;

  const factorSeverity = document.getElementById('factorSeverityVal');
  if (factorSeverity) factorSeverity.textContent = problem.severity || 'Medium';

  const factorPeople = document.getElementById('factorPeopleVal');
  if (factorPeople) factorPeople.textContent = problem.peopleAffected ? `${problem.peopleAffected} residents` : 'Localized group';

  const factorRisk = document.getElementById('factorRiskVal');
  if (factorRisk) factorRisk.textContent = problem.riskLevel || 'Medium';

  const factorAge = document.getElementById('factorAgeVal');
  if (factorAge) factorAge.textContent = problem.reportedDaysAgo ? `${problem.reportedDaysAgo} days ago` : 'Recently reported';

  const priorityReasonEl = document.getElementById('detailPriorityReason');
  if (priorityReasonEl) {
    priorityReasonEl.textContent = problem.priorityReason || 
      `Assessed as ${priorityVal} priority based on ${problem.severity || 'medium'} severity, ${problem.peopleAffected || 'community'} affected population, and ${problem.reportedDaysAgo || 30} days unresolved duration.`;
  }

  // Status tag styling
  const statusClass = problem.status.toLowerCase() === 'new' 
    ? 'tag-status--new' 
    : 'tag-status--exploring';

  const statusEl = document.getElementById('detailStatus');
  if (statusEl) {
    statusEl.textContent = problem.status;
    statusEl.className = `tag-status ${statusClass}`;
  }

  // Render Status Progression Timeline (Frontend demo state)
  const timelineEl = document.getElementById('detailTimeline');
  if (timelineEl) {
    const timelineSteps = [
      { label: "Reported", key: "new" },
      { label: "Under Review", key: "review" },
      { label: "Solution Proposed", key: "solution" },
      { label: "In Progress", key: "exploring" },
      { label: "Resolved", key: "resolved" }
    ];

    // Determine current index based on problem status
    let activeIdx = 0;
    const st = (problem.status || '').toLowerCase();
    if (st === 'new') activeIdx = 0;
    else if (st === 'under review') activeIdx = 1;
    else if (st === 'exploring') activeIdx = 1;
    else if (st.includes('solution') || st.includes('proposal')) activeIdx = 2;
    else if (st.includes('progress')) activeIdx = 3;
    else if (st.includes('resolved')) activeIdx = 4;

    timelineEl.innerHTML = '';
    timelineSteps.forEach((step, idx) => {
      const stepDiv = document.createElement('div');
      let stateClass = '';
      if (idx < activeIdx) stateClass = 'timeline-step--completed';
      else if (idx === activeIdx) stateClass = 'timeline-step--current';

      stepDiv.className = `timeline-step ${stateClass}`;
      stepDiv.innerHTML = `
        <div class="timeline-step__dot">${idx < activeIdx ? '&#10003;' : (idx + 1)}</div>
        <div class="timeline-step__label">${escapeHTML(step.label)}</div>
      `;
      timelineEl.appendChild(stepDiv);
    });
  }

  const categoryEl = document.getElementById('detailCategory');
  if (categoryEl) categoryEl.textContent = problem.category;

  const titleEl = document.getElementById('detailTitle');
  if (titleEl) titleEl.textContent = problem.title;

  const locationEl = document.getElementById('detailLocation');
  if (locationEl) locationEl.textContent = problem.location;

  const fullDescEl = document.getElementById('detailFullDesc');
  if (fullDescEl) fullDescEl.textContent = problem.fullDescription;

  const affectedEl = document.getElementById('detailAffected');
  if (affectedEl) affectedEl.textContent = problem.affectedGroup || 'Community residents';

  const durationEl = document.getElementById('detailDuration');
  if (durationEl) durationEl.textContent = problem.duration || 'Not specified';

  // Populate Possible Areas to Explore
  const exploreListEl = document.getElementById('detailExplorationList');
  if (exploreListEl && Array.isArray(problem.possibleAreas)) {
    exploreListEl.innerHTML = '';
    problem.possibleAreas.forEach(areaText => {
      const li = document.createElement('li');
      li.className = 'exploration-item';
      li.innerHTML = `
        <span class="exploration-bullet" aria-hidden="true">&#9670;</span>
        <span>${escapeHTML(areaText)}</span>
      `;
      exploreListEl.appendChild(li);
    });
  }

  // Update Action Links with Current Challenge Query Parameter
  const startProjectBtn = document.getElementById('startProjectRequestBtn');
  if (startProjectBtn) {
    startProjectBtn.href = `student-request.html?id=${encodeURIComponent(problem.id)}`;
  }

  const offerSupportBtn = document.getElementById('offerSupportBtn');
  if (offerSupportBtn) {
    offerSupportBtn.href = `offer-support.html?id=${encodeURIComponent(problem.id)}`;
  }
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

