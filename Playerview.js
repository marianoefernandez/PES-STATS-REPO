/**
 * PlayerView — Vista de detalle de jugador estilo PES 6.
 *
 * A diferencia de un modal, esta vista ocupa toda la página y se integra
 * con el historial del navegador: al abrir un jugador se hace pushState,
 * y el botón "Atrás" del navegador (o el botón visual) vuelve al grid.
 *
 * USO:
 *   import PlayerView from './PlayerView.js';
 *   const view = new PlayerView({ onBack: () => grid.style.display = '' });
 *   view.open(jugadorPES6Player, { photoUrl, nationFlagUrl });
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

/** Stats 1–8 (weak foot, condición): devuelve la clase de color. */
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
  ['attack',           'Attack'],
  ['defence',          'Defence'],
  ['balance',          'Body balance'],
  ['stamina',          'Stamina'],
  ['speed',            'Top speed'],
  ['acceleration',     'Acceleration'],
  ['response',         'Response'],
  ['agility',          'Agility'],
  ['dribbleAccuracy',  'Dribble acc.'],
  ['dribbleSpeed',     'Dribble speed'],
  ['shortPassAccuracy','S. Pass acc.'],
  ['shortPassSpeed',   'S. Pass speed'],
  ['longPassAccuracy', 'L. Pass acc.'],
  ['longPassSpeed',    'L. Pass speed'],
  ['shotAccuracy',     'Shot acc.'],
  ['shotPower',        'Shot power'],
  ['shotTechnique',    'Shot Technique'],
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

// Posiciones habilitadas, en el orden de la pantalla 5/5 del PES6
const POSITION_LABELS = [
  ['CF',  'CF'],  ['SS',  'SS'],  ['WG',  'WF'],
  ['AM',  'AMF'], ['SM',  'SMF'], ['CM',  'CMF'],
  ['WB',  'WB'],  ['DM',  'DMF'], ['SB',  'SB'],
  ['CBT', 'CB'],  ['CWP', 'CWP'], ['GK',  'GK'],
];

class PlayerView {

  /**
   * @param {Object} [opts]
   * @param {Function} [opts.onBack] - callback ejecutado al volver al grid (atrás)
   */
  constructor(opts = {}) {
    this._onBack = opts.onBack ?? (() => {});
    this._root = null;
    this._buildSkeleton();

    // Si el usuario navega con el botón Atrás del navegador, volvemos al grid.
    window.addEventListener('popstate', (e) => {
      if (!e.state || e.state.pmView !== 'player') {
        this._hide();
        this._onBack();
      }
    });
  }

  /** Crea el contenedor de la vista una sola vez y lo agrega al body. */
  _buildSkeleton() {
    const root = document.createElement('div');
    root.className = 'pv-view';
    root.innerHTML = `
      <div class="pv-topbar">
        <button class="pv-back">
          <span class="pv-back-arrow">←</span> Volver
        </button>
        <button class="pv-copy">📋 Copy stats</button>
      </div>
      <div class="pv-content"></div>
    `;
    root.querySelector('.pv-back').addEventListener('click', () => this.back());
    document.body.appendChild(root);
    this._root = root;
  }

  /** Genera una fila de stat 1–99 con su color. */
  _row99(label, value) {
    return `
      <div class="pv-row">
        <span class="pv-row-label">${label}</span>
        <span class="pv-row-val ${statClass99(value)}">${value}</span>
      </div>
    `;
  }

  /** Genera una fila de stat 1–8 con su color. */
  _row8(label, value) {
    return `
      <div class="pv-row">
        <span class="pv-row-label">${label}</span>
        <span class="pv-row-val ${statClass8(value)}">${value}</span>
      </div>
    `;
  }

  /** Genera la fila de lesión (Injury). */
  _rowInjury(value) {
    return `
      <div class="pv-row">
        <span class="pv-row-label">Injury</span>
        <span class="pv-row-val ${injuryClass(value)}">${value}</span>
      </div>
    `;
  }

  /** Genera una fila de habilidad/posición con estrella si está activa. */
  _rowStar(label, active) {
    return `
      <div class="pv-row">
        <span class="pv-row-label">${label}</span>
        <span class="pv-skill-star">${active ? '★' : ''}</span>
      </div>
    `;
  }

