import {
  describeSalle,
  enrichConference,
  escapeHtml,
  fetchDataset,
  getActiveId,
  getEntrepriseSessions,
  getEntrepriseSpeakers,
  getSpeakerEntreprise,
  getSpeakerFullName,
  getSpeakerInitials,
  getSpeakerSessions,
  getSalleSessions,
  resolveSiteUrl,
  selectActive,
  unregisterLegacyServiceWorkers
} from './shared.js';

function renderConferenceDetail(conference) {
  const speakerMarkup = conference.speakers.length
    ? conference.speakers
        .map(
          (speaker) =>
            `<a class="link-pill" href="../speakers/?id=${encodeURIComponent(speaker.id)}">${escapeHtml(getSpeakerFullName(speaker))}</a>`
        )
        .join('')
    : '';

  const salleMarkup = conference.salles.length
    ? conference.salles
        .map(
          (salle) =>
            `<a class="link-pill" href="../salles/?id=${encodeURIComponent(salle.id)}">${escapeHtml(salle.nom)}</a>`
        )
        .join('')
    : '<span class="link-pill muted">Evenement general</span>';

  const entrepriseMarkup = conference.entreprises.length
    ? conference.entreprises
        .map(
          (entreprise) =>
            `<a class="link-pill" href="../entreprises/?id=${encodeURIComponent(entreprise.id)}">${escapeHtml(entreprise.nomEntreprise)}</a>`
        )
        .join('')
    : '';

  return `
    <article class="detail-card">
      <p class="eyebrow">Conference selectionnee</p>
      <h2>${escapeHtml(conference.nom)}</h2>
      <p class="detail-copy">${escapeHtml(conference.dateText)} · ${escapeHtml(conference.timeText)}</p>
      <div class="pill-row">${salleMarkup}</div>
      ${speakerMarkup ? `<div class="pill-row">${speakerMarkup}</div>` : ''}
      ${entrepriseMarkup ? `<div class="pill-row">${entrepriseMarkup}</div>` : ''}
    </article>
  `;
}

function renderConferenceCards(dataset, selectedConference) {
  return dataset.conferences
    .map((conference) => enrichConference(conference, dataset))
    .map((conference) => {
      const isActive = conference.id === selectedConference.id;
      return `
        <a class="directory-card ${isActive ? 'is-active' : ''}" href="?id=${encodeURIComponent(conference.id)}">
          <span class="card-kicker">${escapeHtml(conference.timeText)}</span>
          <h3>${escapeHtml(conference.nom)}</h3>
          <p>${escapeHtml(conference.salles.map((salle) => salle.nom).join(' · ') || 'Evenement general')}</p>
        </a>
      `;
    })
    .join('');
}

function renderSpeakerDetail(speaker, sessions) {
  const entreprise = speaker.entrepriseLink;
  const sessionMarkup = sessions.length
    ? sessions
        .map(
          (conference) => `
            <li class="session-row">
              <span class="session-time-strong">${escapeHtml(conference.timeText)}</span>
              <a href="../conferences/?id=${encodeURIComponent(conference.id)}">${escapeHtml(conference.nom)}</a>
              <span class="link-row">${conference.salles.length ? conference.salles.map((salle) => `<a href="../salles/?id=${encodeURIComponent(salle.id)}">${escapeHtml(salle.nom)}</a>`).join(' · ') : 'Evenement general'}</span>
              <span class="link-row">${conference.entreprises.length ? conference.entreprises.map((item) => `<a href="../entreprises/?id=${encodeURIComponent(item.id)}">${escapeHtml(item.nomEntreprise)}</a>`).join(' · ') : 'Aucune entreprise reliee'}</span>
            </li>
          `
        )
        .join('')
    : '<li class="session-row">Aucune conference reliee.</li>';

  return `
    <article class="detail-card detail-card-speaker">
      <div class="detail-speaker-head">
        <img class="detail-photo" src="${escapeHtml(resolveSiteUrl(speaker.photo))}" alt="Portrait de ${escapeHtml(getSpeakerFullName(speaker))}" />
        <div>
          <p class="eyebrow">Speaker selectionne</p>
          <h2>${escapeHtml(getSpeakerFullName(speaker))}</h2>
          <p class="detail-copy">${escapeHtml(String(sessions.length))} intervention(s) dans le programme.</p>
          ${entreprise ? `<p class="detail-copy"><a href="../entreprises/?id=${encodeURIComponent(entreprise.id)}">${escapeHtml(entreprise.nomEntreprise)}</a></p>` : ''}
        </div>
      </div>
      <ul class="session-list">${sessionMarkup}</ul>
    </article>
  `;
}

