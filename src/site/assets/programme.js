import {
  enrichConference,
  escapeHtml,
  fetchDataset,
  getSpeakerFullName,
  unregisterLegacyServiceWorkers
} from './shared.js';

function renderEntrepriseLinks(conference) {
  if (conference.entreprises.length === 0) {
    return '';
  }

  return conference.entreprises
    .map(
      (entreprise) =>
        `<a class="link-pill entreprise-pill" href="./entreprises/?id=${encodeURIComponent(entreprise.id)}">${escapeHtml(entreprise.nomEntreprise)}</a>`
    )
    .join('');
}

function renderRoomLinks(conference) {
  if (conference.salles.length === 0) {
    return '<span class="link-pill muted">Evenement general</span>';
  }

  return conference.salles
    .map(
      (salle) =>
        `<a class="link-pill" href="./salles/?id=${encodeURIComponent(salle.id)}">${escapeHtml(salle.nom)}</a>`
    )
    .join('');
}

function renderSpeakerLinks(conference) {
  if (conference.speakers.length === 0) {
    return '';
  }

  return conference.speakers
    .map(
      (speaker) =>
        `<a class="link-pill" href="./speakers/?id=${encodeURIComponent(speaker.id)}">${escapeHtml(getSpeakerFullName(speaker))}</a>`
    )
    .join('');
}

function renderProgrammeCard(conference) {
  return `
    <article class="programme-card variant-${escapeHtml(conference.variant)}">
      <div class="programme-card-head">
        <span class="programme-badge">${escapeHtml(conference.variant)}</span>
        <span class="programme-roomline">${renderRoomLinks(conference)}</span>
      </div>
      <h3>
        <a href="./conferences/?id=${encodeURIComponent(conference.id)}">${escapeHtml(conference.nom)}</a>
      </h3>
      <div class="pill-row">
        ${renderSpeakerLinks(conference)}
      </div>
      <div class="pill-row entreprise-row">
        ${renderEntrepriseLinks(conference)}
      </div>
    </article>
  `;
}

function renderProgramme(dataset) {
  const container = document.getElementById('programme-list');
  const groups = new Map();

  dataset.conferences
    .map((conference) => enrichConference(conference, dataset))
    .forEach((conference) => {
      const key = conference.timeText;
      const bucket = groups.get(key) ?? [];
      bucket.push(conference);
      groups.set(key, bucket);
    });

  container.innerHTML = [...groups.entries()]
    .map(([timeText, conferences]) => {
      const demoConferences = conferences.filter((conference) => conference.variant === 'demo');
      const regularConferences = conferences.filter((conference) => conference.variant !== 'demo');

      return `
        <section class="timeline-slot">
          <div class="timeline-time">${escapeHtml(timeText)}</div>
          <div class="timeline-layout ${demoConferences.length ? 'has-demo-column' : ''}">
            <div class="timeline-cards">
              ${regularConferences.map((conference) => renderProgrammeCard(conference)).join('')}
            </div>
            ${demoConferences.length ? `<aside class="demo-column">${demoConferences.map((conference) => renderProgrammeCard(conference)).join('')}</aside>` : ''}
          </div>
        </section>
      `;
    })
    .join('');
}

async function loadProgramme() {
  const reloaded = await unregisterLegacyServiceWorkers();
  if (reloaded) {
    return;
  }

  try {
    const dataset = await fetchDataset();
    renderProgramme(dataset);
    document.getElementById('conference-count').textContent = dataset.conferences.length;
    document.getElementById('speaker-count').textContent = dataset.speakers.length;
    document.getElementById('salle-count').textContent = dataset.salles.length;
    const entrepriseCountNode = document.getElementById('entreprise-count');
    if (entrepriseCountNode) {
      entrepriseCountNode.textContent = dataset.entreprises.length;
    }
  } catch (error) {
    console.error(error);
    document.getElementById('programme-list').innerHTML = `
      <article class="empty-panel">
        <h3>Programme indisponible</h3>
        <p>Le chargement de l'API a échoué. Vérifiez que le serveur local répond bien sur les endpoints JSON.</p>
      </article>
    `;
  }
}

loadProgramme();