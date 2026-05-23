import { useState } from "react";
import "./calend_etd.css";

/* ─── Avatar colour palette ─── */
const PALETTE = [
  "#4f46e5","#0891b2","#059669","#d97706",
  "#dc2626","#7c3aed","#0d9488","#b45309",
];
const avatarColor = (str = "") =>
  PALETTE[(str.charCodeAt(0) + (str.charCodeAt(1) || 0)) % PALETTE.length];

/* ─── Locale helpers ─── */
const DAYS_SHORT  = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const DAYS_FULL   = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
const MONTHS_FR   = ["Janvier","Février","Mars","Avril","Mai","Juin",
                     "Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

const getMondayOf = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0,0,0,0);
  return d;
};

const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

const toYMD = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

const formatWeekRange = (monday) => {
  const sunday = addDays(monday, 6);
  if (monday.getMonth() === sunday.getMonth()) {
    return `${monday.getDate()} – ${sunday.getDate()} ${MONTHS_FR[monday.getMonth()]} ${monday.getFullYear()}`;
  }
  return `${monday.getDate()} ${MONTHS_FR[monday.getMonth()]} – ${sunday.getDate()} ${MONTHS_FR[sunday.getMonth()]} ${monday.getFullYear()}`;
};

const getDayName = (dateString) => {

  const days = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];

  // parse manuel باش مايزيدش timezone
  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return days[date.getDay()];
};

/* ─── Time grid config ─── */
const HOUR_START = 7;
const HOUR_END   = 20;
const SLOT_MINS  = 60;
const ROW_H      = 56;

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
  return m > 0 ? `${h}h${m.toString().padStart(2,"0")}` : `${h}h`;
};

/* ─── Monthly helpers ─── */
const getMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);
  // Start from Monday
  let startDow = firstDay.getDay(); // 0=Sun
  startDow = startDow === 0 ? 6 : startDow - 1; // Mon=0

  const days = [];
  // Fill leading empty slots
  for (let i = 0; i < startDow; i++) days.push(null);
  // Fill actual days
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
  // Fill trailing empty slots to complete 6 rows
  while (days.length % 7 !== 0) days.push(null);
  return days;
};

/* ─── SVG Icons ─── */
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
const CalMonthIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <rect x="7" y="14" width="3" height="3" rx="0.5"/>
  </svg>
);
const CalWeekIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/>
  </svg>
);

