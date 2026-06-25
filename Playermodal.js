/**
 * PlayerModal — Ventana de detalle de jugador estilo PES 6.
 *
 * USO:
 *   import PlayerModal from './PlayerModal.js';
 *   const modal = new PlayerModal();
 *   modal.open(jugadorPES6Player); // recibe una instancia de PES6Player
 *
 * El modal se construye una sola vez y se reutiliza (open/close).
 */

// ── TABLAS DE COLOR ──────────────────────────────────────────────────

/** Stats 1–99: devuelve la clase de color según el rango. */
function statClass99(value) {
  if (value >= 95) return 'stat-red';
  if (value >= 90) return 'stat-orange';
  if (value >= 80) return 'stat-yellow';
  if (value >= 75) return 'stat-green';
  return '';
}

/** Stats 1–8 (consistencia, pie malo, condición): devuelve la clase de color. */
function statClass8(value) {
  if (value >= 8) return 'stat-red';
  if (value >= 7) return 'stat-orange';
  return '';
}

/** Lesión: A = rojo, B = amarillo, C = sin color. */
function injuryClass(value) {
  const v = String(value).toUpperCase();
  if (v === 'A') return 'stat-red';
  if (v === 'B') return 'stat-yellow';
  return '';
}

/** Color de posición: delanteros=rojo, mediocampo=verde, defensores=azul, GK=naranja. */
function positionGroupClass(pos) {
  const FORWARDS  = ['CF', 'SS', 'WG'];
  const MIDFIELD  = ['AM', 'SM', 'CM', 'WB', 'DM'];
  const DEFENDERS = ['SB', 'CBT', 'CWP'];

  if (pos === 'GK') return 'pos-gk';
  if (FORWARDS.includes(pos)) return 'pos-fwd';
  if (MIDFIELD.includes(pos)) return 'pos-mid';
  if (DEFENDERS.includes(pos)) return 'pos-def';
  return 'pos-mid';
}

// Nombres legibles de cada stat 1–99, en el orden de las pantallas del PES6
const STAT_GROUP_1 = [
  ['attack',             'Attack'],
  ['defence',            'Defence'],
  ['balance',             'Body balance'],
  ['stamina',             'Stamina'],
  ['speed',               'Top speed'],
  ['acceleration',        'Acceleration'],
  ['response',            'Response'],
  ['agility',             'Agility'],
  ['dribbleAccuracy',     'Dribble acc.'],
  ['dribbleSpeed',        'Dribble speed'],
  ['shortPassAccuracy',   'S. Pass acc.'],
  ['shortPassSpeed',      'S. Pass speed'],
  ['longPassAccuracy',    'L. Pass acc.'],
  ['longPassSpeed',       'L. Pass speed'],
  ['shotAccuracy',        'Shot acc.'],
  ['shotPower',           'Shot power'],
  ['shotTechnique',       'Shot Technique'],
];

const STAT_GROUP_2 = [
  ['freeKickAccuracy', 'FK acc.'],
  ['swerve',           'Swerve'],
  ['heading',          'Header'],
  ['jump',             'Jump'],
  ['technique',        'Technique'],
  ['aggression',       'Aggression'],
  ['mentality',        'Mentality'],
  ['gkSkills',         'Keeper skills'],
  ['teamwork',         'Team work'],
];

// Habilidades especiales en el orden de las pantallas del PES6
const SPECIAL_SKILLS = [
  ['dribbling',       'Dribbling'],
  ['tacticalDribble', 'Tactical dribble'],
  ['positioning',     'Positioning'],
  ['reaction',        'Reaction'],
  ['playmaking',      'Playmaking'],
  ['passing',         'Passing'],
  ['scoring',         'Scoring'],
  ['oneOnOneScoring', '1-1 Score'],
  ['postPlayer',      'Post player'],
  ['lines',           'Lines'],
  ['middleShooting',  'Middle shooting'],
  ['side',            'Side'],
  ['centre',          'Centre'],
  ['penalties',       'Penalties'],
  ['oneTouchPass',    '1-Tch pass'],
  ['outside',         'Outside'],
  ['marking',         'Marking'],
  ['sliding',         'Sliding'],
  ['covering',        'Covering'],
  ['dLineControl',    'D-Line'],
  ['penaltyStopper',  'Penalty stopper'],
  ['oneOnOneStopper', '1-on-1 stopper'],
  ['longThrow',       'Long throw'],
];

