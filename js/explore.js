/**
 * CivicConnect — Explore Problems Logic (js/explore.js)
 * Strictly Vanilla JavaScript | Client-side search, filtering, and Leaflet map
 */

document.addEventListener('DOMContentLoaded', () => {
  initExplorePage();
});

function initExplorePage() {
  const searchInput = document.getElementById('problemSearchInput');
  const stateFilter = document.getElementById('stateFilter');
  const districtFilter = document.getElementById('districtFilter');
  const categoryFilter = document.getElementById('categoryFilter');
  const priorityFilter = document.getElementById('priorityFilter');
  const statusFilter = document.getElementById('statusFilter');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  const resetEmptyBtn = document.getElementById('resetEmptyBtn');
  const problemsContainer = document.getElementById('problemsContainer');
  const resultsCountEl = document.getElementById('resultsCount');
  const emptyStateEl = document.getElementById('emptyState');

  if (!problemsContainer || typeof SAMPLE_PROBLEMS === 'undefined') return;

  // --------------------------------------------------------------------------
  // 1. Populate Dynamic State & District Select Options
  // --------------------------------------------------------------------------
  function populateStateOptions() {
    if (!stateFilter || typeof getDistinctStates !== 'function') return;
    const states = getDistinctStates();
    states.forEach(st => {
      const opt = document.createElement('option');
      opt.value = st;
      opt.textContent = st;
      stateFilter.appendChild(opt);
    });
  }

  function updateDistrictOptions(selectedState) {
    if (!districtFilter || typeof getDistrictsForState !== 'function') return;
    districtFilter.innerHTML = '<option value="all">All Districts</option>';
    const districts = getDistrictsForState(selectedState);
    districts.forEach(dist => {
      const opt = document.createElement('option');
      opt.value = dist;
      opt.textContent = dist;
      districtFilter.appendChild(opt);
    });
  }

  populateStateOptions();
  updateDistrictOptions('all');

  if (stateFilter) {
    stateFilter.addEventListener('change', () => {
      const selectedState = stateFilter.value;
      updateDistrictOptions(selectedState);
      filterProblems();
    });
  }

  // --------------------------------------------------------------------------
  // 2. Leaflet Interactive Map Initialization (High-performance Public CARTO Basemap)
  // --------------------------------------------------------------------------
  let mapInstance = null;
  let markersLayer = null;
  const markerById = {};

  function initMap() {
    const mapEl = document.getElementById('exploreMap');
    if (!mapEl || typeof L === 'undefined') return;

    try {
      // Initialize map centered over India
      mapInstance = L.map('exploreMap', {
        center: [22.0, 78.96],
        zoom: 5.5,
        minZoom: 3,
        maxZoom: 20,
        scrollWheelZoom: true,
        doubleClickZoom: true
      });
      mapInstance.attributionControl.setPrefix(false);

      // Use CARTO Voyager raster tiles: fast, clean civic styling, no 403 access blocks
      L.tileLayer('https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_4d94_1_074af1e4c8b48f5a7793660b', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions/" target="_blank" rel="noopener">CARTO</a>'
      }).addTo(mapInstance);

      markersLayer = L.layerGroup().addTo(mapInstance);
      updateMapMarkers(SAMPLE_PROBLEMS);

      // Invalidate map size after container layout calculation
      setTimeout(() => {
        if (mapInstance) mapInstance.invalidateSize();
      }, 200);

      window.addEventListener('resize', () => {
        if (mapInstance) mapInstance.invalidateSize();
      });
    } catch (e) {
      console.warn('Map initialization failed:', e);
    }
  }

  function updateMapMarkers(problems) {
    if (!markersLayer || typeof L === 'undefined') return;
    markersLayer.clearLayers();
    Object.keys(markerById).forEach(k => delete markerById[k]);

    problems.forEach(problem => {
      if (!problem.coordinates || !Array.isArray(problem.coordinates)) return;

      const [lat, lng] = problem.coordinates;
      const marker = L.marker([lat, lng]);

      const priorityVal = problem.priority || 'Medium';
      const priorityClass = `tag-priority--${priorityVal.toLowerCase()}`;

      const statusClass = problem.status.toLowerCase() === 'new'
        ? 'tag-status--new'
        : 'tag-status--exploring';

      const popupHtml = `
        <div class="custom-map-popup">
          <div class="map-popup-header" style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px; flex-wrap: wrap;">
            <span class="tag-id">${escapeHTML(problem.id)}</span>
            <span class="tag-priority ${priorityClass}">${escapeHTML(priorityVal)}</span>
            <span class="tag-status ${statusClass}" style="font-size: 0.72rem; padding: 2px 7px;">${escapeHTML(problem.status)}</span>
          </div>
          <h4 class="map-popup-title" style="margin: 4px 0 6px 0; font-size: 0.96rem; font-weight: 700; color: var(--color-brand-primary);">${escapeHTML(problem.title)}</h4>
          <div class="map-popup-meta" style="font-size: 0.82rem; color: var(--color-text-muted); margin-bottom: 8px;">
            &#9679; ${escapeHTML(problem.location)} &bull; <strong>${escapeHTML(problem.category)}</strong>
          </div>
          <a href="details.html?id=${encodeURIComponent(problem.id)}" class="map-popup-link" style="display: inline-block; font-size: 0.86rem; font-weight: 600; color: var(--color-brand-primary);">
            View Problem Details &rarr;
          </a>
        </div>
      `;

      marker.bindPopup(popupHtml);
      markersLayer.addLayer(marker);
      markerById[problem.id] = marker;
    });
  }

  // --------------------------------------------------------------------------
  // 3. Render Problem Cards (Using Priority badges)
  // --------------------------------------------------------------------------
  function renderProblems(problems) {
    problemsContainer.innerHTML = '';

    if (problems.length === 0) {
      emptyStateEl.style.display = 'block';
      resultsCountEl.textContent = '0 challenges found';
      return;
    }

    emptyStateEl.style.display = 'none';
    resultsCountEl.innerHTML = `Showing <strong>${problems.length}</strong> of <strong>${SAMPLE_PROBLEMS.length}</strong> community challenges`;

    problems.forEach(problem => {
      const card = document.createElement('article');
      card.className = 'problem-card';
      card.setAttribute('data-id', problem.id);

      const statusClass = problem.status.toLowerCase() === 'new'
        ? 'tag-status--new'
        : 'tag-status--exploring';

      const priorityVal = problem.priority || 'Medium';
      const priorityClass = `tag-priority--${priorityVal.toLowerCase()}`;

      card.innerHTML = `
        <div class="problem-card__top">
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <span class="tag-id">${escapeHTML(problem.id)}</span>
            <span class="tag-priority ${priorityClass}">${escapeHTML(priorityVal)}</span>
            <span class="tag-category">${escapeHTML(problem.category)}</span>
          </div>
          <span class="tag-status ${statusClass}">${escapeHTML(problem.status)}</span>
        </div>
        <h3 class="problem-card__title">${escapeHTML(problem.title)}</h3>
        <div class="problem-card__location">
          <span aria-hidden="true">&#9679;</span>
          <span>${escapeHTML(problem.location)}</span>
        </div>
        <p class="problem-card__desc">${escapeHTML(problem.shortDescription)}</p>
        <div class="problem-card__action" style="display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
          <a href="details.html?id=${encodeURIComponent(problem.id)}" class="view-details-link">
            View Details <span aria-hidden="true">&rarr;</span>
          </a>
          <button type="button" class="btn btn-outline-subtle btn-focus-map" data-id="${escapeHTML(problem.id)}" style="padding: 4px 10px; font-size: 0.8rem; cursor: pointer;">
            &#9678; Map Location
          </button>
        </div>
      `;

      // Card-to-map synchronization: focus map marker
      const mapBtn = card.querySelector('.btn-focus-map');
      if (mapBtn) {
        mapBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          focusProblemOnMap(problem.id);
        });
      }

      problemsContainer.appendChild(card);
    });
  }

  function focusProblemOnMap(problemId) {
    const marker = markerById[problemId];
    if (marker && mapInstance) {
      const latLng = marker.getLatLng();
      mapInstance.setView(latLng, 8, { animate: true });
      marker.openPopup();
      const mapEl = document.getElementById('exploreMap');
      if (mapEl) {
        mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  // --------------------------------------------------------------------------
  // 4. Combined Filter Engine (State, District, Category, Priority, Status, Search)
  // --------------------------------------------------------------------------
  function filterProblems() {
    const searchTerm = (searchInput.value || '').trim().toLowerCase();
    const selectedState = stateFilter ? stateFilter.value : 'all';
    const selectedDistrict = districtFilter ? districtFilter.value : 'all';
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    const selectedPriority = priorityFilter ? priorityFilter.value : 'all';
    const selectedStatus = statusFilter ? statusFilter.value : 'all';

    const filtered = SAMPLE_PROBLEMS.filter(item => {
      // 1. Text search
      const matchesSearch = !searchTerm || (
        item.id.toLowerCase().includes(searchTerm) ||
        (item.slug && item.slug.toLowerCase().includes(searchTerm)) ||
        item.title.toLowerCase().includes(searchTerm) ||
        item.shortDescription.toLowerCase().includes(searchTerm) ||
        item.fullDescription.toLowerCase().includes(searchTerm) ||
        item.location.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        (item.priority && item.priority.toLowerCase().includes(searchTerm))
      );

      // 2. State filter
      const matchesState = !selectedState || selectedState === 'all' ||
        (item.state && item.state.toLowerCase() === selectedState.toLowerCase());

      // 3. District filter
      const matchesDistrict = !selectedDistrict || selectedDistrict === 'all' ||
        (item.district && item.district.toLowerCase() === selectedDistrict.toLowerCase());

      // 4. Category filter
      const matchesCategory = !selectedCategory || selectedCategory === 'all' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      // 5. Priority filter (ONE user-facing Priority filter)
      const matchesPriority = !selectedPriority || selectedPriority === 'all' ||
        (item.priority && item.priority.toLowerCase() === selectedPriority.toLowerCase());

      // 6. Status filter
      const matchesStatus = !selectedStatus || selectedStatus === 'all' ||
        item.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesState && matchesDistrict && matchesCategory && matchesPriority && matchesStatus;
    });

    renderProblems(filtered);
    updateMapMarkers(filtered);
  }

  function clearAllFilters() {
    if (searchInput) searchInput.value = '';
    if (stateFilter) stateFilter.value = 'all';
    updateDistrictOptions('all');
    if (districtFilter) districtFilter.value = 'all';
    if (categoryFilter) categoryFilter.value = 'all';
    if (priorityFilter) priorityFilter.value = 'all';
    if (statusFilter) statusFilter.value = 'all';
    filterProblems();
    if (searchInput) searchInput.focus();
  }

  // Event Listeners for live filtering
  if (searchInput) searchInput.addEventListener('input', filterProblems);
  if (districtFilter) districtFilter.addEventListener('change', filterProblems);
  if (categoryFilter) categoryFilter.addEventListener('change', filterProblems);
  if (priorityFilter) priorityFilter.addEventListener('change', filterProblems);
  if (statusFilter) statusFilter.addEventListener('change', filterProblems);

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', clearAllFilters);
  }

  if (resetEmptyBtn) {
    resetEmptyBtn.addEventListener('click', clearAllFilters);
  }

  // Initial render & map setup
  renderProblems(SAMPLE_PROBLEMS);
  initMap();
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