/* ══════════════════════════════════════
   Main Component
══════════════════════════════════════ */
export default function Calend_etd({ dataetd = [], DataSalleDispo = [] }) {
  const today = new Date();
  today.setHours(0,0,0,0);

  const [view,    setView]    = useState("week"); // "week" | "month"
  const [monday,  setMonday]  = useState(getMondayOf(today));
  const [month,   setMonth]   = useState(today.getMonth());
  const [year,    setYear]    = useState(today.getFullYear());
  const [tooltip, setTooltip] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null); // for month view detail

  const classeId  = dataetd?.[0]?.classe?.id;
  const classeNom = dataetd?.[0]?.classe?.nom_classe;

  const sessions = DataSalleDispo.filter(
    (v) => Number(v.id_classe) === Number(classeId)
  );

  /* Stats */
  const totalSessions = sessions.length;
  const activeDays    = new Set(sessions.map(s => s.jour)).size;
  const matieres      = new Set(sessions.map(s => s.filiere?.nom).filter(Boolean)).size;

  /* ── WEEK VIEW ── */
  const weekDays    = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const weekYMDs    = weekDays.map(toYMD);
  const weekSessions = sessions.filter(s => weekYMDs.includes(s.jour));
  const byDay = weekYMDs.reduce((acc, ymd) => {
    acc[ymd] = weekSessions.filter(s => s.jour === ymd);
    return acc;
  }, {});

  const hours = [];
  for (let h = HOUR_START; h <= HOUR_END; h++) hours.push(h);

  /* ── MONTH VIEW ── */
  const monthDays = getMonthDays(year, month);
  const byDayMonth = sessions.reduce((acc, s) => {
    if (!acc[s.jour]) acc[s.jour] = [];
    acc[s.jour].push(s);
    return acc;
  }, {});

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const showTooltip = (e, s) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ session: s, x: rect.right + 8, y: rect.top });
  };
  const hideTooltip = () => setTooltip(null);

  return (
    <div className="cal-page" onClick={() => { hideTooltip(); setSelectedDay(null); }}>

      {/* ── Header ── */}
      <div className="cal-header">
        <p className="cal-header__label">Emploi du temps</p>
        <h1 className="cal-header__title">Calendrier des cours</h1>
      </div>

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
          <p className="cal-stat__num cal-stat__num--blue">{matieres}</p>
          <p className="cal-stat__lbl">Matières</p>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="cal-nav">
        <span className="cal-nav__title">
          {view === "week"
            ? formatWeekRange(monday)
            : `${MONTHS_FR[month]} ${year}`}
        </span>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {/* View toggle */}
          <div className="cal-view-toggle">
            <button
              className={`cal-view-btn${view === "month" ? " active" : ""}`}
              onClick={(e) => { e.stopPropagation(); setView("month"); }}
            >
              <CalMonthIcon /> Mois
            </button>
            <button
              className={`cal-view-btn${view === "week" ? " active" : ""}`}
              onClick={(e) => { e.stopPropagation(); setView("week"); }}
            >
              <CalWeekIcon /> Semaine
            </button>
          </div>

          {/* Today */}
          <button className="cal-nav__today" onClick={(e) => {
            e.stopPropagation();
            if (view === "week") setMonday(getMondayOf(today));
            else { setMonth(today.getMonth()); setYear(today.getFullYear()); }
          }}>
            Aujourd'hui
          </button>

          {/* Arrows */}
          <div className="cal-nav__arrows">
            <button className="cal-nav__btn" onClick={(e) => {
              e.stopPropagation();
              view === "week" ? setMonday(p => addDays(p, -7)) : prevMonth();
            }}><ChevLeft /></button>
            <button className="cal-nav__btn" onClick={(e) => {
              e.stopPropagation();
              view === "week" ? setMonday(p => addDays(p, 7)) : nextMonth();
            }}><ChevRight /></button>
          </div>
        </div>
      </div>

      {/* ════════════ WEEKLY VIEW ════════════ */}
      {view === "week" && (
        <div className="cal-grid-wrap">
          <div className="cal-grid-scroll">
            <div className="cal-grid">

              <div className="cal-grid-head__corner" />
              {weekDays.map((day, di) => {
                const ymd     = toYMD(day);
                const isToday = ymd === toYMD(today);
                const hasSess = (byDay[ymd]?.length || 0) > 0;
                return (
                  <div key={di} className={`cal-grid-head__day${isToday ? " cal-grid-head__day--today" : ""}${hasSess ? " cal-grid-head__day--has-session" : ""}`}>
                    <span className="cal-grid-head__day-name">{DAYS_SHORT[di]}</span>
                    <span className="cal-grid-head__day-num">{day.getDate()}</span>
                    {hasSess && <span style={{ width:5, height:5, borderRadius:"50%", background:"#2563eb", marginTop:1 }} />}
                  </div>
                );
              })}

              {hours.map((hour, ri) => {
                const isLast = ri === hours.length - 1;
                return [
                  <div key={`t-${hour}`} className={`cal-grid-time${isLast ? " cal-grid-row-last" : ""}`}>
                    {hour < HOUR_END && <span className="cal-grid-time__label">{String(hour).padStart(2,"0")}:00</span>}
                  </div>,
                  ...weekDays.map((day, di) => {
                    const ymd = toYMD(day);
                    const isAlt = ri % 2 === 1;
                    const slotSessions = (byDay[ymd] || []).filter(s => {
                      const [h] = s.hour_debut.split(":").map(Number);
                      return h === hour;
                    });
                    return (
                      <div key={`c-${di}-${hour}`} className={`cal-grid-cell${isAlt ? " cal-grid-cell--alt" : ""}${isLast ? " cal-grid-row-last" : ""}`}>
                        {slotSessions.map((s, si) => {
                          const topRow   = timeToRow(s.hour_debut);
                          const botRow   = timeToRow(s.hour_fin);
                          const heightPx = Math.max((botRow - topRow) * ROW_H - 4, 24);
                          const topOff   = (topRow - Math.floor(topRow)) * ROW_H + 2;
                          const fColor   = avatarColor(s.filiere?.nom || "F");
                          return (
                            <div key={si} className="cal-session-block"
                              style={{ top: topOff, height: heightPx, background: fColor+"22", borderLeftColor: fColor, color: fColor }}
                              onClick={(e) => { e.stopPropagation(); showTooltip(e, s); }}
                              onMouseEnter={(e) => { e.stopPropagation(); showTooltip(e, s); }}
                              onMouseLeave={hideTooltip}
                            >
                              <p className="cal-session-block__time">{s.hour_debut?.slice(0,5)} – {s.hour_fin?.slice(0,5)}</p>
                              <p className="cal-session-block__name">{s.filiere?.nom || "—"}</p>
                              <p className="cal-session-block__salle">Salle {s.salle?.num_salle || "—"}</p>
                              <p className="cal-session-block__classe">Prof : {s.enseignement?.nom_e || "—"}</p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }),
                ];
              })}
            </div>

            {weekSessions.length === 0 && (
              <div className="cal-empty-week">Aucune séance cette semaine.</div>
            )}
          </div>
        </div>
      )}

      {/* ════════════ MONTHLY VIEW ════════════ */}
      {view === "month" && (
        <div className="cal-month-wrap">
          {/* Day headers */}
          <div className="cal-month-head">
            {DAYS_SHORT.map(d => (
              <div key={d} className="cal-month-head__cell">{d}</div>
            ))}
          </div>

          {/* Day cells grid */}
          <div className="cal-month-grid">
            {monthDays.map((day, i) => {
              if (!day) return <div key={i} className="cal-month-cell cal-month-cell--empty" />;

              const ymd       = toYMD(day);
              const isToday   = ymd === toYMD(today);
              const daySess   = byDayMonth[ymd] || [];
              const isSelected = selectedDay === ymd;
              const isOtherMonth = day.getMonth() !== month;

              return (
                <div
                  key={i}
                  className={`cal-month-cell${isToday ? " is-today" : ""}${isSelected ? " is-selected" : ""}${isOtherMonth ? " is-other-month" : ""}${daySess.length ? " has-sessions" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDay(isSelected ? null : ymd);
                  }}
                >
                  <span className="cal-month-cell__num">{day.getDate()}</span>

                  {/* Session pills (max 3 shown) */}
                  <div className="cal-month-cell__pills">
                    {daySess.slice(0, 3).map((s, si) => {
                      const fColor = avatarColor(s.filiere?.nom || "F");
                      return (
                        <div key={si} className="cal-month-pill"
                          style={{ background: fColor+"28", borderLeft: `2.5px solid ${fColor}`, color: fColor }}
                          onClick={(e) => { e.stopPropagation(); showTooltip(e, s); }}
                          onMouseEnter={(e) => { e.stopPropagation(); showTooltip(e, s); }}
                          onMouseLeave={hideTooltip}
                        >
                          <span className="cal-month-pill__time">{s.hour_debut?.slice(0,5)}</span>
                          <span className="cal-month-pill__name">{s.filiere?.nom || "—"}</span>
                        </div>
                      );
                    })}
                    {daySess.length > 3 && (
                      <div className="cal-month-pill cal-month-pill--more">
                        +{daySess.length - 3} autre{daySess.length - 3 > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Day detail panel */}
          {selectedDay && byDayMonth[selectedDay]?.length > 0 && (
            <div className="cal-day-detail" onClick={e => e.stopPropagation()}>
              <div className="cal-day-detail__header">
                <p className="cal-day-detail__label">Séances du jour</p>
                <p className="cal-day-detail__date">
                  {getDayName(selectedDay)} {new Date(selectedDay).getDate()} {MONTHS_FR[new Date(selectedDay).getMonth()]}
                </p>
              </div>
              <div className="cal-day-detail__list">
                {byDayMonth[selectedDay].map((s, i) => {
                  const fColor = avatarColor(s.filiere?.nom || "F");
                  return (
                    <div key={i} className="cal-day-detail__item" style={{ borderLeftColor: fColor }}>
                      <div className="cal-day-detail__item-left">
                        <p className="cal-day-detail__item-time">{s.hour_debut?.slice(0,5)} – {s.hour_fin?.slice(0,5)}</p>
                        <p className="cal-day-detail__item-dur">{getDuration(s.hour_debut, s.hour_fin)}</p>
                      </div>
                      <div className="cal-day-detail__item-right">
                        <p className="cal-day-detail__item-name" style={{ color: fColor }}>{s.filiere?.nom || "—"}</p>
                        <p className="cal-day-detail__item-sub">Salle {s.salle?.num_salle || "—"} · {s.enseignement?.nom_e || "—"}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {Object.keys(byDayMonth).filter(ymd => {
            const d = new Date(ymd);
            return d.getFullYear() === year && d.getMonth() === month;
          }).length === 0 && (
            <div className="cal-empty-week">Aucune séance ce mois-ci.</div>
          )}
        </div>
      )}

      {/* ── Tooltip ── */}
      {tooltip && (
        <div className="cal-tooltip is-visible"
          style={{ left: tooltip.x, top: tooltip.y }}
          onClick={e => e.stopPropagation()}
        >
          <p className="cal-tooltip__label">Détail séance</p>
          <p className="cal-tooltip__name">{tooltip.session.filiere?.nom || "—"}</p>
          <div className="cal-tooltip__row">
            <span className="cal-tooltip__key">Horaire</span>
            <span className="cal-tooltip__val">{tooltip.session.hour_debut?.slice(0,5)} – {tooltip.session.hour_fin?.slice(0,5)}</span>
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
            <span className="cal-tooltip__key">Professeur</span>
            <span className="cal-tooltip__val">{tooltip.session.enseignement?.nom_e || "—"}</span>
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