// En Node.js:
import {parsePES6PlayersFromCSV} from './archivos.js'
class FIFACard {

  // ── CONSTRUCTOR ──────────────────────────────────────────────────────
  /**
   * @param {Object} [data={}] - Datos iniciales (todos opcionales)
   */
  constructor(data = {}) {
    this._name       = data.name       ?? 'JUGADOR';
    this._rating     = data.rating     ?? 75;
    this._pos        = data.pos        ?? 'ST';
    this._pac        = data.pac        ?? 70;
    this._sho        = data.sho        ?? 70;
    this._pas        = data.pas        ?? 70;
    this._dri        = data.dri        ?? 70;
    this._def        = data.def        ?? 30;
    this._phy        = data.phy        ?? 70;
    this._weakFoot      = data.weakFoot      ?? 3;
    this._dominantFoot  = data.dominantFoot  ?? 'R';   // 'R' = Right | 'L' = Left
    this._photo         = data.photo         ?? null;
    this._clubLogo   = data.clubLogo   ?? null;
    this._nationLogo      = data.nationLogo     ?? "fotos/nacionalidades/Argentina.png"

    this._element    = null; // referencia al DOM una vez renderizado
  }

  // ── SETTERS ENCADENABLES ─────────────────────────────────────────────

  /** @param {string} name @returns {FIFACard} */
  setName(name) { this._name = name; return this; }

  /** @param {number} rating (1–99) @returns {FIFACard} */
  setRating(rating) { this._rating = rating; return this; }

  /** @param {string} pos Posición: ST, CM, CB, LW… @returns {FIFACard} */
  setPosition(pos) { this._pos = pos; return this; }

  /**
   * Asigna los 6 stats de golpe.
   * @param {{ pac, sho, pas, dri, def, phy }} stats
   * @returns {FIFACard}
   */
  setStats({ pac, sho, pas, dri, def, phy }) {
    if (pac !== undefined) this._pac = pac;
    if (sho !== undefined) this._sho = sho;
    if (pas !== undefined) this._pas = pas;
    if (dri !== undefined) this._dri = dri;
    if (def !== undefined) this._def = def;
    if (phy !== undefined) this._phy = phy;
    return this;
  }

  /** @param {number} v (1–99) @returns {FIFACard} */
  setPac(v) { this._pac = v; return this; }
  /** @param {number} v (1–99) @returns {FIFACard} */
  setSho(v) { this._sho = v; return this; }
  /** @param {number} v (1–99) @returns {FIFACard} */
  setPas(v) { this._pas = v; return this; }
  /** @param {number} v (1–99) @returns {FIFACard} */
  setDri(v) { this._dri = v; return this; }
  /** @param {number} v (1–99) @returns {FIFACard} */
  setDef(v) { this._def = v; return this; }
  /** @param {number} v (1–99) @returns {FIFACard} */
  setPhy(v) { this._phy = v; return this; }

  /** @param {string} url URL de la foto del jugador @returns {FIFACard} */
  setPhoto(url) { this._photo = url; return this; }

  /** @param {string} url URL del escudo del club @returns {FIFACard} */
  setClubLogo(url) { this._clubLogo = url; return this; }

  /** @param {number} stars (1–5) @returns {FIFACard} */
  setWeakFoot(stars) { this._weakFoot = Math.min(5, Math.max(1, stars)); return this; }

  /**
   * Pie dominante del jugador.
   * @param {'D'|'I'} foot  'D' = Derecho, 'I' = Izquierdo
   * @returns {FIFACard}
   */
  setDominantFoot(foot) {
    const val = String(foot).toUpperCase();
    if (val !== 'R' && val !== 'L') {
      console.warn(`FIFACard.setDominantFoot(): valor inválido "${foot}". Usar 'R' o 'L'.`);
    }
    this._dominantFoot = val === 'L' ? 'L' : 'R';
    return this;
  }

  // ── MÉTODOS INTERNOS ─────────────────────────────────────────────────