  /**
   * Genera el texto plano con todas las stats del jugador para copiar al portapapeles.
   * Respeta los nombres exactos del formato PES6.
   */
  _buildStatsText(player) {
    // Posiciones: la registrada lleva ★, el resto sin estrella
    const posOrder = [
      ['CF','CF'],['SS','SS'],['WG','WF'],
      ['AM','AMF'],['SM','SMF'],['CM','CMF'],
      ['WB','WB'],['DM','DMF'],['SB','SB'],
      ['CBT','CB'],['CWP','CWP'],['GK','GK'],
    ];
    const posStr = posOrder
      .filter(([prop]) => player.positions[prop])
      .map(([prop, label]) =>
        prop === player.registeredPosition ? `${label}★` : label
      )
      .join(', ');

    // Skills activos con sus nombres exactos del PES6
    const SKILL_NAMES = {
      dribbling:       'Dribbling',
      tacticalDribble: 'Tactical Dribble',
      positioning:     'Positioning',
      reaction:        'Reaction',
      playmaking:      'Playmaking',
      passing:         'Passing',
      scoring:         'Scoring',
      oneOnOneScoring: '1-1 Scoring',
      postPlayer:      'Post Player',
      lines:           'Lines',
      middleShooting:  'Middle Shooting',
      side:            'Side',
      centre:          'Centre',
      penalties:       'Penalties',
      oneTouchPass:    '1-Touch Pass',
      outside:         'Outside',
      marking:         'Marking',
      sliding:         'Sliding',
      covering:        'Covering',
      dLineControl:    'D-Line Control',
      penaltyStopper:  'Penalty Stopper',
      oneOnOneStopper: '1-On-1 Stopper',
      longThrow:       'Long Throw',
    };

    const activeSkills = Object.entries(player.specialSkills)
      .filter(([, active]) => active)
      .map(([prop]) => `★ ${SKILL_NAMES[prop]}`)
      .join('\n');

    const lines = [
      `Name: ${player.fullName}`,
      `Shirt Name: ${player.lastName.toUpperCase()}`,
      `Positions: ${posStr}`,
      `Nationality: ${player.nationality}`,
      `Age: ${player.age}`,
      `Height: ${player.height} cm`,
      `Weight: ${player.weight} kg`,
      `Injury Tolerance: ${player.injuryTolerance}`,
      `Foot: ${player.foot}`,
      `Side: ${player.side}`,
      `Attack: ${player.attack}`,
      `Defence: ${player.defence}`,
      `Balance: ${player.balance}`,
      `Stamina: ${player.stamina}`,
      `Top Speed: ${player.speed}`,
      `Acceleration: ${player.acceleration}`,
      `Response: ${player.response}`,
      `Agility: ${player.agility}`,
      `Dribble Accuracy: ${player.dribbleAccuracy}`,
      `Dribble Speed: ${player.dribbleSpeed}`,
      `Short Pass Accuracy: ${player.shortPassAccuracy}`,
      `Short Pass Speed: ${player.shortPassSpeed}`,
      `Long Pass Accuracy: ${player.longPassAccuracy}`,
      `Long Pass Speed: ${player.longPassSpeed}`,
      `Shot Accuracy: ${player.shotAccuracy}`,
      `Shot Power: ${player.shotPower}`,
      `Shot Technique: ${player.shotTechnique}`,
      `Free Kick Accuracy: ${player.freeKickAccuracy}`,
      `Curling: ${player.swerve}`,
      `Header: ${player.heading}`,
      `Jump: ${player.jump}`,
      `Technique: ${player.technique}`,
      `Aggression: ${player.aggression}`,
      `Mentality: ${player.mentality}`,
      `Keeper Skills: ${player.gkSkills}`,
      `Teamwork: ${player.teamwork}`,
      `Condition/Fitness: ${player.condition}`,
      `Weak Foot Accuracy: ${player.weakFootAccuracy}`,
      `Weak Foot Frequency: ${player.weakFootFrequency}`,
    ];

    if (activeSkills) {
      lines.push('SPECIAL ABILITIES:');
      lines.push(activeSkills);
    }

    return lines.join('\n');
  }

  /** Copia las stats al portapapeles y da feedback visual en el botón. */
  async _copyStats(player, btn) {
    const text = this._buildStatsText(player);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback para navegadores sin Clipboard API
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    btn.textContent = '✓ Copied!';
    btn.classList.add('pv-copy--success');
    setTimeout(() => {
      btn.textContent = '📋 Copy stats';
      btn.classList.remove('pv-copy--success');
    }, 2000);
  }