function renderSpeakerCards(dataset, selectedSpeaker) {
  return dataset.speakers
    .map((speaker) => {
      const isActive = speaker.id === selectedSpeaker.id;
      const sessions = getSpeakerSessions(speaker.id, dataset);
      const entreprise = getSpeakerEntreprise(speaker, dataset);
      return `
        <a class="directory-card speaker-card ${isActive ? 'is-active' : ''}" href="?id=${encodeURIComponent(speaker.id)}">
          <div class="speaker-card-head">
            <img class="directory-photo" src="${escapeHtml(resolveSiteUrl(speaker.photo))}" alt="Portrait de ${escapeHtml(getSpeakerFullName(speaker))}" />
            <span class="directory-initials">${escapeHtml(getSpeakerInitials(speaker))}</span>
          </div>
          <h3>${escapeHtml(getSpeakerFullName(speaker))}</h3>
          <p>${escapeHtml(entreprise?.nomEntreprise || 'Non communique')}</p>
          <p>${escapeHtml(String(sessions.length))} intervention(s)</p>
        </a>
      `;
    })
    .join('');
}

function renderSalleDetail(salle, sessions) {
  const sessionMarkup = sessions.length
    ? sessions
        .map(
          (conference) => `
            <li class="session-row">
              <span class="session-time-strong">${escapeHtml(conference.timeText)}</span>
              <a href="../conferences/?id=${encodeURIComponent(conference.id)}">${escapeHtml(conference.nom)}</a>
              ${conference.speakers.length ? `<span class="link-row">${conference.speakers.map((speaker) => `<a href="../speakers/?id=${encodeURIComponent(speaker.id)}">${escapeHtml(getSpeakerFullName(speaker))}</a>`).join(' · ')}</span>` : ''}
              ${conference.entreprises.length ? `<span class="link-row">${conference.entreprises.map((entreprise) => `<a href="../entreprises/?id=${encodeURIComponent(entreprise.id)}">${escapeHtml(entreprise.nomEntreprise)}</a>`).join(' · ')}</span>` : ''}
            </li>
          `
        )
        .join('')
    : '<li class="session-row">Aucune conference reliee.</li>';

  return `
    <article class="detail-card">
      <p class="eyebrow">Salle selectionnee</p>
      <h2>${escapeHtml(salle.nom)}</h2>
      <p class="detail-copy">${escapeHtml(describeSalle(salle))}</p>
      <ul class="session-list">${sessionMarkup}</ul>
    </article>
  `;
}

function renderEntrepriseDetail(entreprise, speakers, sessions) {
  const speakerMarkup = speakers.length
    ? speakers
        .map(
          (speaker) =>
            `<a class="link-pill" href="../speakers/?id=${encodeURIComponent(speaker.id)}">${escapeHtml(getSpeakerFullName(speaker))}</a>`
        )
        .join('')
    : '';

  const sessionMarkup = sessions.length
    ? sessions
        .map(
          (conference) => `
            <li class="session-row">
              <span class="session-time-strong">${escapeHtml(conference.timeText)}</span>
              <a href="../conferences/?id=${encodeURIComponent(conference.id)}">${escapeHtml(conference.nom)}</a>
              <span class="link-row">${conference.salles.length ? conference.salles.map((salle) => `<a href="../salles/?id=${encodeURIComponent(salle.id)}">${escapeHtml(salle.nom)}</a>`).join(' · ') : 'Evenement general'}</span>
            </li>
          `
        )
        .join('')
    : '<li class="session-row">Aucune conference reliee.</li>';

  return `
    <article class="detail-card detail-card-entreprise">
      <div class="detail-speaker-head">
        <img class="detail-logo" src="${escapeHtml(resolveSiteUrl(entreprise.logo))}" alt="Logo ${escapeHtml(entreprise.nomEntreprise)}" />
        <div>
          <p class="eyebrow">Entreprise selectionnee</p>
          <h2>${escapeHtml(entreprise.nomEntreprise)}</h2>
          <p class="detail-copy"><a href="${escapeHtml(entreprise.siteUrl)}" target="_blank" rel="noreferrer">Site de l'entreprise</a></p>
        </div>
      </div>
      ${speakerMarkup ? `<div class="pill-row">${speakerMarkup}</div>` : ''}
      <ul class="session-list">${sessionMarkup}</ul>
    </article>
  `;
}

