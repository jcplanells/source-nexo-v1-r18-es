(function () {
  var target = document.getElementById('nx-widget-living');
  if (!target) return;

  var CONFIG_URL = 'https://opt.nexo.la/assets/json/living-banner.json';

  var ICONS = {
    star: '<path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5l3.5-.5L8 2z" stroke="#34CC03" stroke-width="1.2" stroke-linejoin="round"/>',
    bars: '<rect x="2" y="8" width="3" height="6" rx="1" stroke="#34CC03" stroke-width="1.2"/><rect x="6.5" y="5" width="3" height="9" rx="1" stroke="#34CC03" stroke-width="1.2"/><rect x="11" y="2" width="3" height="12" rx="1" stroke="#34CC03" stroke-width="1.2"/>'
  };

  var DEFAULTS = {
    enabled: true,
    label: 'Nexo Living',
    title: 'Datos reales del mercado inmobiliario en Panamá',
    highlight: 'inmobiliario',
    subtitle: 'Consulta transacciones de compraventa 2025–2026 en mapa interactivo.',
    cards: [
      { icon: 'star', title: 'Precio promedio por zona', subtitle: 'Compara áreas y segmentos' },
      { icon: 'bars', title: 'Precio/m² por PH', subtitle: 'Penthouse · Apartamentos' }
    ],
    stats: [
      { value: '+16,000', label: 'transacciones indexadas' },
      { value: '2025–2026', label: 'datos disponibles' }
    ],
    cta_primary: { text: 'Ver mapa gratis', url: 'https://nexo.la/nexoliving' },
    cta_secondary: { text: 'Explorar planes', url: 'https://nexo.la/oferta' }
  };

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function titleHtml(title, highlight) {
    var safeTitle = escapeHtml(title);
    if (!highlight) return safeTitle;
    var safeHighlight = escapeHtml(highlight);
    var idx = safeTitle.indexOf(safeHighlight);
    if (idx === -1) return safeTitle;
    return safeTitle.slice(0, idx) + '<span>' + safeHighlight + '</span>' + safeTitle.slice(idx + safeHighlight.length);
  }

  var css = `
    @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@900&family=Space+Grotesk:wght@400;500;600;700&display=swap');

    .nx-banner {
        background: #020202;
        width: 100%;
        height: 600px;
        border-radius: 10px;
        padding: 28px 22px 24px;
        position: relative;
        overflow: hidden;
        font-family: 'Space Grotesk', sans-serif;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
    }
    .nx-glow-top {
        position: absolute;
        top: -60px; right: -60px;
        width: 220px; height: 220px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(52,204,3,0.13) 0%, transparent 70%);
        pointer-events: none;
    }
    .nx-glow-bot {
        position: absolute;
        bottom: -40px; left: -40px;
        width: 160px; height: 160px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(52,204,3,0.07) 0%, transparent 70%);
        pointer-events: none;
    }
    .nx-logo {
        font-family: 'Barlow', sans-serif;
        font-weight: 900;
        font-size: 12px;
        color: rgba(255,255,255,0.2);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin-bottom: 14px;
    }
    .nx-logo span { color: #34CC03; }
    .nx-label {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(52,204,3,0.12);
        border: 1px solid rgba(52,204,3,0.3);
        color: #34CC03;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 4px 10px;
        border-radius: 100px;
        margin-bottom: 16px;
        width: fit-content;
    }
    .nx-dot { width: 5px; height: 5px; border-radius: 50%; background: #34CC03; flex-shrink: 0; }
    .nx-title {
        font-family: 'Barlow', sans-serif;
        font-weight: 900;
        font-size: 24px;
        line-height: 1.1;
        color: #fff;
        margin: 0 0 8px;
        letter-spacing: -0.02em;
    }
    .nx-title span { color: #34CC03; }
    .nx-sub {
        font-size: 12px;
        color: rgba(255,255,255,0.5);
        line-height: 1.6;
        margin: 0 0 20px;
    }
    .nx-divider { height: 1px; background: rgba(255,255,255,0.08); margin-bottom: 16px; }
    .nx-cards { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
    .nx-card {
        background: rgba(52,204,3,0.06);
        border: 1px solid rgba(52,204,3,0.15);
        border-radius: 8px;
        padding: 12px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .nx-icon {
        width: 28px; height: 28px;
        border-radius: 6px;
        background: rgba(52,204,3,0.12);
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
    }
    .nx-icon svg { width: 14px; height: 14px; }
    .nx-ct { font-size: 11px; font-weight: 600; color: #fff; margin-bottom: 1px; }
    .nx-cs { font-size: 10px; color: rgba(255,255,255,0.4); }
    .nx-stats { display: flex; margin-bottom: 20px; }
    .nx-stat { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .nx-stat:first-child { padding-right: 14px; border-right: 1px solid rgba(255,255,255,0.08); margin-right: 14px; }
    .nx-sv { font-family: 'Barlow', sans-serif; font-weight: 900; font-size: 17px; color: #34CC03; letter-spacing: -0.02em; }
    .nx-sl { font-size: 10px; color: rgba(255,255,255,0.4); line-height: 1.3; }
    .nx-spacer { flex: 1; }
    .nx-btn-p {
        background: #34CC03 !important;
        color: #020202 !important;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 13px;
        font-weight: 700;
        padding: 11px 16px;
        border-radius: 7px;
        border: none;
        cursor: pointer;
        text-decoration: none !important;
        display: flex !important;
        align-items: center;
        justify-content: center;
        gap: 5px;
        margin-bottom: 8px;
    }
    .nx-btn-s {
        color: rgba(255,255,255,0.45) !important;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 11px;
        font-weight: 500;
        display: flex !important;
        align-items: center;
        justify-content: center;
        gap: 4px;
        text-decoration: none !important;
    }
  `;

  function cardHtml(card) {
    return '' +
      '<div class="nx-card">' +
        '<div class="nx-icon"><svg viewBox="0 0 16 16" fill="none">' + (ICONS[card.icon] || ICONS.star) + '</svg></div>' +
        '<div>' +
          '<div class="nx-ct">' + escapeHtml(card.title) + '</div>' +
          '<div class="nx-cs">' + escapeHtml(card.subtitle) + '</div>' +
        '</div>' +
      '</div>';
  }

  function statHtml(stat) {
    return '' +
      '<div class="nx-stat">' +
        '<span class="nx-sv">' + escapeHtml(stat.value) + '</span>' +
        '<span class="nx-sl">' + escapeHtml(stat.label) + '</span>' +
      '</div>';
  }

  function render(config) {
    if (config.enabled === false) return;

    var cards = (config.cards || DEFAULTS.cards).map(cardHtml).join('');
    var stats = (config.stats || DEFAULTS.stats).map(statHtml).join('');
    var ctaPrimary = config.cta_primary || DEFAULTS.cta_primary;
    var ctaSecondary = config.cta_secondary || DEFAULTS.cta_secondary;

    var html = `
      <div class="nx-banner">
          <div class="nx-glow-top"></div>
          <div class="nx-glow-bot"></div>

          <div class="nx-logo">nexo<span>.</span>la</div>

          <div class="nx-label">
              <span class="nx-dot"></span>
              ${escapeHtml(config.label)}
          </div>

          <h3 class="nx-title">${titleHtml(config.title, config.highlight)}</h3>

          <p class="nx-sub">${escapeHtml(config.subtitle)}</p>

          <div class="nx-divider"></div>

          <div class="nx-cards">${cards}</div>

          <div class="nx-stats">${stats}</div>

          <div class="nx-spacer"></div>

          <a href="${escapeHtml(ctaPrimary.url)}" class="nx-btn-p">
              ${escapeHtml(ctaPrimary.text)}
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="#020202" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
          </a>
          <a href="${escapeHtml(ctaSecondary.url)}" class="nx-btn-s">
              ${escapeHtml(ctaSecondary.text)}
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6h7M7 3.5L9.5 6 7 8.5" stroke="rgba(255,255,255,0.45)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
          </a>
      </div>
    `;

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    target.innerHTML = html;
  }

  fetch(CONFIG_URL + '?v=' + Date.now())
    .then(function (r) { return r.ok ? r.json() : DEFAULTS; })
    .then(function (config) {
      render(Object.assign({}, DEFAULTS, config));
    })
    .catch(function () {
      render(DEFAULTS);
    });
})();
