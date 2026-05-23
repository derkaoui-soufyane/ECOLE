import { useState } from "react";
import "./ense_calendrier.css";

/* ─── Avatar colour palette (same as student page) ─── */
const PALETTE = [
  "#4f46e5","#0891b2","#059669","#d97706",
  "#dc2626","#7c3aed","#0d9488","#b45309",
];
const avatarColor = (str = "") =>
  PALETTE[(str.charCodeAt(0) + (str.charCodeAt(1) || 0)) % PALETTE.length];

const initials = (nom = "", prenom = "") =>
  `${(nom[0] || "").toUpperCase()}${(prenom[0] || "").toUpperCase()}`;

/* ─── Locale helpers ─── */
const DAYS_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS_FR  = ["Janvier","Février","Mars","Avril","Mai","Juin",
                    "Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

/* Monday of the ISO week that contains `date` */
const getMondayOf = (date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

const toYMD = (date) => date.toISOString().slice(0, 10);

const formatWeekRange = (monday) => {
  const sunday = addDays(monday, 6);
  if (monday.getMonth() === sunday.getMonth()) {
    return `${monday.getDate()} – ${sunday.getDate()} ${MONTHS_FR[monday.getMonth()]} ${monday.getFullYear()}`;
  }
  return `${monday.getDate()} ${MONTHS_FR[monday.getMonth()]} – ${sunday.getDate()} ${MONTHS_FR[sunday.getMonth()]} ${monday.getFullYear()}`;
};

/* ─── Time grid config ─── */
const HOUR_START = 7;   // 07:00
const HOUR_END   = 20;  // 20:00 (exclusive, last label is 19:00)
const SLOT_MINS  = 60;  // 1 row = 1 hour
const ROW_H      = 56;  // px — keep in sync with CSS --row-h

const timeToRow = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return ((h - HOUR_START) * 60 + m) / SLOT_MINS;
};

const getDuration = (debut, fin) => {
  const [dh, dm] = debut.split(":").map(Number);
  const [fh, fm] = fin.split(":").map(Number);
  const total = (fh * 60 + fm) - (dh * 60 + dm);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m > 0 ? `${h}h${m.toString().padStart(2, "0")}` : `${h}h`;
};

/* ─── Inline SVG icons ─── */
const ChevLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ChevRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

/* ══════════════════════════════════════
   Main component
══════════════════════════════════════ */
export default function Ense_calendrier({ prof = [], DataSalleDispo = [] }) {
  const today    = new Date();
  today.setHours(0, 0, 0, 0);

  const [monday, setMonday] = useState(getMondayOf(today));
  const [tooltip, setTooltip] = useState(null); // { session, x, y }

  const profData = prof[0] || {};
  const idp      = profData.id;
  const profName = `${profData.nom || ""} ${profData.prenom || ""}`.trim() || "Enseignant";
  const color    = avatarColor(profData.nom || "P");
  const inits    = initials(profData.nom, profData.prenom) || "P";

  /* All sessions for this teacher */
  const sessions = DataSalleDispo.filter(v => v.id_enseignements === idp);

  /* Sessions for the current week, keyed by YMD */
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const weekYMDs = weekDays.map(toYMD);

  const weekSessions = sessions.filter(s => weekYMDs.includes(s.jour));

  /* Map: YMD → sessions[] */
  const byDay = weekYMDs.reduce((acc, ymd) => {
    acc[ymd] = weekSessions.filter(s => s.jour === ymd);
    return acc;
  }, {});

  /* Stats (all-time) */
  const totalSessions = sessions.length;
  const activeDays    = new Set(sessions.map(s => s.jour)).size;
  const filieres      = new Set(sessions.map(s => s.filiere?.nom).filter(Boolean)).size;

  /* Time rows */
  const hours = [];
  for (let h = HOUR_START; h <= HOUR_END; h++) hours.push(h);
  const totalRows = HOUR_END - HOUR_START;

  /* Nav */
  const prevWeek  = () => setMonday(prev => addDays(prev, -7));
  const nextWeek  = () => setMonday(prev => addDays(prev, 7));
  const goToToday = () => setMonday(getMondayOf(today));

  /* Tooltip handlers */
  const showTooltip = (e, s) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ session: s, x: rect.right + 8, y: rect.top });
  };
  const hideTooltip = () => setTooltip(null);

  return (
    <div className="cal-page" onClick={hideTooltip}>

      {/* ── Page header ── */}
      <div className="cal-header">
        <p className="cal-header__label">Emploi du temps</p>
        <h1 className="cal-header__title">Calendrier des séances</h1>
      </div>

      {/* ── Prof card ── */}
      

      {/* ── Stats ── */}
      <div className="cal-stats">
        <div className="cal-stat">
          <p className="cal-stat__num">{totalSessions}</p>
          <p className="cal-stat__lbl">Total séances</p>
        </div>
        <div className="cal-stat">
          <p className="cal-stat__num cal-stat__num--green">{activeDays}</p>
          <p className="cal-stat__lbl">Jours actifs</p>
        </div>
        <div className="cal-stat">
          <p className="cal-stat__num cal-stat__num--blue">{filieres}</p>
          <p className="cal-stat__lbl">Filières</p>
        </div>
      </div>

      {/* ── Week nav ── */}
      <div className="cal-nav">
        <span className="cal-nav__title">{formatWeekRange(monday)}</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="cal-nav__today" onClick={(e) => { e.stopPropagation(); goToToday(); }}>
            Aujourd'hui
          </button>
          <div className="cal-nav__arrows">
            <button className="cal-nav__btn" onClick={(e) => { e.stopPropagation(); prevWeek(); }}>
              <ChevLeft />
            </button>
            <button className="cal-nav__btn" onClick={(e) => { e.stopPropagation(); nextWeek(); }}>
              <ChevRight />
            </button>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="cal-grid-wrap">
        <div className="cal-grid-scroll">
          <div className="cal-grid">

            {/* Column headers */}
            <div className="cal-grid-head__corner" />
            {weekDays.map((day, di) => {
              const ymd      = toYMD(day);
              const isToday  = toYMD(day) === toYMD(today);
              const hasSess  = byDay[ymd]?.length > 0;
              return (
                <div
                  key={di}
                  className={`cal-grid-head__day${isToday ? " cal-grid-head__day--today" : ""}${hasSess ? " cal-grid-head__day--has-session" : ""}`}
                >
                  <span className="cal-grid-head__day-name">{DAYS_SHORT[di]}</span>
                  <span className="cal-grid-head__day-num">{day.getDate()}</span>
                  {hasSess && (
                    <span style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: "#2563eb", marginTop: 1,
                    }} />
                  )}
                </div>
              );
            })}

            {/* Time rows */}
            {hours.map((hour, ri) => {
              const isLast = ri === hours.length - 1;
              return [
                /* Time label */
                <div
                  key={`t-${hour}`}
                  className={`cal-grid-time${isLast ? " cal-grid-row-last" : ""}`}
                >
                  {hour < HOUR_END && (
                    <span className="cal-grid-time__label">
                      {String(hour).padStart(2, "0")}:00
                    </span>
                  )}
                </div>,

                /* Day cells for this hour */
                ...weekDays.map((day, di) => {
                  const ymd      = toYMD(day);
                  const isAlt    = ri % 2 === 1;
                  const isLast2  = isLast;

                  /* Sessions that START in this hour slot */
                  const slotSessions = (byDay[ymd] || []).filter(s => {
                    const [h] = s.hour_debut.split(":").map(Number);
                    return h === hour;
                  });

                  return (
                    <div
                      key={`c-${di}-${hour}`}
                      className={`cal-grid-cell${isAlt ? " cal-grid-cell--alt" : ""}${isLast2 ? " cal-grid-row-last" : ""}`}
                    >
                      {slotSessions.map((s, si) => {
                        const topRow    = timeToRow(s.hour_debut);
                        const botRow    = timeToRow(s.hour_fin);
                        const heightPx  = Math.max((botRow - topRow) * ROW_H - 4, 24);
                        const topOffset = (topRow - Math.floor(topRow)) * ROW_H + 2;
                        const fColor    = avatarColor(s.filiere?.nom || "F");

                        /* Lighter background: hex + 22 = ~13% opacity */
                        const bgColor   = fColor + "22";
                        const border    = fColor;

                        return (
                          <div
                            key={si}
                            className="cal-session-block"
                            style={{
                              top: topOffset,
                              height: heightPx,
                              background: bgColor,
                              borderLeftColor: border,
                              color: fColor,
                            }}
                            onClick={(e) => { e.stopPropagation(); showTooltip(e, s); }}
                            onMouseEnter={(e) => { e.stopPropagation(); showTooltip(e, s); }}
                            onMouseLeave={hideTooltip}
                          >
                            <p className="cal-session-block__time">
                              {s.hour_debut} – {s.hour_fin}
                            </p>
                            <p className="cal-session-block__name">
                              {s.filiere?.nom || "—"}
                            </p>
                            <p className="cal-session-block__salle">
                              Salle {s.salle?.num_salle || "—"}
                            </p>
                            <p className="cal-session-block__classe">
                              classe : {s.classe?.nom_classe || "—"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  );
                }),
              ];
            })}

          </div>

          {/* Empty week message */}
          {weekSessions.length === 0 && (
            <div className="cal-empty-week">Aucune séance cette semaine.</div>
          )}
        </div>
      </div>

      {/* ── Floating tooltip ── */}
      {tooltip && (
        <div
          className={`cal-tooltip is-visible`}
          style={{ left: tooltip.x, top: tooltip.y }}
          onClick={e => e.stopPropagation()}
        >
          <p className="cal-tooltip__label">Détail séance</p>
          <p className="cal-tooltip__name">{tooltip.session.filiere?.nom || "—"}</p>
          <div className="cal-tooltip__row">
            <span className="cal-tooltip__key">Horaire</span>
            <span className="cal-tooltip__val">{tooltip.session.hour_debut} – {tooltip.session.hour_fin}</span>
          </div>
          <div className="cal-tooltip__row">
            <span className="cal-tooltip__key">Durée</span>
            <span className="cal-tooltip__val">{getDuration(tooltip.session.hour_debut, tooltip.session.hour_fin)}</span>
          </div>
          <div className="cal-tooltip__row">
            <span className="cal-tooltip__key">Salle</span>
            <span className="cal-tooltip__val">{tooltip.session.salle?.num_salle || "—"}</span>
          </div>
          <div className="cal-tooltip__row">
            <span className="cal-tooltip__key">Date</span>
            <span className="cal-tooltip__val">{tooltip.session.jour}</span>
          </div>
        </div>
      )}

    </div>
  );
}