  /** Genera el HTML de estrellas */
  _starsHTML(count) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      html += `<span class="star ${i <= count ? 'full' : 'empty'}">★</span>`;
    }
    return html;
  }

  /** Genera el HTML del pie dominante */
  _footHTML(foot) {
    const isRight = foot !== 'L';
    return `
      <div class="foot-label-row">
        <span class="foot-tag ${isRight ? 'dominant' : 'weak'}">R</span>
        <span class="foot-tag ${!isRight ? 'dominant' : 'weak'}">L</span>
      </div>
    `;
  }

  /** Genera el elemento DOM de la carta */
  _build() {
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <div class="card-shine"></div>

      <div class="card-top">
        <div class="card-meta">
          <div class="card-rating">${this._rating}</div>
          <div class="card-pos">${this._pos}</div>
          <div class="card-flags">
            ${this._clubLogo
              ? `<img class="flag" src="${this._nationLogo}" alt="club" />`
              : `<div class="club-badge">No registrado</div>`
            }
            ${this._clubLogo
              ? `<img class="club-logo-img" src="${this._clubLogo}" alt="club" />`
              : `<div class="club-badge">CLUB</div>`
            }
          </div>
        </div>

        <div class="player-img-area">
          ${this._photo
            ? `<img class="player-photo" src="${this._photo}" alt="${this._name}" />`
            : `<div class="player-silhouette">
                <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24"
                     fill="none" stroke="rgba(42,26,0,0.18)" stroke-width="1.5"
                     stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="7" r="4"/>
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
                </svg>
              </div>`
          }
        </div>
      </div>

      <div class="divider"></div>
      <div class="card-name">${this._name}</div>
      <div class="divider"></div>

      <div class="stats-grid">
        <div class="stats-col">
          <div class="stat"><span class="stat-val">${this._pac}</span><span class="stat-lbl">PAC</span></div>
          <div class="stat"><span class="stat-val">${this._sho}</span><span class="stat-lbl">SHO</span></div>
          <div class="stat"><span class="stat-val">${this._pas}</span><span class="stat-lbl">PAS</span></div>
        </div>
        <div class="stats-divider"></div>
        <div class="stats-col">
          <div class="stat"><span class="stat-val">${this._dri}</span><span class="stat-lbl">DRI</span></div>
          <div class="stat"><span class="stat-val">${this._def}</span><span class="stat-lbl">DEF</span></div>
          <div class="stat"><span class="stat-val">${this._phy}</span><span class="stat-lbl">PHY</span></div>
        </div>
      </div>

      <div class="extras">
        <div class="extra-item">
          <div class="extra-label">Weak foot</div>
          <div class="stars">${this._starsHTML(this._weakFoot)}</div>
        </div>
        <div class="extra-item extra-item--foot">
          <div class="extra-label">Preferred foot</div>
          ${this._footHTML(this._dominantFoot)}
        </div>
      </div>
    `;
    return el;
  }

  // ── API PÚBLICA ──────────────────────────────────────────────────────

  /**
   * Construye el elemento DOM y lo inserta en un contenedor.
   * @param {string|HTMLElement} container - Selector CSS o elemento DOM
   * @param {'append'|'prepend'|'replace'} [mode='append']
   * @returns {FIFACard} para seguir encadenando si es necesario
   */
  render(container, mode = 'append') {
    const target = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    if (!target) {
      console.error(`FIFACard.render(): contenedor "${container}" no encontrado.`);
      return this;
    }

    this._element = this._build();

    if (mode === 'prepend')      target.prepend(this._element);
    else if (mode === 'replace') target.replaceWith(this._element);
    else                         target.append(this._element);

    return this;
  }

  /**
   * Devuelve el elemento DOM sin insertarlo en ningún lado.
   * Útil para manipularlo antes de agregarlo al DOM manualmente.
   * @returns {HTMLElement}
   */
  toElement() {
    this._element = this._build();
    return this._element;
  }

  /**
   * Elimina la carta del DOM (si fue renderizada).
   * @returns {FIFACard}
   */
  remove() {
    this._element?.remove();
    this._element = null;
    return this;
  }
}

function limpiarContenedor()
  {
    setTimeout(() => {
      const div = document.getElementById('cards-grid');
      div.innerHTML = ""
    }, 100);
  }

async function imprimirCartas(cartas)
{
  setTimeout(() => {
      cartas.forEach(stats => {
      new FIFACard({
        ...stats,
      }).render('#cards-grid');
    });
  }, 100);
}
//REEMPLAZAR CSV LUEGO POR DB
const JUGADORES = await fetch("jugadores.csv")
  .then(r => r.text())
  .then(parsePES6PlayersFromCSV);


async function crearCartas(pais)
{
  const cartas = []

  JUGADORES.forEach( async jugador => {
    if(pais == "cualquiera" || pais == jugador.nationality)
    {
      console.log(pais)
      console.log(jugador.nationality)
      const rating = jugador.getOverallRating()
      const carta = await jugador.getCardObject(rating);
      cartas.push(carta);
    }
  })
  return cartas
}

window.imprimirCartasPais = async (pais) => {
  await limpiarContenedor()
  const cartas = await crearCartas(pais)
  await imprimirCartas(cartas);
};

const cartas = await crearCartas("Argentina")
await imprimirCartas(cartas);
//limpiarContenedor();