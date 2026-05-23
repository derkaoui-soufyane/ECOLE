import { useState, useMemo } from "react";
import "./note_ense.css";

/* ─── Avatar colour palette ─── */
const PALETTE = [
  "#4f46e5","#0891b2","#059669","#d97706",
  "#dc2626","#7c3aed","#0d9488","#b45309",
];
const avatarColor = (str = "") =>
  PALETTE[(str.charCodeAt(0) + (str.charCodeAt(1) || 0)) % PALETTE.length];
const initials = (nom = "", prenom = "") =>
  `${(nom[0] || "").toUpperCase()}${(prenom[0] || "").toUpperCase()}`;

/* ─── Icons ─── */
const Icon = {
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Plus: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Close: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Edit: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Trash: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/>
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
  ),
  User: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
};

/* ─── Helpers ─── */
const barWidth = (n, max = 20) => {
  const v = parseFloat(n);
  return isNaN(v) ? 0 : Math.min(100, Math.round((v / max) * 100));
};
const barColor = (n) => {
  const v = parseFloat(n);
  if (isNaN(v)) return "#d1d5db";
  if (v >= 14) return "#16a34a";
  if (v >= 10) return "#d97706";
  return "#dc2626";
};
const gradeBadge = (v) => {
  if (v >= 14) return { cls: "badge-success", label: "Admis" };
  if (v >= 10) return { cls: "badge-warning", label: "Passable" };
  return { cls: "badge-danger", label: "Insuffisant" };
};

/* ══════════════════════════════════════
   Add / Edit grade modal
   ══════════════════════════════════════ */