class PlayerModal {

  constructor() {
    this._overlay = null;
    this._buildSkeleton();
  }

  /** Crea el overlay + contenedor una sola vez y lo agrega al body. */
  _buildSkeleton() {
    const overlay = document.createElement('div');
    overlay.className = 'pm-overlay';
    overlay.innerHTML = `
      <div class="pm-window" role="dialog" aria-modal="true">
        <button class="pm-close" aria-label="Cerrar">✕</button>
        <div class="pm-content"></div>
      </div>
    `;

    // Cerrar al hacer click afuera o en la X
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });
    overlay.querySelector('.pm-close').addEventListener('click', () => this.close());

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('pm-open')) this.close();
    });

    document.body.appendChild(overlay);
    this._overlay = overlay;
  }

  /** Genera una fila de stat 1–99 con su color. */
  _row99(label, value) {
    return `
      <div class="pm-row">
        <span class="pm-row-label">${label}</span>
        <span class="pm-row-val ${statClass99(value)}">${value}</span>
      </div>
    `;
  }

  /** Genera una fila de stat 1–8 con su color. */
  _row8(label, value) {
    return `
      <div class="pm-row">
        <span class="pm-row-label">${label}</span>
        <span class="pm-row-val ${statClass8(value)}">${value}</span>
      </div>
    `;
  }

  /** Genera la fila de lesión (Injury). */
  _rowInjury(value) {
    return `
      <div class="pm-row">
        <span class="pm-row-label">Injury</span>
        <span class="pm-row-val ${injuryClass(value)}">${value}</span>
      </div>
    `;
  }

  /** Genera una fila de habilidad especial con estrella si está activa. */
  _rowSkill(label, active) {
    return `
      <div class="pm-row">
        <span class="pm-row-label">${label}</span>
        <span class="pm-skill-star">${active ? '★' : ''}</span>
      </div>
    `;
  }

  /** Header con foto + datos personales del jugador. */
  _buildHeader(player, photoUrl, nationFlagUrl) {
    const posClass = positionGroupClass(player.registeredPosition);
    return `
      <div class="pm-header">
        <div class="pm-photo-wrap">
          ${photoUrl
            ? `<img class="pm-photo" src="${photoUrl}" alt="${player.fullName}" />`
            : `<div class="pm-photo-placeholder">👤</div>`
          }
        </div>
        <div class="pm-info">
          <div class="pm-info-row">
            <span class="pm-info-label">Height</span>
            <span class="pm-info-val">${player.height} cm</span>
          </div>
          <div class="pm-info-row">
            <span class="pm-info-label">Age</span>
            <span class="pm-info-val">${player.age}</span>
          </div>
          <div class="pm-info-row">
            <span class="pm-info-label">Nationality</span>
            <span class="pm-info-val">
              ${nationFlagUrl ? `<img class="pm-flag" src="${nationFlagUrl}" alt="${player.nationality}" />` : player.nationality}
            </span>
          </div>
          <div class="pm-info-row">
            <span class="pm-info-label">Foot</span>
            <span class="pm-info-val">${player.foot}</span>
          </div>
        </div>
      </div>
      <div class="pm-name-bar">
        <span class="pm-pos-tag ${posClass}">${player.registeredPosition}</span>
        <span class="pm-name">${player.fullName}</span>
      </div>
    `;
  }

  /** Sección de stats 1–99 (grupo 1) en formato tabla PES6. */
  _buildStatsGroup1(player) {
    const rows = STAT_GROUP_1.map(([prop, label]) => this._row99(label, player[prop])).join('');
    return `<div class="pm-table">${rows}</div>`;
  }

  /** Sección de stats 1–99 (grupo 2) + stats 1-8 + injury. */
  _buildStatsGroup2(player) {
    const rows = STAT_GROUP_2.map(([prop, label]) => this._row99(label, player[prop])).join('');
    const extra = `
      ${this._row8('Condition', player.condition)}
      ${this._row8('Weak foot acc.', player.weakFootAccuracy)}
      ${this._row8('Weak foot freq.', player.weakFootFrequency)}
      ${this._rowInjury(player.injuryTolerance)}
    `;
    return `<div class="pm-table">${rows}${extra}</div>`;
  }

  /** Sección de habilidades especiales (★ si está activa). */
  _buildSkills(player) {
    const rows = SPECIAL_SKILLS
      .map(([prop, label]) => this._rowSkill(label, player.specialSkills[prop]))
      .join('');
    return `<div class="pm-table pm-table--skills">${rows}</div>`;
  }

  /** Sección de posiciones habilitadas (★ si la juega) + lado/pie favorito. */
  _buildPositions(player) {
    const POSITION_LABELS = [
      ['CF',  'CF'],  ['SS',  'SS'],  ['WG',  'WF'],
      ['AM',  'AMF'], ['SM',  'SMF'], ['CM',  'CMF'],
      ['WB',  'WB'],  ['DM',  'DMF'], ['SB',  'SB'],
      ['CBT', 'CB'],  ['CWP', 'CWP'], ['GK',  'GK'],
    ];
    const rows = POSITION_LABELS.map(([prop, label]) => `
      <div class="pm-row">
        <span class="pm-row-label">${label}</span>
        <span class="pm-skill-star">${player.positions[prop] ? '★' : ''}</span>
      </div>
    `).join('');

    return `
      <div class="pm-table">
        ${rows}
        <div class="pm-row">
          <span class="pm-row-label">Fav. side/foot</span>
          <span class="pm-row-val">${player.side}&amp;${player.foot}</span>
        </div>
      </div>
    `;
  }

  /**
   * Abre el modal con los datos del jugador.
   * @param {PES6Player} player - instancia de PES6Player
   * @param {Object} [opts]
   * @param {string} [opts.photoUrl] - URL de la foto del jugador
   * @param {string} [opts.nationFlagUrl] - URL de la bandera
   */
  open(player, opts = {}) {
    const { photoUrl = null, nationFlagUrl = null } = opts;

    const content = this._overlay.querySelector('.pm-content');
    content.innerHTML = `
      ${this._buildHeader(player, photoUrl, nationFlagUrl)}

      <div class="pm-tabs">
        <button class="pm-tab active" data-tab="0">Stats 1</button>
        <button class="pm-tab" data-tab="1">Stats 2</button>
        <button class="pm-tab" data-tab="2">Skills</button>
        <button class="pm-tab" data-tab="3">Positions</button>
      </div>

      <div class="pm-panels">
        <div class="pm-panel active" data-panel="0">${this._buildStatsGroup1(player)}</div>
        <div class="pm-panel" data-panel="1">${this._buildStatsGroup2(player)}</div>
        <div class="pm-panel" data-panel="2">${this._buildSkills(player)}</div>
        <div class="pm-panel" data-panel="3">${this._buildPositions(player)}</div>
      </div>
    `;

    // Lógica de tabs (igual al L1/R1 del PES6 pero con click)
    const tabs   = content.querySelectorAll('.pm-tab');
    const panels = content.querySelectorAll('.pm-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        content.querySelector(`.pm-panel[data-panel="${tab.dataset.tab}"]`).classList.add('active');
      });
    });

    this._overlay.classList.add('pm-open');
    document.body.style.overflow = 'hidden';
  }

  /** Cierra el modal. */
  close() {
    this._overlay.classList.remove('pm-open');
    document.body.style.overflow = '';
  }
}

export default PlayerModal;