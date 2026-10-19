/**
 * CivicConnect — Admin Dashboard Logic
 * Platform-level metrics derived from sample data; selectable management panels.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminDashboard();
});

function initAdminDashboard() {
  updateSummaryMetrics();
  renderReportedProblems();
  renderStudentProposals();
  renderPartnerSupport();
  renderActiveCases();
  initAdminPanelSwitching();
}

function initAdminPanelSwitching() {
  const buttons = document.querySelectorAll('.admin-mgmt-btn[data-admin-panel]');
  const panels = document.querySelectorAll('.admin-mgmt-panel[data-admin-panel]');
  const hint = document.getElementById('adminPanelHint');

  if (!buttons.length || !panels.length) return;

  // Ensure no panel is visible until a management option is selected
  panels.forEach(panel => {
    panel.classList.remove('is-active');
    panel.setAttribute('hidden', '');
  });
  buttons.forEach(b => {
    b.classList.remove('is-active');
    b.setAttribute('aria-selected', 'false');
  });
  if (hint) hint.style.display = '';

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const panelId = btn.getAttribute('data-admin-panel');
      if (!panelId) return;

      buttons.forEach(b => {
        const isActive = b.getAttribute('data-admin-panel') === panelId;
        b.classList.toggle('is-active', isActive);
        b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      panels.forEach(panel => {
        const isActive = panel.getAttribute('data-admin-panel') === panelId;
        panel.classList.toggle('is-active', isActive);
        if (isActive) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });

      if (hint) hint.style.display = 'none';
    });
  });
}

function updateSummaryMetrics() {
  const problems = typeof SAMPLE_PROBLEMS !== 'undefined' ? SAMPLE_PROBLEMS : [];
  const proposals = typeof SAMPLE_STUDENT_PROPOSALS !== 'undefined' ? SAMPLE_STUDENT_PROPOSALS : [];
  const support = typeof SAMPLE_SUPPORT_REQUESTS !== 'undefined' ? SAMPLE_SUPPORT_REQUESTS : [];
  const activeCases = typeof SAMPLE_ACTIVE_CASES !== 'undefined' ? SAMPLE_ACTIVE_CASES : [];

  // Newly reported problems still awaiting exploration / proposal progress
  const underReviewCount = problems.filter(p => {
    const s = (p.status || '').toLowerCase();
    return s === 'new' || s.includes('under review') || s.includes('reported');
  }).length;

  // Solutions currently being implemented
  const implementingCount = activeCases.filter(c => {
    const s = (c.stage || '').toLowerCase();
    return s.includes('progress') || s.includes('implement');
  }).length;

  // Active partner collaborations (connected & supporting)
  const collaborationCount = support.filter(s => {
    const st = (s.status || '').toLowerCase();
    return st.includes('connected') || st.includes('supporting');
  }).length;

  const setElText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val);
  };

  setElText('adminProblemsCount', problems.length);
  setElText('adminReviewCount', underReviewCount);
  setElText('adminImplementingCount', implementingCount);
  setElText('adminCollaborationCount', collaborationCount);

  setElText('adminProblemsSectionCount', `${problems.length} Problems`);
  setElText('adminProposalsSectionCount', `${proposals.length} Proposals`);
  setElText('adminSupportSectionCount', `${support.length} Offers`);
  setElText('adminActiveSectionCount', `${activeCases.length} Active Cases`);
}

function renderReportedProblems() {
  const tableBody = document.getElementById('adminProblemsTableBody');
  if (!tableBody || typeof SAMPLE_PROBLEMS === 'undefined') return;

  tableBody.innerHTML = '';

  SAMPLE_PROBLEMS.forEach(p => {
    const tr = document.createElement('tr');
    tr.id = `row-problem-${p.id}`;

    const priorityClass = `tag-priority--${(p.priority || 'medium').toLowerCase()}`;
    const statusClass = getStatusClass(p.status);

    tr.innerHTML = `
      <td><span class="tag-id">${escapeHTML(p.id)}</span></td>
      <td>
        <strong>${escapeHTML(p.title)}</strong>
        <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 2px;">
          ${escapeHTML((p.shortDescription || '').substring(0, 70))}...
        </div>
      </td>
      <td><span style="font-size: 0.85rem; color: var(--color-text-muted);">&#9679; ${escapeHTML(p.location)}</span></td>
      <td><span class="tag-category">${escapeHTML(p.category)}</span></td>
      <td><span class="tag-priority ${priorityClass}">${escapeHTML(p.priority || 'Medium')}</span></td>
      <td class="admin-col-status"><span class="tag-status ${statusClass}" id="prob-status-${p.id}">${escapeHTML(p.status)}</span></td>
      <td>
        <div style="display: flex; flex-direction: column; gap: 5px;">
          <select class="admin-status-select"
                  aria-label="Update status for ${escapeHTML(p.id)}"
                  onchange="adminUpdateProblemStatus('${p.id}', this.value)"
                  style="font-size: 0.78rem; padding: 3px 6px; border-radius: 4px; border: 1px solid var(--color-border); background: #FFFFFF; color: var(--color-text-main);">
            <option value="" disabled selected>Change Status...</option>
            <option value="Reported">Reported</option>
            <option value="Under Review">Under Review</option>
            <option value="Solution Proposed">Solution Proposed</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <a href="details.html?id=${encodeURIComponent(p.id)}" class="btn btn-sm btn-secondary" style="font-size: 0.75rem; padding: 3px 8px; text-align: center;">
            View Details
          </a>
        </div>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

function renderStudentProposals() {
  const tableBody = document.getElementById('adminSolutionsTableBody');
  if (!tableBody || typeof SAMPLE_STUDENT_PROPOSALS === 'undefined') return;

  tableBody.innerHTML = '';

  SAMPLE_STUDENT_PROPOSALS.forEach(prop => {
    const tr = document.createElement('tr');
    tr.id = `row-prop-${prop.id}`;

    const statusBadgeClass = getProposalStatusClass(prop.status);
    const university = prop.university || '';

    tr.innerHTML = `
      <td><span class="tag-id" style="font-weight: 700;">${escapeHTML(prop.id)}</span></td>
      <td>
        <strong>${escapeHTML(prop.solutionTitle)}</strong>
        <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 2px;">
          Target: ${escapeHTML(prop.problemTitle)}
        </div>
      </td>
      <td>
        <a href="details.html?id=${encodeURIComponent(prop.problemId)}" class="tag-id" style="text-decoration: none; display: inline-block;" title="View Linked Problem">
          ${escapeHTML(prop.problemId)} &rarr;
        </a>
      </td>
      <td>
        <span style="font-size: 0.86rem; font-weight: 600;">${escapeHTML(prop.student)}</span>
        <div style="font-size: 0.78rem; color: var(--color-text-muted);">${escapeHTML(university)}</div>
      </td>
      <td class="admin-col-status"><span class="tag-status ${statusBadgeClass}" id="prop-status-${prop.id}">${escapeHTML(prop.status)}</span></td>
      <td>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <div style="display: flex; gap: 4px;">
            <a href="solution-details.html?id=${encodeURIComponent(prop.id)}" class="btn btn-sm btn-secondary" style="font-size: 0.75rem; padding: 3px 7px;">
              View
            </a>
            <button type="button" class="btn btn-sm btn-primary" onclick="adminUpdateProposalStatus('${prop.id}', 'Accepted')" style="font-size: 0.75rem; padding: 3px 7px;">
              Approve
            </button>
          </div>
          <div style="display: flex; gap: 4px;">
            <button type="button" class="btn btn-sm btn-outline-subtle" onclick="adminUpdateProposalStatus('${prop.id}', 'Under Review')" style="font-size: 0.72rem; padding: 2px 6px;">
              Request Changes
            </button>
            <button type="button" class="btn btn-sm" onclick="adminUpdateProposalStatus('${prop.id}', 'Rejected')" style="font-size: 0.72rem; padding: 2px 6px; background: #C53929; color: #FFFFFF; border: none; border-radius: 4px;">
              Reject
            </button>
          </div>
        </div>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

function renderPartnerSupport() {
  const tableBody = document.getElementById('adminSupportTableBody');
  if (!tableBody || typeof SAMPLE_SUPPORT_REQUESTS === 'undefined') return;

  tableBody.innerHTML = '';

  SAMPLE_SUPPORT_REQUESTS.forEach(req => {
    const tr = document.createElement('tr');
    tr.id = `row-supp-${req.id}`;

    const statusBadgeClass = getSupportStatusClass(req.status);

    tr.innerHTML = `
      <td><span class="tag-id" style="font-weight: 700;">${escapeHTML(req.id)}</span></td>
      <td>
        <strong style="font-size: 0.9rem;">${escapeHTML(req.organization)}</strong>
        <div style="font-size: 0.78rem; color: var(--color-text-muted);">${escapeHTML(req.contactPerson || '')}</div>
      </td>
      <td><span class="tag-category">${escapeHTML(req.supportType)}</span></td>
      <td>
        <a href="details.html?id=${encodeURIComponent(req.problemId)}" class="tag-id" style="text-decoration: none; display: inline-block;" title="View Linked Problem">
          ${escapeHTML(req.problemId)} &rarr;
        </a>
      </td>
      <td class="admin-col-status"><span class="tag-status ${statusBadgeClass}" id="supp-status-${req.id}">${escapeHTML(req.status)}</span></td>
      <td>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <div style="display: flex; gap: 4px;">
            <a href="support-details.html?id=${encodeURIComponent(req.id)}" class="btn btn-sm btn-secondary" style="font-size: 0.75rem; padding: 3px 7px;">
              View
            </a>
            <button type="button" class="btn btn-sm btn-primary" onclick="adminUpdateSupportStatus('${req.id}', 'Connected & Supporting')" style="font-size: 0.75rem; padding: 3px 7px;">
              Accept
            </button>
          </div>
          <div style="display: flex; gap: 4px;">
            <button type="button" class="btn btn-sm btn-outline-subtle" onclick="adminUpdateSupportStatus('${req.id}', 'More Info Requested')" style="font-size: 0.72rem; padding: 2px 6px;">
              Request Info
            </button>
            <button type="button" class="btn btn-sm" onclick="adminUpdateSupportStatus('${req.id}', 'Declined')" style="font-size: 0.72rem; padding: 2px 6px; background: #6F7D78; color: #FFFFFF; border: none; border-radius: 4px;">
              Decline
            </button>
          </div>
        </div>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

function renderActiveCases() {
  const tableBody = document.getElementById('adminActiveCasesTableBody');
  if (!tableBody || typeof SAMPLE_ACTIVE_CASES === 'undefined') return;

  tableBody.innerHTML = '';

  SAMPLE_ACTIVE_CASES.forEach(item => {
    const tr = document.createElement('tr');
    const team = item.studentTeam || item.team || '';
    const partner = item.partnerOrg || item.partner || '';

    tr.innerHTML = `
      <td><span class="tag-id" style="font-weight: 700; color: var(--color-primary);">${escapeHTML(item.id)}</span></td>
      <td>
        <strong>${escapeHTML(item.problemTitle)}</strong>
        <div style="font-size: 0.78rem; color: var(--color-text-muted); margin-top: 2px;">
          <a href="details.html?id=${encodeURIComponent(item.problemId)}" class="tag-id" style="text-decoration:none;">${escapeHTML(item.problemId)}</a> &bull; ${escapeHTML(item.location)}
        </div>
      </td>
      <td>
        <strong>${escapeHTML(item.proposalTitle)}</strong>
        <div style="font-size: 0.78rem; color: var(--color-text-muted); margin-top: 2px;">
          <a href="solution-details.html?id=${encodeURIComponent(item.proposalId)}" class="tag-id" style="text-decoration:none;">${escapeHTML(item.proposalId)}</a> &bull; ${escapeHTML(team)}
        </div>
      </td>
      <td>
        <strong>${escapeHTML(partner)}</strong>
        <div style="font-size: 0.78rem; color: var(--color-text-muted); margin-top: 2px;">
          <a href="support-details.html?id=${encodeURIComponent(item.supportId)}" class="tag-id" style="text-decoration:none;">${escapeHTML(item.supportId)}</a> &bull; ${escapeHTML(item.supportType)}
        </div>
      </td>
      <td class="admin-col-status"><span class="tag-status tag-status--accepted">${escapeHTML(item.stage)}</span></td>
      <td>
        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
          <a href="details.html?id=${encodeURIComponent(item.problemId)}" class="btn btn-sm btn-secondary" style="font-size: 0.75rem; padding: 3px 7px;">
            Problem
          </a>
          <a href="solution-details.html?id=${encodeURIComponent(item.proposalId)}" class="btn btn-sm btn-outline-subtle" style="font-size: 0.75rem; padding: 3px 7px;">
            Solution
          </a>
        </div>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

window.adminUpdateProblemStatus = function(problemId, newStatus) {
  if (!newStatus) return;
  const statusEl = document.getElementById(`prob-status-${problemId}`);
  if (statusEl) {
    statusEl.textContent = newStatus;
    statusEl.className = `tag-status ${getStatusClass(newStatus)}`;
  }
  showAdminFeedback(`Status for ${problemId} updated to "${newStatus}".`);
};

window.adminUpdateProposalStatus = function(proposalId, newStatus) {
  const statusEl = document.getElementById(`prop-status-${proposalId}`);
  if (statusEl) {
    statusEl.textContent = newStatus;
    statusEl.className = `tag-status ${getProposalStatusClass(newStatus)}`;
  }
  showAdminFeedback(`Proposal ${proposalId} updated to "${newStatus}".`);
};

window.adminUpdateSupportStatus = function(supportId, newStatus) {
  const statusEl = document.getElementById(`supp-status-${supportId}`);
  if (statusEl) {
    statusEl.textContent = newStatus;
    statusEl.className = `tag-status ${getSupportStatusClass(newStatus)}`;
  }
  showAdminFeedback(`Support offer ${supportId} updated to "${newStatus}".`);
};

function showAdminFeedback(message) {
  const notice = document.getElementById('adminActionNotification');
  if (!notice) return;
  notice.textContent = message;
  notice.style.display = 'block';

  if (window._adminNoticeTimer) clearTimeout(window._adminNoticeTimer);
  window._adminNoticeTimer = setTimeout(() => {
    notice.style.display = 'none';
  }, 4500);
}

function getStatusClass(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('resolved')) return 'tag-status--resolved';
  if (s.includes('progress')) return 'tag-status--in-progress';
  if (s.includes('solution')) return 'tag-status--accepted';
  if (s.includes('review') || s.includes('exploring')) return 'tag-status--under-review';
  return 'tag-status--new';
}

function getProposalStatusClass(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('accept') || s.includes('implement')) return 'tag-status--accepted';
  if (s.includes('shortlist')) return 'tag-status--shortlisted';
  if (s.includes('reject')) return 'tag-status--draft';
  return 'tag-status--review';
}

function getSupportStatusClass(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('accept') || s.includes('connected') || s.includes('supporting')) return 'tag-status--accepted';
  if (s.includes('offered') || s.includes('info')) return 'tag-status--shortlisted';
  if (s.includes('decline')) return 'tag-status--draft';
  return 'tag-status--review';
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
