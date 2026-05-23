import { useState, useEffect, useRef } from 'react';
import './Calendrier.css';

/* ─── Category config ─── */
const CATEGORIES = [
  { key: 'class',    label: 'Cours',     emoji: '📚' },
  { key: 'exam',     label: 'Examen',    emoji: '📝' },
  { key: 'meeting',  label: 'Réunion',   emoji: '🤝' },
  { key: 'deadline', label: 'Échéance',  emoji: '⏰' },
  { key: 'personal', label: 'Personnel', emoji: '👤' },
  { key: 'holiday',  label: 'Congé',     emoji: '🎉' },
];
const CATEGORY_MAP = {};
CATEGORIES.forEach(c => { CATEGORY_MAP[c.key] = { label: c.label, emoji: c.emoji }; });

const DAY_NAMES       = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
const DAY_NAMES_FULL  = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
const MONTH_NAMES     = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const MONTH_NAMES_SHORT = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
const HOURS = ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];

/* ─── Helpers ─── */
const pad          = n  => n.toString().padStart(2, '0');
const toDateStr    = (y,m,d) => `${y}-${pad(m+1)}-${pad(d)}`;
const todayStr     = ()  => { const t = new Date(); return toDateStr(t.getFullYear(), t.getMonth(), t.getDate()); };
const getDaysInMonth    = (y,m) => new Date(y, m+1, 0).getDate();
const getFirstDayOfMonth = (y,m) => new Date(y, m, 1).getDay();
const formatDate   = ds => { const d = new Date(ds+'T00:00:00'); return `${DAY_NAMES_FULL[d.getDay()]} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`; };
const formatTime   = t  => { if (!t) return ''; const [h,m] = t.split(':'); return `${h}:${m}`; };
const getInitials  = (f,l) => `${f?.[0]||''}${l?.[0]||''}`.toUpperCase();

/* ─── Display helpers for salle_disponible events ─── */
const evTitle = ev =>
  ev.sujjets?.matiere_nom ?? ev.sujjet?.matiere_nom ?? `Séance #${ev.id}`;

const evSalleLabel = ev =>
  ev.salle?.num_salle ?? ev.num_salle ?? (ev.salle_id ? `Salle ${ev.salle_id}` : '');

/* ─── Avatar color helper ─── */
const AVATAR_COLORS = ['#3b82f6','#22c55e','#a855f7','#ef4444','#f59e0b','#ec4899','#14b8a6','#6366f1','#f97316','#0ea5e9'];
const avatarColor  = t => t.avatar ?? AVATAR_COLORS[(t.id ?? 0) % AVATAR_COLORS.length];

/* ── Step definitions ── */
const STEPS = [
  { key: 'filiere',      label: 'Filière',      icon: '🎓' },
  { key: 'classe',       label: 'Classe',        icon: '🏫' },
  { key: 'matiere',      label: 'Matière',       icon: '📚' },
  { key: 'enseignant',   label: 'Enseignant',    icon: '👩‍🏫' },
  { key: 'date',         label: 'Date & Heure',  icon: '📅' },
  { key: 'salle',        label: 'Salle',         icon: '🚪' },
  { key: 'confirmation', label: 'Confirmation',  icon: '✅' },
];