function GradeModal({ mode, student, students, prof, initialNote, gradeEntry, onSave, onClose }) {
  const [error, setError] = useState("");
  const [obj, setObj] = useState({
    etudiant_id:  student?._id ?? student?.id ?? "",
    id_filieres:  "",
    sujjet_id:    gradeEntry?.sujjet_id ?? prof[0]?.id_jujjets ?? "",
    note:         initialNote ?? "",
    cofficients:  gradeEntry?.sujjet?.coefficient ?? prof[0]?.sujjet?.coefficient ?? "",
    note_id:      gradeEntry?.id ?? "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObj(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!obj.etudiant_id) { setError("Veuillez choisir un étudiant."); return; }
    const v = parseFloat(obj.note);
    if (isNaN(v) || v < 0 || v > 20) { setError("La note doit être entre 0 et 20."); return; }
    setError("");
    onSave(obj, mode);
  };

  const subjectOptions = prof.map(p => ({
    id:    p.id_jujjets ?? p.id_sujjet ?? p.sujjet_id,
    label: p.sujjet?.matiere_nom ?? p.matiere ?? `Sujet #${p.id_jujjets}`,
  }));

  return (
    <div className="ne-modal-overlay" onClick={onClose}>
      <div className="ne-modal-box" onClick={e => e.stopPropagation()}>

        <div className="ne-modal-header">
          <div style={{ flex: 1 }}>
            <p className="ne-modal-label">
              {mode === "edit" ? "Modifier la note" : "Ajouter une note"}
            </p>
            {student ? (
              <p className="ne-modal-title">{student.nom} {student.prenom}</p>
            ) : (
              <div className="ne-field-group" style={{ marginTop: 10, marginBottom: 0 }}>
                <label className="ne-field-label">Étudiant <span className="ne-required">*</span></label>
                <select className="ne-field-select" name="etudiant_id" value={obj.etudiant_id} onChange={handleChange}>
                  <option value="">Choisir un étudiant…</option>
                  {(students ?? []).map(v => (
                    <option key={v.id} value={v.id}>{v.nom} {v.prenom}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <button className="ne-btn-close-modal" onClick={onClose}><Icon.Close /></button>
        </div>

        <div className="ne-modal-body">

          {/* Subject: dropdown in add mode, readonly in edit */}
          <div className="ne-field-group">
            <label className="ne-field-label">Matière</label>
            {mode === "edit" ? (
              <input
                className="ne-field-input ne-field-readonly"
                value={gradeEntry?.sujjet?.matiere_nom ?? subjectOptions[0]?.label ?? ""}
                readOnly
              />
            ) : (
              <select className="ne-field-select" name="sujjet_id" value={obj.sujjet_id} onChange={handleChange}>
                {subjectOptions.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            )}
          </div>

          <div className="ne-field-group">
            <label className="ne-field-label">Coefficient</label>
            <input
              type="number"
              className="ne-field-input"
              name="cofficients"
              placeholder="Coefficient"
              value={obj.cofficients}
              onChange={handleChange}
            />
          </div>

          <div className="ne-field-group">
            <label className="ne-field-label">Note <span className="ne-required">*</span></label>
            <input
              type="number"
              min="0" max="20" step="0.25"
              placeholder="Ex : 15.5"
              name="note"
              value={obj.note}
              onChange={handleChange}
              className={`ne-field-input${error ? " ne-field-input--error" : ""}`}
              autoFocus
            />
            {error && <p className="ne-field-error">{error}</p>}
            {!isNaN(parseFloat(obj.note)) && (
              <div style={{ marginTop: 10 }}>
                <div className="ne-preview-bar-wrap">
                  <div className="ne-preview-bar" style={{ width: `${barWidth(obj.note)}%`, background: barColor(obj.note) }} />
                </div>
                <p className="ne-preview-hint">Aperçu : {parseFloat(obj.note).toFixed(2)} / 20</p>
              </div>
            )}
          </div>
        </div>

        <div className="ne-modal-footer">
          <button className="ne-btn-cancel" onClick={onClose}>Annuler</button>
          <button className="ne-btn-save" onClick={handleSave}>
            {mode === "edit" ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   Detail Panel
   ══════════════════════════════════════ */
function DetailPanel({ student, id_sujjetprof, onClose, onEditGrade, onDeleteGrade }) {
  const [activeTab, setActiveTab] = useState("notes");
  const isOpen = !!student;
  const s = student || {};
  const color = avatarColor(s.nom || "");
  const cls = s.classe?.nom_classe ?? s.classe ?? "—";

  /*
   * Only include notes whose sujjet_id is in this teacher's subject list.
   */
  const gradeList = useMemo(() => {
    if (!s.notes) return [];
    return s.notes
      .filter(n => id_sujjetprof.includes(n.sujjet_id))
      .map(n => ({
        id:        n.id,
        sujjet_id: n.sujjet_id,
        matiere:   n.sujjet?.matiere_nom ?? `Matière #${n.sujjet_id}`,
        coeff:     parseFloat(n.sujjet?.coefficient ?? n.coefficient),
        note:      parseFloat(n.note ?? n.sujjet?.note),
        raw:       n,
      }))
      .filter(g => !isNaN(g.note));
  }, [s.notes, id_sujjetprof]);

  /* Average — weighted if coefficients exist, simple otherwise */
  const avg = useMemo(() => {
    if (!gradeList.length) return null;
    const valid = gradeList.filter(g => !isNaN(g.coeff));
    if (valid.length) {
      const sumW  = valid.reduce((a, g) => a + g.coeff, 0);
      const sumWN = valid.reduce((a, g) => a + g.note * g.coeff, 0);
      return sumW ? (sumWN / sumW).toFixed(2) : null;
    }
    return (gradeList.reduce((a, g) => a + g.note, 0) / gradeList.length).toFixed(2);
  }, [gradeList]);

  return (
    <>
      {isOpen && <div className="ne-panel-backdrop" onClick={onClose} />}
      <aside className={`ne-detail-panel${isOpen ? " is-open" : ""}`}>

        {/* Close button row */}
        <div className="ne-panel-hero-bar">
          <button className="ne-btn-close-panel" onClick={onClose}><Icon.Close /></button>
        </div>

        {/* Hero */}
        <div className="ne-panel-hero">
          <div className="ne-panel-avatar" style={{ background: color }}>
            {initials(s.nom, s.prenom)}
          </div>
          <div className="ne-panel-hero-info">
            <p className="ne-panel-name">{s.nom} {s.prenom}</p>
            <p className="ne-panel-meta">{cls}</p>
            {s.email && <p className="ne-panel-meta">{s.email}</p>}
          </div>
        </div>

        {/* Summary chips */}
        <div className="ne-panel-chips">
          <div className="ne-chip">
            <span className="ne-chip-val">{gradeList.length}</span>
            <span className="ne-chip-lbl">Notes</span>
          </div>
          <div className="ne-chip ne-chip--accent">
            <span className="ne-chip-val">{avg !== null ? `${avg}/20` : "—"}</span>
            <span className="ne-chip-lbl">Moyenne</span>
          </div>
          <div className="ne-chip">
            <span className="ne-chip-val">{gradeList.filter(g => g.note >= 10).length}</span>
            <span className="ne-chip-lbl">Admis</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="ne-panel-tabs">
          <button className={`ne-tab${activeTab === "notes" ? " is-active" : ""}`} onClick={() => setActiveTab("notes")}>
            Notes ({gradeList.length})
          </button>
          <button className={`ne-tab${activeTab === "info" ? " is-active" : ""}`} onClick={() => setActiveTab("info")}>
            <Icon.User /> Profil
          </button>
        </div>

        {/* Scrollable body */}
        <div className="ne-panel-body">

          {/* ── NOTES TAB ── */}
          {activeTab === "notes" && (
            <div className="ne-tab-content">
              {gradeList.length === 0 ? (
                <div className="ne-empty-grades">
                  <div className="ne-empty-icon">📋</div>
                  <p className="ne-empty-title">Aucune note saisie</p>
                  <p className="ne-empty-sub">Les notes de cet étudiant pour vos matières apparaîtront ici.</p>
                </div>
              ) : (
                <div className="ne-grades-list">
                  {gradeList.map((g) => {
                    const badge = gradeBadge(g.note);
                    return (
                      <div key={g.id ?? g.sujjet_id} className="ne-grade-item">

                        {/* Subject name + action buttons */}
                        <div className="ne-grade-item-head">
                          <div className="ne-grade-item-meta">
                            <span className="ne-grade-item-name">{g.matiere}</span>
                            {!isNaN(g.coeff) && (
                              <span className="ne-grade-item-coeff">Coeff. {g.coeff}</span>
                            )}
                          </div>
                          <div className="ne-grade-item-actions">
                            <button
                              className="ne-gaction ne-gaction--edit"
                              title="Modifier"
                              onClick={() => onEditGrade(g)}
                            >
                              <Icon.Edit />
                            </button>
                            <button
                              className="ne-gaction ne-gaction--delete"
                              title="Supprimer"
                              onClick={() => onDeleteGrade(g)}
                            >
                              <Icon.Trash />
                            </button>
                          </div>
                        </div>

                        {/* Score display */}
                        <div className="ne-grade-item-score">
                          <span className="ne-grade-item-val">{g.note.toFixed(2)}</span>
                          <span className="ne-grade-item-max">/20</span>
                          <span className={`ne-grade-badge ${badge.cls}`}>{badge.label}</span>
                        </div>

                        {/* Progress bar */}
                        <div className="ne-grade-item-bar-wrap">
                          <div
                            className="ne-grade-item-bar"
                            style={{ width: `${barWidth(g.note)}%`, background: barColor(g.note) }}
                          />
                        </div>
                        <p className="ne-grade-item-pct">{barWidth(g.note)}% du maximum</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── PROFILE TAB ── */}
          {activeTab === "info" && (
            <div className="ne-tab-content">
              <div className="ne-section">
                <p className="ne-section-title">Coordonnées</p>
                <div className="ne-rows">
                  {[
                    ["Nom complet",  `${s.nom} ${s.prenom}`],
                    s.email            && ["Email",       s.email],
                    s.telephone        && ["Téléphone",   s.telephone],
                    s.telephone_parent && ["Tél. parent", s.telephone_parent],
                    ["Filière",      cls],
                  ].filter(Boolean).map(([k, v], i) => (
                    <div key={i} className="ne-row">
                      <span className="ne-row-key">{k}</span>
                      <span className="ne-row-val">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

/* ══════════════════════════════════════
   Main component
   ══════════════════════════════════════ */
export default function Note_ense({ dataEtudiant = [], prof = [] }) {
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState(null);
  const [modal,    setModal]    = useState(null);

  const id_sujjetprof = useMemo(
    () => prof.map(v => v.id_jujjets ?? v.id_sujjet ?? v.sujjet_id),
    [prof]
  );

  const matiere   = prof[0]?.sujjet?.matiere_nom ?? prof[0]?.matiere ?? "Matière";
  const nomClasse = dataEtudiant[0]?.classe?.nom_classe ?? "Classe";

  /* Get the first matching note for this teacher (for the table column) */
  const getNote = (s) => {
    const entry = s.notes?.find(n => id_sujjetprof.includes(n.sujjet_id));
    return entry?.note ?? entry?.sujjet?.note ?? null;
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return dataEtudiant.filter(s =>
      `${s.nom} ${s.prenom} ${s.email ?? ""}`.toLowerCase().includes(q)
    );
  }, [dataEtudiant, search]);

  const noteValues    = dataEtudiant.map(s => parseFloat(getNote(s))).filter(v => !isNaN(v));
  const countWithNote = noteValues.length;
  const avg = countWithNote
    ? (noteValues.reduce((a, b) => a + b, 0) / noteValues.length).toFixed(2)
    : null;
  const countPassed = noteValues.filter(v => v >= 10).length;

  const handleRowClick = (s) => {
    const sid = s._id ?? s.id;
    setSelected(prev => (prev?._id ?? prev?.id) === sid ? null : s);
  };

  /* Save (add or update) */
  const handleSaveGrade = async (obj, mode) => {
    const student = dataEtudiant.find(v => v.id === Number(obj.etudiant_id));
    if (!student) { console.warn("Student not found"); return; }

    const payload = { ...obj, id_filieres: student.id_filieres };
    const url     = mode === "edit"
      ? `http://127.0.0.1:8000/api/notesUpdate/${obj.note_id}`
      : "http://127.0.0.1:8000/api/notesStore";

    try {
      const res  = await fetch(url, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("Success:", data);
      setModal(null);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  /* Delete a specific grade by its id */
  const handleDeleteGrade = async (grade) => {
    if (!grade.id) return;
    try {
      await fetch(`http://127.0.0.1:8000/api/notesDestroy/${grade.id}`, {
        method: "DELETE",
        headers: { "Accept": "application/json" },
      });
      console.log("Deleted note", grade.id);
      // In a real app you'd refresh dataEtudiant here via a callback/state update
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /* Open the edit modal pre-filled with the grade's data */
  const handleEditGrade = (grade) => {
    setModal({
      mode:       "edit",
      student:    selected,
      gradeEntry: grade.raw,
      initialNote: String(grade.note),
    });
  };

  return (
    <div className="ne-page">

      {modal && (
        <GradeModal
          mode={modal.mode}
          student={modal.student ?? selected}
          students={dataEtudiant}
          prof={prof}
          initialNote={modal.initialNote ?? ""}
          gradeEntry={modal.gradeEntry ?? null}
          onSave={handleSaveGrade}
          onClose={() => setModal(null)}
        />
      )}

      <main className={`ne-main${selected ? " panel-open" : ""}`}>

        <div className="ne-page-header">
          <p className="ne-page-label">Gestion des notes</p>
          <h1 className="ne-page-title">{nomClasse} — {matiere}</h1>
        </div>

        <div className="ne-stats-grid">
          {[
            { num: dataEtudiant.length,               lbl: "Total étudiants", cls: ""      },
            { num: countWithNote,                     lbl: "Notes saisies",   cls: "blue"  },
            { num: avg !== null ? `${avg}/20` : "—", lbl: "Moyenne classe",  cls: "green" },
            { num: countPassed,                       lbl: "Admis (≥10)",     cls: "amber" },
          ].map((s, i) => (
            <div key={i} className="ne-stat-pill">
              <span className={`ne-stat-num ${s.cls}`}>{s.num}</span>
              <span className="ne-stat-lbl">{s.lbl}</span>
            </div>
          ))}
        </div>

        <div className="ne-toolbar">
          <div className="ne-search-wrap">
            <span className="ne-search-icon"><Icon.Search /></span>
            <input
              type="text"
              placeholder="Rechercher un étudiant…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="ne-search-input"
            />
          </div>
          <button
            className="ne-btn-add"
            onClick={() => setModal({ mode: "add", student: selected ?? null })}
          >
            <Icon.Plus /> Ajouter une note
          </button>
        </div>

        <p className="ne-count-line">
          {filtered.length} étudiant{filtered.length !== 1 ? "s" : ""} — cliquez sur une ligne pour voir le détail
        </p>

        <div className="ne-table-wrap">
          <table className="ne-table">
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>Filière</th>
                <th>Note — {matiere}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="ne-td-empty">Aucun étudiant trouvé.</td></tr>
              ) : filtered.map((s, i) => {
                const sid      = s._id ?? s.id ?? i;
                const selId    = selected?._id ?? selected?.id;
                const isActive = selId !== undefined && selId === sid;
                const color    = avatarColor(s.nom);
                const cls      = s.classe?.nom_classe ?? s.classe ?? nomClasse;
                const note     = getNote(s);
                const noteNum  = parseFloat(note);
                const hasNote  = !isNaN(noteNum);

                return (
                  <tr
                    key={sid}
                    className={isActive ? "is-selected" : ""}
                    onClick={() => handleRowClick(s._id || s.id ? s : { ...s, id: i })}
                  >
                    <td>
                      <div className="ne-cell-student">
                        <div className="ne-avatar" style={{ background: color }}>
                          {initials(s.nom, s.prenom)}
                        </div>
                        <div>
                          <p className="ne-student-name">{s.nom} {s.prenom}</p>
                          {s.email && <p className="ne-student-sub">{s.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="ne-td-muted">{cls}</td>
                    <td>
                      {hasNote ? (
                        <div className="ne-note-cell">
                          <span className={`ne-note-chip ${noteNum >= 14 ? "chip-green" : noteNum >= 10 ? "chip-amber" : "chip-red"}`}>
                            {noteNum.toFixed(2)}/20
                          </span>
                          <div className="ne-mini-bar-wrap">
                            <div className="ne-mini-bar" style={{ width: `${barWidth(note)}%`, background: barColor(note) }} />
                          </div>
                        </div>
                      ) : (
                        <span className="ne-no-note">—</span>
                      )}
                    </td>
                    <td className="ne-td-cue"><Icon.ChevronRight /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      <DetailPanel
        student={selected}
        id_sujjetprof={id_sujjetprof}
        onClose={() => setSelected(null)}
        onEditGrade={handleEditGrade}
        onDeleteGrade={handleDeleteGrade}
      />
    </div>
  );
}