function renderEntrepriseCards(dataset, selectedEntreprise) {
  return dataset.entreprises
    .map((entreprise) => {
      const isActive = entreprise.id === selectedEntreprise.id;
      const speakers = getEntrepriseSpeakers(entreprise.id, dataset);
      const sessions = getEntrepriseSessions(entreprise.id, dataset);
      return `
        <a class="directory-card entreprise-card ${isActive ? 'is-active' : ''}" href="?id=${encodeURIComponent(entreprise.id)}">
          <img class="directory-logo" src="${escapeHtml(resolveSiteUrl(entreprise.logo))}" alt="Logo ${escapeHtml(entreprise.nomEntreprise)}" />
          <h3>${escapeHtml(entreprise.nomEntreprise)}</h3>
          <p>${escapeHtml(`${speakers.length} speaker(s)`)} · ${escapeHtml(`${sessions.length} conference(s)`)}</p>
        </a>
      `;
    })
    .join('');
}

function renderSalleCards(dataset, selectedSalle) {
  return dataset.salles
    .map((salle) => {
      const isActive = salle.id === selectedSalle.id;
      const sessions = getSalleSessions(salle.id, dataset);
      return `
        <a class="directory-card ${isActive ? 'is-active' : ''}" href="?id=${encodeURIComponent(salle.id)}">
          <span class="card-kicker">${escapeHtml(`Etage ${salle.etage}`)}</span>
          <h3>${escapeHtml(salle.nom)}</h3>
          <p>${escapeHtml(`${salle.contenance} places · ${sessions.length} conference(s)`)}</p>
        </a>
      `;
    })
    .join('');
}

function renderDirectory(dataset, directoryType) {
  const detailContainer = document.getElementById('detail-card');
  const listContainer = document.getElementById('directory-list');
  const countNode = document.getElementById('directory-count');

  if (directoryType === 'conference') {
    const selected = selectActive(dataset.conferences, getActiveId());
    const conference = enrichConference(selected, dataset);
    detailContainer.innerHTML = renderConferenceDetail(conference);
    listContainer.innerHTML = renderConferenceCards(dataset, selected);
    countNode.textContent = `${dataset.conferences.length} conférences`;
    return;
  }

  if (directoryType === 'speaker') {
    const selected = selectActive(dataset.speakers, getActiveId());
    const sessions = getSpeakerSessions(selected.id, dataset);
    detailContainer.innerHTML = renderSpeakerDetail(
      {
        ...selected,
        entrepriseLink: getSpeakerEntreprise(selected, dataset)
      },
      sessions
    );
    listContainer.innerHTML = renderSpeakerCards(dataset, selected);
    countNode.textContent = `${dataset.speakers.length} speakers`;
    return;
  }

  if (directoryType === 'entreprise') {
    const selected = selectActive(dataset.entreprises, getActiveId());
    const speakers = getEntrepriseSpeakers(selected.id, dataset);
    const sessions = getEntrepriseSessions(selected.id, dataset);
    detailContainer.innerHTML = renderEntrepriseDetail(selected, speakers, sessions);
    listContainer.innerHTML = renderEntrepriseCards(dataset, selected);
    countNode.textContent = `${dataset.entreprises.length} entreprises`;
    return;
  }

  const selected = selectActive(dataset.salles, getActiveId());
  const sessions = getSalleSessions(selected.id, dataset);
  detailContainer.innerHTML = renderSalleDetail(selected, sessions);
  listContainer.innerHTML = renderSalleCards(dataset, selected);
  countNode.textContent = `${dataset.salles.length} salles`;
}

async function loadDirectory() {
  const reloaded = await unregisterLegacyServiceWorkers();
  if (reloaded) {
    return;
  }

  try {
    const dataset = await fetchDataset();
    renderDirectory(dataset, document.body.dataset.directory);
  } catch (error) {
    console.error(error);
    document.getElementById('detail-card').innerHTML = `
      <article class="empty-panel">
        <h3>Chargement impossible</h3>
        <p>Les pages détaillées dépendent des endpoints JSON du projet.</p>
      </article>
    `;
    document.getElementById('directory-list').innerHTML = '';
  }
}

loadDirectory();