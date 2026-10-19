/**
 * CivicConnect — Student Dashboard Logic
 * Shows only the logged-in student team's proposal (CURRENT_STUDENT_TEAM).
 */

document.addEventListener('DOMContentLoaded', () => {
  initStudentDashboard();
});

function initStudentDashboard() {
  const container = document.getElementById('studentProposalContainer');
  const intro = document.getElementById('studentTeamIntro');

  if (typeof CURRENT_STUDENT_TEAM === 'undefined' || typeof SAMPLE_STUDENT_PROPOSALS === 'undefined') {
    if (container) {
      container.innerHTML = '<p class="dashboard-section__desc">Your proposal information is not available.</p>';
    }
    return;
  }

  if (intro) {
    intro.textContent = `${CURRENT_STUDENT_TEAM.student} · ${CURRENT_STUDENT_TEAM.university}`;
  }

  const proposal = SAMPLE_STUDENT_PROPOSALS.find(p =>
    p.id === CURRENT_STUDENT_TEAM.proposalId ||
    p.student === CURRENT_STUDENT_TEAM.student
  );

  if (!container) return;

  if (!proposal) {
    container.innerHTML = `
      <article class="proposal-item">
        <h3 class="proposal-item__title">No proposal submitted yet</h3>
        <p class="proposal-item__desc">
          When your team submits a solution, it will appear here with its review and support status.
        </p>
        <a href="student-request.html" class="btn btn-secondary">Provide a Solution</a>
      </article>
    `;
    return;
  }

  const support = (typeof SAMPLE_SUPPORT_REQUESTS !== 'undefined')
    ? SAMPLE_SUPPORT_REQUESTS.find(s => s.proposalId === proposal.id)
    : null;

  const activeCase = (typeof SAMPLE_ACTIVE_CASES !== 'undefined')
    ? SAMPLE_ACTIVE_CASES.find(c => c.proposalId === proposal.id)
    : null;

  let adminStatusClass = 'tag-status--review';
  const adminStatus = proposal.status || 'Submitted';
  const s = adminStatus.toLowerCase();
  if (s.includes('accept') || s.includes('implement')) adminStatusClass = 'tag-status--accepted';
  else if (s.includes('shortlist')) adminStatusClass = 'tag-status--shortlisted';
  else if (s.includes('submit')) adminStatusClass = 'tag-status--draft';

  let partnerLabel = 'Not requested yet';
  let partnerClass = 'tag-status--draft';
  if (support) {
    partnerLabel = support.status;
    const ps = support.status.toLowerCase();
    if (ps.includes('connected') || ps.includes('supporting')) {
      partnerClass = 'tag-status--accepted';
      partnerLabel = 'Partner support received';
    } else if (ps.includes('offered')) {
      partnerClass = 'tag-status--shortlisted';
      partnerLabel = 'Partner offer pending';
    }
  }

  let implLabel = 'Not started';
  let implClass = 'tag-status--draft';
  if (activeCase) {
    implLabel = activeCase.stage;
    const is = (activeCase.stage || '').toLowerCase();
    if (is.includes('progress')) {
      implClass = 'tag-status--in-progress';
      implLabel = 'Implementation in progress';
    } else if (is.includes('resolved')) {
      implClass = 'tag-status--resolved';
    } else if (is.includes('review') || is.includes('proposed')) {
      implClass = 'tag-status--shortlisted';
    }
  }

  container.innerHTML = `
    <article class="proposal-item">
      <div class="proposal-item__top">
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span class="tag-id" style="background-color: var(--color-bg-sage); color: var(--color-brand-primary); font-weight: 700;">${escapeHTML(proposal.id)}</span>
          <span style="font-size: 0.82rem; color: var(--color-text-muted);">${escapeHTML(proposal.date)}</span>
        </div>
        <span style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--color-text-muted);">Linked: ${escapeHTML(proposal.problemId)}</span>
      </div>

      <h3 class="proposal-item__title">${escapeHTML(proposal.solutionTitle)}</h3>

      <div class="proposal-item__meta">
        <span><strong>Related problem:</strong> ${escapeHTML(proposal.problemTitle)}</span>
      </div>
      <div class="proposal-item__meta" style="margin-top: 6px;">
        <span><strong>Team:</strong> ${escapeHTML(proposal.student)}</span>
        <span>&bull;</span>
        <span><strong>University:</strong> ${escapeHTML(proposal.university)}</span>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0 12px;">
        <span class="tag-status ${adminStatusClass}">Admin review: ${escapeHTML(adminStatus)}</span>
        <span class="tag-status ${partnerClass}">${escapeHTML(partnerLabel)}</span>
        <span class="tag-status ${implClass}">${escapeHTML(implLabel)}</span>
      </div>

      <p class="proposal-item__desc">${escapeHTML(proposal.description)}</p>

      <div class="proposal-item__actions" style="display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;">
        <a href="solution-details.html?id=${encodeURIComponent(proposal.id)}" class="btn btn-sm btn-action" style="padding: 6px 14px; font-size: 0.86rem; min-height: unset; min-width: unset;">
          View Proposal Details &rarr;
        </a>
        <a href="details.html?id=${encodeURIComponent(proposal.problemId)}" class="view-details-link" style="font-size: 0.88rem; margin-left: auto;">
          View Related Problem (${escapeHTML(proposal.problemId)})
        </a>
      </div>
    </article>
  `;
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