  /** Header con foto + datos personales del jugador. */
  _buildHeader(player, photoUrl, nationFlagUrl) {
    const posClass = positionGroupClass(player.registeredPosition);
    return `
      <div class="pv-header">
        <div class="pv-photo-wrap">
          ${photoUrl
            ? `<img class="pv-photo" src="${photoUrl}" alt="${player.fullName}" />`
            : `<div class="pv-photo-placeholder">👤</div>`
          }
        </div>
        <div class="pv-info">
          <div class="pv-info-row">
            <span class="pv-info-label">Height</span>
            <span class="pv-info-val">${player.height} cm</span>
          </div>
          <div class="pv-info-row">
            <span class="pv-info-label">Age</span>
            <span class="pv-info-val">${player.age}</span>
          </div>
          <div class="pv-info-row">
            <span class="pv-info-label">Nationality</span>
            <span class="pv-info-val">
              ${nationFlagUrl ? `<img class="pv-flag" src="${nationFlagUrl}" alt="${player.nationality}" />` : player.nationality}
            </span>
          </div>
          <div class="pv-info-row">
            <span class="pv-info-label">Foot</span>
            <span class="pv-info-val">${player.foot}</span>
          </div>
        </div>
      </div>
      <div class="pv-name-bar">
        <span class="pv-pos-tag ${posClass}">${player.registeredPosition}</span>
        <span class="pv-name">${player.fullName}</span>
      </div>
    `;
  }

  /** Todas las secciones (stats, skills, positions) en una sola vista, en columnas. */
  _buildBody(player) {
    const statRows1 = STAT_GROUP_1.map(([prop, label]) => this._row99(label, player[prop])).join('');
    const statRows2 = STAT_GROUP_2.map(([prop, label]) => this._row99(label, player[prop])).join('');
    const extraRows = `
      ${this._row8('Condition', player.condition)}
      ${this._row8('Weak foot acc.', player.weakFootAccuracy)}
      ${this._row8('Weak foot freq.', player.weakFootFrequency)}
      ${this._rowInjury(player.injuryTolerance)}
    `;
    const skillRows = SPECIAL_SKILLS
      .map(([prop, label]) => this._rowStar(label, player.specialSkills[prop]))
      .join('');
    const positionRows = POSITION_LABELS
      .map(([prop, label]) => this._rowStar(label, player.positions[prop]))
      .join('');

    return `
      <div class="pv-grid">
        <div class="pv-section pv-section--stats1">
          <h3 class="pv-section-title">Stats (1)</h3>
          <div class="pv-table">${statRows1}</div>
        </div>

        <div class="pv-section pv-section--stats2">
          <h3 class="pv-section-title">Stats (2)</h3>
          <div class="pv-table">${statRows2}${extraRows}</div>
        </div>

        <div class="pv-section pv-section--skills">
          <h3 class="pv-section-title">Special skills</h3>
          <div class="pv-table">${skillRows}</div>
        </div>

        <div class="pv-section pv-section--positions">
          <h3 class="pv-section-title">Positions</h3>
          <div class="pv-table">
            ${positionRows}
            <div class="pv-row">
              <span class="pv-row-label">Fav. side</span>
              <span class="pv-row-val">${player.side}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Abre la vista de detalle del jugador, ocupando toda la página.
   * @param {PES6Player} player - instancia de PES6Player
   * @param {Object} [opts]
   * @param {string} [opts.photoUrl] - URL de la foto del jugador
   * @param {string} [opts.nationFlagUrl] - URL de la bandera
   */
  open(player, opts = {}) {
    const { photoUrl = null, nationFlagUrl = null } = opts;

    const content = this._root.querySelector('.pv-content');
    content.innerHTML = `
      ${this._buildHeader(player, photoUrl, nationFlagUrl)}
      ${this._buildBody(player)}
    `;

    // Apilamos un estado en el historial para poder volver con el botón Atrás.
    history.pushState({ pmView: 'player', playerId: player.id }, '', `#jugador-${player.id}`);

    // Conectamos el botón Copy stats al jugador actual
    const copyBtn = this._root.querySelector('.pv-copy');
    copyBtn.textContent = '📋 Copy stats';
    copyBtn.classList.remove('pv-copy--success');
    copyBtn.onclick = () => this._copyStats(player, copyBtn);

    this._show();

    // Forzamos el scroll al tope, tanto de la página como del contenedor de la vista.
    this._root.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  /** Vuelve al grid. Si hay historial propio, usa history.back(); si no, oculta directo. */
  back() {
    if (history.state && history.state.pmView === 'player') {
      history.back();
    } else {
      this._hide();
      this._onBack();
    }
  }

  _show() {
    this._root.classList.add('pv-open');
    document.body.classList.add('pv-locked');
  }

  _hide() {
    this._root.classList.remove('pv-open');
    document.body.classList.remove('pv-locked');
  }
}

export default PlayerView;