const emptySeance = () => ({
  id_filiere: '', id_classe: '', id_sujjets: '', id_enseignements: '',
  jour: todayStr(), hour_debut: '08:00', hour_fin: '09:30', salle_id: '',
});

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════ */
export default function Calendrier({
  dataClasse     = [],
  DataSalleDispo = [],
  DataSujjet     = [],
  salle          = [],
  enseignement   = [],
  Filieres       = [],
}) {
  const today = new Date();

  /* ── Calendar nav state ── */
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [view,  setView]  = useState('month');

  /* ── Data state ── */
  const [teachers,      setTeachers]      = useState(() => enseignement);
  const [nextTeacherId, setNextTeacherId] = useState(() => enseignement.length + 1);
  const [events,        setEvents]        = useState(() => DataSalleDispo);
  const [nextEventId,   setNextEventId]   = useState(() => DataSalleDispo.length + 1);

  /* ── Filter state ── */
  const [filterTeacherId,   setFilterTeacherId]   = useState(null);
  const [filterClasseId,    setFilterClasseId]    = useState(null);   // ← CLASS FILTER
  const [showTeacherFilter, setShowTeacherFilter] = useState(false);

  /* ── UI state ── */
  const [selectedDate, setSelectedDate] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  /* ── Step-form state ── */
  const [showStepForm, setShowStepForm] = useState(false);
  const [currentStep,  setCurrentStep]  = useState(0);
  const [seanceForm,   setSeanceForm]   = useState(emptySeance());

  /* ── Teacher modal state ── */
  const [showTeacherForm,  setShowTeacherForm]  = useState(false);
  const [teacherForm,      setTeacherForm]      = useState({ prenom_e:'', nom_e:'', telephone_e:'', sujjets:'', avatar:'#3b82f6' });
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [viewingTeacher,   setViewingTeacher]   = useState(null);
  const [deleteTeacher,    setDeleteTeacher]    = useState(null);

  /* ── Week nav ── */
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - d.getDay());
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  });

  /* ── Close teacher dropdown on outside click ── */
  const teacherFilterRef = useRef(null);
  useEffect(() => {
    const handler = e => {
      if (teacherFilterRef.current && !teacherFilterRef.current.contains(e.target)) {
        setShowTeacherFilter(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Maps ── */
  const teacherMap = {};
  teachers.forEach(t => { teacherMap[t.id] = t; });

  /* ─────────────────────────────────────────
     FILTERING  — teacher + class
  ───────────────────────────────────────── */
  const getFilteredEvents = () => {
    let evs = events;
    if (filterTeacherId !== null) evs = evs.filter(e => e.id_enseignements === filterTeacherId);
    if (filterClasseId  !== null) evs = evs.filter(e => Number(e.id_classe) === filterClasseId);
    return evs;
  };

  const getEventsByDate = () => {
    const map = {};
    getFilteredEvents().forEach(ev => {
      if (!ev.jour) return;
      if (!map[ev.jour]) map[ev.jour] = [];
      map[ev.jour].push(ev);
    });
    Object.values(map).forEach(arr =>
      arr.sort((a,b) => (a.hour_debut??'').localeCompare(b.hour_debut??''))
    );
    return map;
  };
  const eventsByDate = getEventsByDate();

  /* ── Month grid ── */
  const getMonthGrid = () => {
    const dim = getDaysInMonth(year, month);
    const fd  = getFirstDayOfMonth(year, month);
    const pm  = month === 0 ? 11 : month-1;
    const py  = month === 0 ? year-1 : year;
    const dip = getDaysInMonth(py, pm);
    const nm  = month === 11 ? 0 : month+1;
    const ny  = month === 11 ? year+1 : year;
    const cells = [];
    for (let i = fd-1; i >= 0; i--) cells.push({ date: toDateStr(py, pm, dip-i), day: dip-i, cur: false });
    for (let d = 1; d <= dim; d++)   cells.push({ date: toDateStr(year, month, d), day: d,     cur: true  });
    const rem = 42 - cells.length;
    for (let d = 1; d <= rem; d++)   cells.push({ date: toDateStr(ny, nm, d),      day: d,     cur: false });
    return cells;
  };
  const monthGrid = getMonthGrid();

  /* ── Week days ── */
  const weekDays = Array.from({ length:7 }, (_,i) => {
    const d = new Date(weekStart); d.setDate(d.getDate()+i);
    return { date: toDateStr(d.getFullYear(), d.getMonth(), d.getDate()), dayNum: d.getDate(), dayName: DAY_NAMES[d.getDay()] };
  });

  /* ── Stats (based on filtered events) ── */
  const getStats = () => {
    const ts = todayStr();
    const ws = new Date(weekStart);
    const we = new Date(weekStart); we.setDate(we.getDate()+6);
    const filtered = getFilteredEvents();
    return {
      todayEvents:  filtered.filter(e => e.jour === ts).length,
      weekEvents:   filtered.filter(e => { const ed = new Date((e.jour??'')+' 00:00'); return ed >= ws && ed <= we; }).length,
      futureEvents: filtered.filter(e => (e.jour??'') >= ts).length,
      teacherCount: teachers.length,
    };
  };
  const stats = getStats();

  /* ── Upcoming ── */
  const upcoming = getFilteredEvents()
    .filter(e => (e.jour??'') >= todayStr())
    .sort((a,b) => (a.jour??'').localeCompare(b.jour??'') || (a.hour_debut??'').localeCompare(b.hour_debut??''))
    .slice(0, 8);

  /* ─────────────────────────────────────────
     Step-form derived data
  ───────────────────────────────────────── */
  const getMatieresPourFiliere = () =>
    DataSujjet.filter(v =>
      Array.isArray(v.filieres) && v.filieres.some(f => f.id === Number(seanceForm.id_filiere))
    );

  const getClassesPourFiliere = () =>
    dataClasse.filter(v => Number(v.id_filiere) === Number(seanceForm.id_filiere));

  const getEnseignantsPourMatiere = () =>
    enseignement.filter(v => Number(v.id_jujjets) === Number(seanceForm.id_sujjets));

  const getSallesDisponibles = () =>
    salle.filter(s =>
      !DataSalleDispo.some(d => {
        if (Number(d.salle_id) !== Number(s.id) || d.jour !== seanceForm.jour) return false;
        const toMin = t => { const [h,m] = t.split(':'); return +h*60 + +m; };
        const [sE, eE] = [toMin(d.hour_debut), toMin(d.hour_fin)];
        const [sN, eN] = [toMin(seanceForm.hour_debut), toMin(seanceForm.hour_fin)];
        return sN < eE && eN > sE;
      })
    );

  /* ─────────────────────────────────────────
     Navigation
  ───────────────────────────────────────── */
  const goMonth = dir => {
    let nm = month+dir, ny = year;
    if (nm < 0)  { nm = 11; ny--; }
    if (nm > 11) { nm = 0;  ny++; }
    setMonth(nm); setYear(ny);
  };
  const goToday = () => {
    setMonth(today.getMonth()); setYear(today.getFullYear());
    const d = new Date(); d.setDate(d.getDate() - d.getDay());
    setWeekStart(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  };
  const goWeek = dir => setWeekStart(p => {
    const d = new Date(p); d.setDate(d.getDate() + dir*7); return d;
  });

  /* ─────────────────────────────────────────
     Step-form logic
  ───────────────────────────────────────── */
  const openStepForm = date => {
    setSeanceForm({ ...emptySeance(), jour: date || todayStr() });
    setCurrentStep(0);
    setShowStepForm(true);
  };

  const handleStepSelect = (field, value) => {
    const updated = { ...seanceForm, [field]: value };
    if (field === 'id_filiere') { updated.id_classe = ''; updated.id_sujjets = ''; updated.id_enseignements = ''; }
    if (field === 'id_sujjets') { updated.id_enseignements = ''; }
    setSeanceForm(updated);
    if (currentStep < STEPS.length - 1) setTimeout(() => setCurrentStep(s => s+1), 200);
  };

  const handleDateChange = (field, value) =>
    setSeanceForm(prev => ({ ...prev, [field]: value }));

  const advanceFromDate = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(s => s+1);
  };

  const goToStep = idx => { if (idx <= currentStep) setCurrentStep(idx); };

  const submitSeance = () => {
    const filiere    = Filieres.find(f => f.id === Number(seanceForm.id_filiere));
    const classeObj  = dataClasse.find(c => c.id === Number(seanceForm.id_classe));
    const matiere    = getMatieresPourFiliere().find(m => m.id === Number(seanceForm.id_sujjets));
    const enseignant = getEnseignantsPourMatiere().find(e => e.id === Number(seanceForm.id_enseignements));
    const salleObj   = salle.find(s => s.id === Number(seanceForm.salle_id));

    const newEvent = {
      id:               nextEventId,
      salle_id:         Number(seanceForm.salle_id),
      id_filiere:       Number(seanceForm.id_filiere),
      id_classe:        Number(seanceForm.id_classe),
      id_sujjets:       Number(seanceForm.id_sujjets),
      id_enseignements: Number(seanceForm.id_enseignements),
      jour:             seanceForm.jour,
      hour_debut:       seanceForm.hour_debut,
      hour_fin:         seanceForm.hour_fin,
      disponible:       true,
      sujjets:          matiere    ?? null,
      salle:            salleObj   ?? null,
      enseignement:     enseignant ?? null,
      filiere:          filiere    ?? null,
      classe:           classeObj  ?? null,
    };

    fetch('http://127.0.0.1:8000/api/sallesDisponiblesStore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(seanceForm),
    }).catch(console.error);

    setEvents(prev => [...prev, newEvent]);
    setNextEventId(n => n+1);
    setShowStepForm(false);
    setSeanceForm(emptySeance());
    setCurrentStep(0);
  };

  /* ─────────────────────────────────────────
     Event CRUD
  ───────────────────────────────────────── */
  const confirmDeleteEvent = () => {
  if (!deleteTarget) return;

  fetch(`http://127.0.0.1:8000/api/sallesDisponiblesDestroy/${deleteTarget.id}`, {
    method: 'DELETE',
  })
  .then(res => {
    if (!res.ok) {
      throw new Error('Delete failed');
    }
    return res.json();
  })
  .then(data => {
    console.log('Deleted:', data);

    // ✅ غير هنا نحيد من state
    setEvents(prev => prev.filter(e => e.id !== deleteTarget.id));
    setDeleteTarget(null);
  })
  .catch(err => {
    console.error(err);
    alert('Erreur lors de suppression ❌');
  });
};

  /* ─────────────────────────────────────────
     Teacher CRUD
  ───────────────────────────────────────── */
  const openAddTeacher = () => {
    setTeacherForm({ prenom_e:'', nom_e:'', telephone_e:'', sujjets:'', avatar:'#3b82f6' });
    setEditingTeacherId(null);
    setShowTeacherForm(true);
  };
  const openEditTeacher = t => {
    setTeacherForm({ prenom_e: t.prenom_e, nom_e: t.nom_e, telephone_e: t.telephone_e, sujjets: t.sujjets, avatar: avatarColor(t) });
    setEditingTeacherId(t.id);
    setShowTeacherForm(true);
    setViewingTeacher(null);
  };
  const submitTeacher = () => {
    if (!teacherForm.prenom_e.trim() || !teacherForm.nom_e.trim()) return;
    if (editingTeacherId !== null) {
      setTeachers(prev => prev.map(t => t.id === editingTeacherId ? { ...t, ...teacherForm } : t));
    } else {
      setTeachers(prev => [...prev, { id: nextTeacherId, ...teacherForm }]);
      setNextTeacherId(n => n+1);
    }
    setShowTeacherForm(false);
  };
  const confirmDeleteTeacher = () => {
    if (!deleteTeacher) return;
    setEvents(prev => prev.map(e => e.id_enseignements === deleteTeacher.id ? { ...e, id_enseignements: null } : e));
    setTeachers(prev => prev.filter(t => t.id !== deleteTeacher.id));
    if (filterTeacherId === deleteTeacher.id) setFilterTeacherId(null);
    setDeleteTeacher(null);
    setViewingTeacher(null);
  };

  const tchEvCount = id => events.filter(e => e.id_enseignements === id).length;
  const filterTch  = filterTeacherId !== null ? teacherMap[filterTeacherId] : null;
  const filterClasse = filterClasseId !== null ? dataClasse.find(c => c.id === filterClasseId) : null;

  /* ─────────────────────────────────────────
     Chip renderer
  ───────────────────────────────────────── */
  const renderChip = ev => {
    const tch   = ev.id_enseignements ? teacherMap[ev.id_enseignements] : null;
    const title = evTitle(ev);
    const cat   = ev.category ?? 'class';
    return (
      <div key={ev.id} className={`cal-chip cat-${cat}`}
        onClick={e => { e.stopPropagation(); setSelectedDate(ev.jour); }}
        title={`${title}${tch ? ` — ${tch.prenom_e} ${tch.nom_e}` : ''} (${formatTime(ev.hour_debut)}–${formatTime(ev.hour_fin)})`}>
        {tch && <span className="chip-dot" style={{ background: avatarColor(tch) }}/>}
        <span className="chip-time">{formatTime(ev.hour_debut)}</span>
        <span className="chip-title">{title}</span>
        {ev.classe?.nom_classe && <span className="chip-classe">{ev.classe.nom_classe}</span>}
      </div>
    );
  };

  /* ─────────────────────────────────────────
     Step content renderer
  ───────────────────────────────────────── */
  const renderStepContent = () => {
    switch (STEPS[currentStep].key) {

      case 'filiere':
        return (
          <div className="step-content">
            <div className="step-heading">
              <span className="step-icon-big">🎓</span>
              <h4>Choisissez une filière</h4>
              <p>Sélectionnez la filière concernée par cette séance</p>
            </div>
            <div className="step-cards">
              {Filieres.map(f => (
                <button key={f.id}
                  className={`step-card${seanceForm.id_filiere == f.id ? ' selected' : ''}`}
                  onClick={() => handleStepSelect('id_filiere', f.id)}>
                  <span className="sc-label">{f.nom}</span>
                  {f.code && <span className="sc-code">{f.code}</span>}
                  {seanceForm.id_filiere == f.id && <span className="sc-check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        );

      case 'classe': {
        const classes = getClassesPourFiliere();
        return (
          <div className="step-content">
            <div className="step-heading">
              <span className="step-icon-big">🏫</span>
              <h4>Choisissez une classe</h4>
              <p>Classes disponibles pour la filière sélectionnée</p>
            </div>
            {classes.length === 0
              ? <div className="step-empty">Aucune classe disponible pour cette filière</div>
              : <div className="step-cards">
                  {classes.map(c => (
                    <button key={c.id}
                      className={`step-card${seanceForm.id_classe == c.id ? ' selected' : ''}`}
                      onClick={() => handleStepSelect('id_classe', c.id)}>
                      <span className="sc-label">{c.nom_classe}</span>
                      {seanceForm.id_classe == c.id && <span className="sc-check">✓</span>}
                    </button>
                  ))}
                </div>
            }
          </div>
        );
      }

      case 'matiere': {
        const matieres = getMatieresPourFiliere();
        return (
          <div className="step-content">
            <div className="step-heading">
              <span className="step-icon-big">📚</span>
              <h4>Choisissez une matière</h4>
              <p>Matières disponibles pour la filière sélectionnée</p>
            </div>
            {matieres.length === 0
              ? <div className="step-empty">Aucune matière disponible pour cette filière</div>
              : <div className="step-cards">
                  {matieres.map(m => (
                    <button key={m.id}
                      className={`step-card${seanceForm.id_sujjets == m.id ? ' selected' : ''}`}
                      onClick={() => handleStepSelect('id_sujjets', m.id)}>
                      <span className="sc-label">{m.matiere_nom}</span>
                      {seanceForm.id_sujjets == m.id && <span className="sc-check">✓</span>}
                    </button>
                  ))}
                </div>
            }
          </div>
        );
      }

      case 'enseignant': {
        const enseignants = getEnseignantsPourMatiere();
        return (
          <div className="step-content">
            <div className="step-heading">
              <span className="step-icon-big">👩‍🏫</span>
              <h4>Choisissez un enseignant</h4>
              <p>Enseignants disponibles pour cette matière</p>
            </div>
            {enseignants.length === 0
              ? <div className="step-empty">Aucun enseignant disponible pour cette matière</div>
              : <div className="step-cards">
                  {enseignants.map(e => (
                    <button key={e.id}
                      className={`step-card enseignant-card${seanceForm.id_enseignements == e.id ? ' selected' : ''}`}
                      onClick={() => handleStepSelect('id_enseignements', e.id)}>
                      <div className="sc-avatar" style={{ background: avatarColor(e) }}>
                        {getInitials(e.nom_e, e.prenom_e)}
                      </div>
                      <div className="sc-info">
                        <span className="sc-name">{e.nom_e} {e.prenom_e}</span>
                        {e.grade && <span className="sc-grade">{e.grade}</span>}
                      </div>
                      {seanceForm.id_enseignements == e.id && <span className="sc-check">✓</span>}
                    </button>
                  ))}
                </div>
            }
          </div>
        );
      }

      case 'date':
        return (
          <div className="step-content">
            <div className="step-heading">
              <span className="step-icon-big">📅</span>
              <h4>Date & Horaire</h4>
              <p>Choisissez la date et les heures de début et de fin</p>
            </div>
            <div className="step-date-form">
              <div className="sdf-group">
                <label>Date</label>
                <input type="date" value={seanceForm.jour}
                  onChange={e => handleDateChange('jour', e.target.value)}/>
              </div>
              <div className="sdf-row">
                <div className="sdf-group">
                  <label>Heure de début</label>
                  <input type="time" value={seanceForm.hour_debut}
                    onChange={e => handleDateChange('hour_debut', e.target.value)}/>
                </div>
                <div className="sdf-group">
                  <label>Heure de fin</label>
                  <input type="time" value={seanceForm.hour_fin}
                    onChange={e => handleDateChange('hour_fin', e.target.value)}/>
                </div>
              </div>
              <button className="step-next-btn" onClick={advanceFromDate}>Continuer →</button>
            </div>
          </div>
        );

      case 'salle': {
        const sallesDisponibles = getSallesDisponibles();
        return (
          <div className="step-content">
            <div className="step-heading">
              <span className="step-icon-big">🚪</span>
              <h4>Choisissez une salle</h4>
              <p>Salles disponibles pour le créneau sélectionné</p>
            </div>
            {sallesDisponibles.length === 0
              ? <div className="step-empty">Aucune salle disponible pour ce créneau</div>
              : <div className="step-cards">
                  {sallesDisponibles.map(s => (
                    <button key={s.id}
                      className={`step-card${seanceForm.salle_id == s.id ? ' selected' : ''}`}
                      onClick={() => handleStepSelect('salle_id', s.id)}>
                      <span className="sc-room-icon">🚪</span>
                      <span className="sc-label">{s.num_salle}</span>
                      {s.capacite && <span className="sc-cap">👥 {s.capacite}</span>}
                      {seanceForm.salle_id == s.id && <span className="sc-check">✓</span>}
                    </button>
                  ))}
                </div>
            }
          </div>
        );
      }

      case 'confirmation': {
        const filiere    = Filieres.find(f => f.id === Number(seanceForm.id_filiere));
        const classeObj  = dataClasse.find(c => c.id === Number(seanceForm.id_classe));
        const matiere    = getMatieresPourFiliere().find(m => m.id === Number(seanceForm.id_sujjets));
        const enseignant = getEnseignantsPourMatiere().find(e => e.id === Number(seanceForm.id_enseignements));
        const salleObj   = salle.find(s => s.id === Number(seanceForm.salle_id));
        return (
          <div className="step-content">
            <div className="step-heading">
              <span className="step-icon-big">✅</span>
              <h4>Confirmer la séance</h4>
              <p>Vérifiez les informations avant de créer la séance</p>
            </div>
            <div className="step-summary">
              {[
                { icon:'🎓', label:'Filière',    value: filiere?.nom },
                { icon:'🏫', label:'Classe',     value: classeObj?.nom_classe },
                { icon:'📚', label:'Matière',    value: matiere?.matiere_nom },
                { icon:'👩‍🏫', label:'Enseignant', value: enseignant ? `${enseignant.nom_e} ${enseignant.prenom_e}` : null },
                { icon:'📅', label:'Date',       value: seanceForm.jour ? formatDate(seanceForm.jour) : null },
                { icon:'🕐', label:'Horaire',    value: `${formatTime(seanceForm.hour_debut)} – ${formatTime(seanceForm.hour_fin)}` },
                { icon:'🚪', label:'Salle',      value: salleObj?.num_salle },
              ].map((row,i) => (
                <div key={i} className="summary-row">
                  <span className="sum-icon">{row.icon}</span>
                  <span className="sum-label">{row.label}</span>
                  <span className="sum-value">{row.value || <em>Non défini</em>}</span>
                </div>
              ))}
            </div>
            <button className="step-submit-btn" onClick={submitSeance}>✅ Créer la séance</button>
          </div>
        );
      }

      default: return null;
    }
  };

  /* ════════════════════ RENDER ════════════════════ */
  return (
    <div className="cal-wrap">

      {/* ── STATS ── */}
      <div className="cal-stats-row">
        {[
          { icon:'📅', label:"Aujourd'hui",  val: stats.todayEvents,  sub:'événements prévus',    cls:'stat-today'   },
          { icon:'📆', label:'Cette semaine', val: stats.weekEvents,   sub:'événements planifiés', cls:'stat-week'    },
          { icon:'🗓️', label:'À venir',       val: stats.futureEvents, sub:'événements futurs',    cls:'stat-future'  },
          { icon:'👩‍🏫', label:'Enseignants',  val: stats.teacherCount, sub:'enseignants actifs',   cls:'stat-teacher' },
        ].map(s => (
          <div key={s.cls} className={`cal-stat ${s.cls}`}>
            <div className="stat-row">
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-label">{s.label}</span>
            </div>
            <div className="stat-val">{s.val}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── ACTIVE FILTERS BANNER ── */}
      {(filterTeacherId !== null || filterClasseId !== null) && (
        <div className="active-filters-bar">
          <span className="filter-bar-label">Filtres actifs :</span>
          {filterTch && (
            <span className="filter-tag">
              <span className="ftag-dot" style={{ background: avatarColor(filterTch) }}/>
              {filterTch.prenom_e} {filterTch.nom_e}
              <button onClick={() => setFilterTeacherId(null)} className="ftag-remove">×</button>
            </span>
          )}
          {filterClasse && (
            <span className="filter-tag">
              🏫 {filterClasse.nom_classe}
              <button onClick={() => setFilterClasseId(null)} className="ftag-remove">×</button>
            </span>
          )}
          <button className="filter-clear-all" onClick={() => { setFilterTeacherId(null); setFilterClasseId(null); }}>
            Tout effacer
          </button>
        </div>
      )}

      {/* ── MAIN ── */}
      <div className="cal-main">

        {/* CALENDAR PANEL */}
        <div className="cal-panel">
          <div className="cal-hdr">
            <div className="cal-hdr-left">
              <div className="cal-nav">
                <button className="nav-btn" onClick={() => view === 'month' ? goMonth(-1) : goWeek(-1)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button className="nav-btn" onClick={() => view === 'month' ? goMonth(1) : goWeek(1)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
              <h2 className="cal-title">
                {view === 'month'
                  ? `${MONTH_NAMES[month]} ${year}`
                  : (() => {
                      const e = new Date(weekStart); e.setDate(e.getDate()+6);
                      if (weekStart.getMonth() === e.getMonth())
                        return `${weekStart.getDate()} – ${e.getDate()} ${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getFullYear()}`;
                      return `${weekStart.getDate()} ${MONTH_NAMES_SHORT[weekStart.getMonth()]} – ${e.getDate()} ${MONTH_NAMES_SHORT[e.getMonth()]} ${weekStart.getFullYear()}`;
                    })()
                }
              </h2>
              <button className="today-btn" onClick={goToday}>Aujourd'hui</button>
            </div>

            <div className="cal-hdr-right">

              {/* ── CLASS FILTER ── */}
              <div className="classe-filter-wrap">
                <select
                  className={`classe-select${filterClasseId !== null ? ' active' : ''}`}
                  value={filterClasseId ?? ''}
                  onChange={e => setFilterClasseId(e.target.value === '' ? null : Number(e.target.value))}>
                  <option value="">Toutes les classes</option>
                  {dataClasse.map(c => (
                    <option key={c.id} value={c.id}>{c.nom_classe}</option>
                  ))}
                </select>
              </div>

              {/* ── TEACHER FILTER ── */}
              <div className="tch-filter-wrap" ref={teacherFilterRef}>
                <button
                  className={`tch-filter-btn${filterTeacherId !== null ? ' active' : ''}`}
                  onClick={() => setShowTeacherFilter(p => !p)}>
                  {filterTch
                    ? <><span className="tf-av" style={{ background: avatarColor(filterTch) }}>{getInitials(filterTch.prenom_e, filterTch.nom_e)}</span>{filterTch.prenom_e} {filterTch.nom_e}</>
                    : <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>Enseignant</>
                  }
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={showTeacherFilter ? 'chevron-open' : ''}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {showTeacherFilter && (
                  <div className="tch-dropdown">
                    <button className={`tch-dd-item${filterTeacherId === null ? ' sel' : ''}`}
                      onClick={() => { setFilterTeacherId(null); setShowTeacherFilter(false); }}>
                      <span className="tdd-av" style={{ fontSize:'14px' }}>👥</span>
                      <span className="tdd-info">
                        <span className="tdd-name">Tous les enseignants</span>
                        <span className="tdd-sub">{events.length} événements</span>
                      </span>
                      {filterTeacherId === null && <svg className="tdd-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </button>
                    <div className="tch-divider"/>
                    {teachers.map(t => (
                      <button key={t.id} className={`tch-dd-item${filterTeacherId === t.id ? ' sel' : ''}`}
                        onClick={() => { setFilterTeacherId(t.id); setShowTeacherFilter(false); }}>
                        <span className="tdd-av" style={{ background: avatarColor(t) }}>{getInitials(t.prenom_e, t.nom_e)}</span>
                        <span className="tdd-info">
                          <span className="tdd-name">{t.prenom_e} {t.nom_e}</span>
                          <span className="tdd-sub">{t.sujjets?.matiere_nom ?? t.sujjets ?? ''} · {tchEvCount(t.id)} évén.</span>
                        </span>
                        {filterTeacherId === t.id && <svg className="tdd-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="view-tabs">
                <button className={`view-tab${view === 'month' ? ' active' : ''}`} onClick={() => setView('month')}>Mois</button>
                <button className={`view-tab${view === 'week'  ? ' active' : ''}`} onClick={() => setView('week')}>Semaine</button>
              </div>

              <button className="add-btn" onClick={() => openStepForm()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Ajouter
              </button>
            </div>
          </div>

          {/* MONTH VIEW */}
          {view === 'month' && (
            <div className="cal-grid">
              {DAY_NAMES.map(d => <div key={d} className="grid-day-hdr">{d}</div>)}
              {monthGrid.map((cell,i) => {
                const dayEvs  = eventsByDate[cell.date] || [];
                const isToday = cell.date === todayStr();
                return (
                  <div key={i}
                    className={`grid-cell${cell.cur ? '' : ' other'}${isToday ? ' is-today' : ''}${selectedDate === cell.date ? ' is-sel' : ''}`}
                    onClick={() => setSelectedDate(cell.date)}>
                    <div className="cell-day-num">
                      {isToday ? <span className="today-circle">{cell.day}</span> : cell.day}
                    </div>
                    <div className="cell-events">
                      {dayEvs.slice(0,3).map(ev => renderChip(ev))}
                      {dayEvs.length > 3 && <div className="cell-more">+{dayEvs.length-3} autre{dayEvs.length-3 > 1 ? 's' : ''}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* WEEK VIEW */}
          {view === 'week' && (
            <div className="cal-week">
              <div className="wk-time-hdr"/>
              {weekDays.map(wd => (
                <div key={wd.date} className={`wk-day-hdr${wd.date === todayStr() ? ' is-today-wk' : ''}`}>
                  <span className="wk-day-name">{wd.dayName}</span>
                  <span className="wk-day-num">{wd.dayNum}</span>
                </div>
              ))}
              {HOURS.map(hour => (
                <div key={hour} style={{ display:'contents' }}>
                  <div className="wk-time-slot">{hour}</div>
                  {weekDays.map(wd => {
                    const h = parseInt(hour.split(':')[0]);
                    const dayEvs = (eventsByDate[wd.date] || [])
                      .filter(ev => parseInt((ev.hour_debut??'00:00').split(':')[0]) === h);
                    return (
                      <div key={wd.date+hour} className="wk-cell"
                        onClick={() => openStepForm(wd.date)}>
                        {dayEvs.map(ev => {
                          const cat = ev.category ?? 'class';
                          return (
                            <div key={ev.id} className={`wk-event cat-${cat}`}
                              onClick={e => { e.stopPropagation(); setSelectedDate(ev.jour); }}
                              title={evTitle(ev)}>
                              {evTitle(ev)}
                              {ev.classe?.nom_classe && ` · ${ev.classe.nom_classe}`}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── SIDEBAR ── */}
        <div className="cal-sidebar">

          {/* Teachers panel */}
          <div className="teachers-panel">
            <div className="panel-hdr">
              <h3>👩‍🏫 Enseignants <span className="panel-badge">{teachers.length}</span></h3>
              <button className="icon-add-btn" onClick={openAddTeacher} title="Ajouter">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
            <div className="teachers-list">
              {teachers.map(t => (
                <div key={t.id} className={`teacher-row${filterTeacherId === t.id ? ' active-filter' : ''}`} onClick={() => setViewingTeacher(t)}>
                  <div className="teacher-av" style={{ background: avatarColor(t) }}>{getInitials(t.prenom_e, t.nom_e)}</div>
                  <div className="teacher-info">
                    <div className="teacher-name">{t.prenom_e} {t.nom_e}</div>
                    <div className="teacher-subj">{t.sujjets?.matiere_nom ?? t.sujjets ?? ''}</div>
                  </div>
                  <span className="teacher-ev-count">{tchEvCount(t.id)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Classes panel */}
          {dataClasse.length > 0 && (
            <div className="classes-panel">
              <div className="panel-hdr">
                <h3>🏫 Classes <span className="panel-badge">{dataClasse.length}</span></h3>
                {filterClasseId !== null && (
                  <button className="filter-reset-btn" onClick={() => setFilterClasseId(null)}>
                    Tout afficher
                  </button>
                )}
              </div>
              <div className="classes-list">
                {dataClasse.map(c => {
                  const count = events.filter(e => Number(e.id_classe) === c.id).length;
                  const isActive = filterClasseId === c.id;
                  return (
                    <div key={c.id}
                      className={`classe-row${isActive ? ' active-filter' : ''}`}
                      onClick={() => setFilterClasseId(isActive ? null : c.id)}>
                      <div className="classe-icon">🏫</div>
                      <div className="classe-info">
                        <div className="classe-name">{c.nom_classe}</div>
                        {c.filiere?.nom && <div className="classe-filiere">{c.filiere.nom}</div>}
                      </div>
                      <span className="teacher-ev-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming panel */}
          <div className="upcoming-panel">
            <div className="panel-hdr">
              <h3>⏳ À venir</h3>
              <span className="panel-badge primary">{upcoming.length}</span>
            </div>
            <div className="upcoming-list">
              {upcoming.length === 0
                ? <div className="empty-state">📭 Aucun événement</div>
                : upcoming.map(ev => {
                    const evD = new Date((ev.jour??todayStr())+'T00:00:00');
                    const tch = ev.id_enseignements ? teacherMap[ev.id_enseignements] : null;
                    const cat = ev.category ?? 'class';
                    return (
                      <div key={ev.id} className="upcoming-item" onClick={() => setSelectedDate(ev.jour)}>
                        <div className={`upcoming-date cat-${cat}`}>
                          <span className="up-mo">{MONTH_NAMES_SHORT[evD.getMonth()]}</span>
                          <span className="up-d">{evD.getDate()}</span>
                        </div>
                        <div className="upcoming-info">
                          <div className="upcoming-title">{evTitle(ev)}</div>
                          {ev.classe?.nom_classe && (
                            <div className="upcoming-classe">🏫 {ev.classe.nom_classe}</div>
                          )}
                          <div className="upcoming-meta">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            {formatTime(ev.hour_debut)} – {formatTime(ev.hour_fin)}
                            {evSalleLabel(ev) && ` · ${evSalleLabel(ev)}`}
                          </div>
                          {tch && (
                            <div className="upcoming-tch">
                              <span className="utch-dot" style={{ background: avatarColor(tch) }}/>
                              {tch.prenom_e} {tch.nom_e}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
              }
            </div>
          </div>
        </div>
      </div>

      {/* ══ DAY DETAIL MODAL ══ */}
      {selectedDate && (
        <div className="overlay" onClick={() => setSelectedDate(null)}>
          <div className="modal day-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-hdr">
              <h3>{formatDate(selectedDate)}</h3>
              <button className="close-btn" onClick={() => setSelectedDate(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="modal-body">
              {(eventsByDate[selectedDate] || []).length === 0
                ? <div className="empty-state large">📭<br/>Aucun événement ce jour</div>
                : (eventsByDate[selectedDate] || []).map(ev => {
                    const tch = ev.id_enseignements ? teacherMap[ev.id_enseignements] : null;
                    const cat = ev.category ?? 'class';
                    return (
                      <div key={ev.id} className="detail-ev">
                        <div className={`detail-bar cat-${cat}`}/>
                        <div className="detail-info">
                          <div className="detail-title">{CATEGORY_MAP[cat]?.emoji} {evTitle(ev)}</div>
                          <div className="detail-time">
                            🕐 {formatTime(ev.hour_debut)} – {formatTime(ev.hour_fin)}
                            {evSalleLabel(ev) && <> &nbsp;📍 {evSalleLabel(ev)}</>}
                          </div>
                          {ev.description && <div className="detail-desc">{ev.description}</div>}
                          {tch && (
                            <div className="detail-tch">
                              <span className="det-av" style={{ background: avatarColor(tch) }}>{getInitials(tch.prenom_e, tch.nom_e)}</span>
                              {tch.prenom_e} {tch.nom_e}
                              {tch.sujjets && ` · ${tch.sujjets?.matiere_nom ?? tch.sujjets}`}
                            </div>
                          )}
                          {ev.classe?.nom_classe && (
                            <div className="detail-classe-row">
                              <span className="detail-classe-label">Classe :</span>
                              <span className={`cat-tag cat-${cat}`}>{ev.classe.nom_classe}</span>
                            </div>
                          )}
                        </div>
                        <div className="detail-actions">
                          <button className="action-btn danger" onClick={() => setDeleteTarget(ev)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </div>
                      </div>
                    );
                  })
              }
              <button className="dashed-add-btn" onClick={() => { openStepForm(selectedDate); setSelectedDate(null); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Ajouter une séance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ STEP FORM MODAL ══ */}
      {showStepForm && (
        <div className="overlay" onClick={() => setShowStepForm(false)}>
          <div className="modal step-modal" onClick={e => e.stopPropagation()}>
            <div className="step-indicator">
              {STEPS.map((s,i) => (
                <button key={s.key}
                  className={`step-pill${i === currentStep ? ' active' : ''}${i < currentStep ? ' done' : ''}${i > currentStep ? ' locked' : ''}`}
                  onClick={() => goToStep(i)}>
                  <span className="sp-icon">{i < currentStep ? '✓' : s.icon}</span>
                  <span className="sp-label">{s.label}</span>
                </button>
              ))}
            </div>
            <div className="step-progress-bar">
              <div className="step-progress-fill" style={{ width:`${(currentStep / (STEPS.length-1)) * 100}%` }}/>
            </div>
            <div className="modal-body step-body">
              {renderStepContent()}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowStepForm(false)}>Annuler</button>
              <div className="step-nav-btns">
                {currentStep > 0 && (
                  <button className="btn-prev" onClick={() => setCurrentStep(s => s-1)}>← Retour</button>
                )}
                <span className="step-counter">{currentStep+1} / {STEPS.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE EVENT MODAL ══ */}
      {deleteTarget && (
        <div className="overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon">🗑️</div>
            <h3>Supprimer l'événement ?</h3>
            <p>Supprimer <strong>"{evTitle(deleteTarget)}"</strong> ? Cette action est irréversible.</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setDeleteTarget(null)}>Annuler</button>
              <button className="btn-danger" onClick={confirmDeleteEvent}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ TEACHER DETAIL MODAL ══ */}
      {viewingTeacher && (
        <div className="overlay" onClick={() => setViewingTeacher(null)}>
          <div className="modal teacher-modal" onClick={e => e.stopPropagation()}>
            <div className="tch-modal-hdr">
              <div className="tch-modal-av" style={{ background: avatarColor(viewingTeacher) }}>
                {getInitials(viewingTeacher.prenom_e, viewingTeacher.nom_e)}
              </div>
              <div className="tch-modal-info">
                <h3>{viewingTeacher.prenom_e} {viewingTeacher.nom_e}</h3>
                <p>{viewingTeacher.sujjets?.matiere_nom ?? viewingTeacher.sujjets ?? ''}</p>
              </div>
              <div className="tch-modal-actions">
                <button className="action-btn" onClick={() => openEditTeacher(viewingTeacher)} title="Modifier">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button className="action-btn danger" onClick={() => setDeleteTeacher(viewingTeacher)} title="Supprimer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
                <button className="close-btn" onClick={() => setViewingTeacher(null)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
            <div className="modal-body">
              <div className="tch-stats-row">
                {[
                  { val: events.filter(e => e.id_enseignements === viewingTeacher.id).length, lbl:'Total' },
                  { val: events.filter(e => e.id_enseignements === viewingTeacher.id && (e.category??'class') === 'class').length, lbl:'Cours' },
                  { val: events.filter(e => e.id_enseignements === viewingTeacher.id && (e.jour??'') >= todayStr()).length, lbl:'À venir' },
                ].map((s,i) => (
                  <div key={i} className="tch-stat-box">
                    <div className="tsb-val">{s.val}</div>
                    <div className="tsb-lbl">{s.lbl}</div>
                  </div>
                ))}
              </div>
              <div className="tch-contact">
                <div className="tch-contact-row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.63 12.1 19.79 19.79 0 0 1 1.56 3.47 2 2 0 0 1 3.53 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  {viewingTeacher.telephone_e || '—'}
                </div>
              </div>
              <button className="filter-by-teacher-btn" onClick={() => { setFilterTeacherId(viewingTeacher.id); setViewingTeacher(null); }}>
                Filtrer le calendrier par cet enseignant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ TEACHER FORM MODAL ══ */}
      {showTeacherForm && (
        <div className="overlay" onClick={() => setShowTeacherForm(false)}>
          <div className="modal form-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-hdr">
              <h3>{editingTeacherId !== null ? '✏️ Modifier l\'enseignant' : '➕ Nouvel enseignant'}</h3>
              <button className="close-btn" onClick={() => setShowTeacherForm(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom *</label>
                  <input type="text" value={teacherForm.prenom_e} onChange={e => setTeacherForm(p => ({ ...p, prenom_e: e.target.value }))} placeholder="Marie" autoFocus/>
                </div>
                <div className="form-group">
                  <label>Nom *</label>
                  <input type="text" value={teacherForm.nom_e} onChange={e => setTeacherForm(p => ({ ...p, nom_e: e.target.value }))} placeholder="Johnson"/>
                </div>
              </div>
              <div className="form-group full">
                <label>Matière</label>
                <input type="text" value={teacherForm.sujjets} onChange={e => setTeacherForm(p => ({ ...p, sujjets: e.target.value }))} placeholder="Mathématiques"/>
              </div>
              <div className="form-group full">
                <label>Téléphone</label>
                <input type="text" value={teacherForm.telephone_e} onChange={e => setTeacherForm(p => ({ ...p, telephone_e: e.target.value }))} placeholder="0600000000"/>
              </div>
              <div className="form-group full">
                <label>Couleur</label>
                <div className="color-picker">
                  {AVATAR_COLORS.map(c => (
                    <button key={c} type="button" className={`color-swatch${teacherForm.avatar === c ? ' active' : ''}`} style={{ background: c }}
                      onClick={() => setTeacherForm(p => ({ ...p, avatar: c }))}>
                      {teacherForm.avatar === c && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowTeacherForm(false)}>Annuler</button>
              <button className="btn-submit" onClick={submitTeacher} disabled={!teacherForm.prenom_e.trim() || !teacherForm.nom_e.trim()}>
                {editingTeacherId !== null ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE TEACHER MODAL ══ */}
      {deleteTeacher && (
        <div className="overlay" onClick={() => setDeleteTeacher(null)}>
          <div className="modal confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon">🗑️</div>
            <h3>Supprimer l'enseignant ?</h3>
            <p>Supprimer <strong>{deleteTeacher.prenom_e} {deleteTeacher.nom_e}</strong> ? Ses {tchEvCount(deleteTeacher.id)} événement(s) ne seront plus assignés.</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setDeleteTeacher(null)}>Annuler</button>
              <button className="btn-danger" onClick={confirmDeleteTeacher}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}