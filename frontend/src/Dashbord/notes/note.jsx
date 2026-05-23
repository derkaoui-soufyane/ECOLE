import { useState } from 'react';
import "./note.css"
/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function noteToLetter(note) {
  if (note >= 18) return 'A+';
  if (note >= 16) return 'A';
  if (note >= 14) return 'B+';
  if (note >= 12) return 'B';
  if (note >= 10) return 'C';
  if (note >= 8)  return 'D';
  return 'F';
}

function letterToBadgeClass(letter) {
  if (!letter) return 'grade-badge';
  const map = {
    'A+': 'grade-badge grade-badge--a-plus',
    'A':  'grade-badge grade-badge--a',
    'B+': 'grade-badge grade-badge--b-plus',
    'B':  'grade-badge grade-badge--b',
    'C':  'grade-badge grade-badge--c',
    'D':  'grade-badge grade-badge--d',
    'F':  'grade-badge grade-badge--f',
  };
  return map[letter] || 'grade-badge';
}

function getScoreColor(pct) {
  if (pct >= 90) return '#10b981';
  if (pct >= 70) return '#6366f1';
  if (pct >= 50) return '#f59e0b';
  if (pct >= 40) return '#f97316';
  return '#ef4444';
}

const ITEMS_PER_PAGE = 12;

const avatarColor = (id) => {
  const colors = ['#6366f1','#10b981','#f59e0b','#ef4444','#ec4899','#a855f7','#14b8a6','#f97316'];
  return colors[(id || 0) % colors.length];
};

/* ═══════════════════════════════════════════════════════
   Derived stats — plain functions, no useMemo
   ═══════════════════════════════════════════════════════ */
function calcStats(grades) {
  if (!grades.length) return { avg: 0, honor: 0, risk: 0, total: 0, studentCount: 0 };
  const avg = grades.reduce((s, g) => s + parseFloat(g.note), 0) / grades.length;
  const byStudent = {};
  grades.forEach((g) => {
    const sid = g.etudiant_id;
    if (!byStudent[sid]) byStudent[sid] = [];
    byStudent[sid].push(parseFloat(g.note));
  });
  let honor = 0, risk = 0;
  Object.values(byStudent).forEach((arr) => {
    const a = arr.reduce((x, y) => x + y, 0) / arr.length;
    if (a >= 16) honor++;
    if (a < 10)  risk++;
  });
  return {
    avg: Math.round(avg * 10) / 10,
    honor,
    risk,
    total: grades.length,
    studentCount: Object.keys(byStudent).length,
  };
}

function calcDist(grades) {
  const d = { 'A+': 0, A: 0, 'B+': 0, B: 0, C: 0, D: 0, F: 0 };
  grades.forEach((g) => {
    const l = noteToLetter(parseFloat(g.note));
    if (l in d) d[l]++;
  });
  return d;
}

function calcSubjPerf(grades) {
  const map = {};
  grades.forEach((g) => {
    const key = g.sujjet_id;
    const name =
      g.sujjet?.matiere_nom ||
      g.sujjet?.nom ||
      g.sujjet?.name ||
      `Matière #${key}`;
    if (!map[key]) map[key] = { name, vals: [] };
    map[key].vals.push(parseFloat(g.note));
  });
  return Object.entries(map)
    .map(([id, { name, vals }]) => ({
      id: +id,
      name,
      avg: Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10,
    }))
    .sort((a, b) => b.avg - a.avg);
}


export default function Notes({
  Icons,
  dataNotes = [],
  dataFilieres = [],
  DataSujjet = [],
  dataEtudiant = [],
}) {
  const [grades, setGrades]               = useState(dataNotes);
  const [search, setSearch]               = useState('');
  const [filterFiliere, setFilterFiliere] = useState('all');
  const [filterLetter, setFilterLetter]   = useState('all');
  const [sortField, setSortField]         = useState('created_at');
  const [sortDir, setSortDir]             = useState('desc');
  const [page, setPage]                   = useState(1);
  const [showModal, setShowModal]         = useState(false);
  const [editingGrade, setEditingGrade]   = useState(null);
  const [detailEtudiant, setDetailEtudiant] = useState(null);

  /* ── Accessors that read nested data ── */
  const getEtudiant = (g) => g.etudiant || null;
  const getSujjet   = (g) => g.sujjet   || null;
  const getFiliere  = (g) => g.filiere  || null;

  const getEtudiantName = (g) => {
    const e = getEtudiant(g);
    return e ? `${e.nom || ''} ${e.prenom || ''}`.trim() : `Étudiant #${g.etudiant_id}`;
  };
  const getSujjetName = (g) => {
    const s = getSujjet(g);
    return s?.matiere_nom || s?.nom || s?.name || `Matière #${g.sujjet_id}`;
  };
  const getFiliereName = (g) => {
    const f = getFiliere(g);
    return f?.nom || f?.name || `Filière #${g.id_filieres}`;
  };

  /* ── Derived values (plain, recomputed on render) ── */
  const stats    = calcStats(grades);
  const dist     = calcDist(grades);
  const subjPerf = calcSubjPerf(grades);
  const maxDist  = Math.max(...Object.values(dist), 1);

  /* ── Unique filières from loaded notes (fallback to prop) ── */
  const filiereOptions = dataFilieres.length
    ? dataFilieres
    : [...new Map(
        grades
          .filter((g) => g.filiere)
          .map((g) => [g.id_filieres, g.filiere])
      ).values()];

  /* ── Filter + Sort ── */
  const filtered = (() => {
    let list = [...grades];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((g) =>
        getEtudiantName(g).toLowerCase().includes(q) ||
        getSujjetName(g).toLowerCase().includes(q) ||
        getFiliereName(g).toLowerCase().includes(q)
      );
    }

    if (filterFiliere !== 'all')
      list = list.filter((g) => String(g.id_filieres) === filterFiliere);

    if (filterLetter !== 'all')
      list = list.filter((g) => noteToLetter(parseFloat(g.note)) === filterLetter);

    list.sort((a, b) => {
      let va, vb;
      switch (sortField) {
        case 'etudiant':    va = getEtudiantName(a); vb = getEtudiantName(b); break;
        case 'sujjet':      va = getSujjetName(a);   vb = getSujjetName(b);   break;
        case 'filiere':     va = getFiliereName(a);  vb = getFiliereName(b);  break;
        case 'note':        va = parseFloat(a.note); vb = parseFloat(b.note); break;
        case 'cofficients': va = a.cofficients;      vb = b.cofficients;      break;
        default:            va = a.created_at || ''; vb = b.created_at || '';
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ?  1 : -1;
      return 0;
    });

    return list;
  })();

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged      = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('asc'); }
    setPage(1);
  };

  /* ── CRUD ── */
  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette note ?')) return;
    setGrades((prev) => prev.filter((g) => g.id !== id));
    try {

      await fetch(`http://127.0.0.1:8000/api/notesDestroy/${id}`, { method: 'DELETE' });
    } catch (e) { console.warn('Delete failed:', e); }
  };

  const handleSave = async (data) => {
    if (editingGrade) {
      const updated = { ...editingGrade, ...data };
      setGrades((prev) => prev.map((g) => (g.id === editingGrade.id ? updated : g)));
      try {
        await fetch(`http://127.0.0.1:8000/api/notesUpdate/${editingGrade.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } catch (e) { console.warn('Update failed:', e); }
    } else {
      console.log(data)
      const tempId = Date.now();
      setGrades((prev) => [...prev, { ...data, id: tempId, created_at: new Date().toISOString() }]);
      try {
        const res  = await fetch('http://127.0.0.1:8000/api/notesStore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const saved = await res.json();
        setGrades((prev) => prev.map((g) => (g.id === tempId ? { ...g, id: saved.id } : g)));
      } catch (e) { console.warn('Store failed:', e); }
    }
    setShowModal(false);
    setEditingGrade(null);
  };

  const handleExport = () => {
    const header = 'Étudiant,Matière,Filière,Note,Coefficient,Grade\n';
    const rows = filtered.map((g) =>
      `"${getEtudiantName(g)}","${getSujjetName(g)}","${getFiliereName(g)}",${g.note},${g.cofficients},"${noteToLetter(parseFloat(g.note))}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'notes_export.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const pageNums = () => {
    const count = Math.min(totalPages, 5);
    let start = 1;
    if (totalPages > 5) {
      if (page <= 3) start = 1;
      else if (page >= totalPages - 2) start = totalPages - 4;
      else start = page - 2;
    }
    return Array.from({ length: count }, (_, i) => start + i);
  };

  const distKeys   = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F'];
  const distColors = {
    'A+': 'linear-gradient(180deg,#10b981,#059669)',
    'A':  'linear-gradient(180deg,#34d399,#10b981)',
    'B+': 'linear-gradient(180deg,#6366f1,#4f46e5)',
    'B':  'linear-gradient(180deg,#818cf8,#6366f1)',
    'C':  'linear-gradient(180deg,#f59e0b,#d97706)',
    'D':  'linear-gradient(180deg,#f97316,#ea580c)',
    'F':  'linear-gradient(180deg,#ef4444,#dc2626)',
  };

  /* ════════════════════════════════════════════════ JSX ══ */
  return (
    <div className="gr-wrap">

      {/* ── Stat Cards ── */}
      <div className="gr-stats">
        {[
          { icon: '📊', label: 'Moyenne Générale',   value: `${stats.avg}/20`, accent: '#6366f1', badge: '↑ actuel',        badgeType: 'neutral' },
          { icon: '📝', label: 'Notes Enregistrées', value: stats.total,       accent: '#10b981', badge: `${stats.studentCount} étudiants`, badgeType: 'neutral' },
          { icon: '⚠️', label: 'En Difficulté (<10)',value: stats.risk,        accent: '#ef4444', badge: stats.risk > 0 ? 'Attention' : 'OK', badgeType: stats.risk > 0 ? 'down' : 'up' },
          { icon: '🏆', label: 'Mention TB (≥16)',    value: stats.honor,       accent: '#f59e0b', badge: 'Excellent',        badgeType: 'up' },
        ].map((c) => (
          <div className="gr-stat-card" key={c.label} style={{ '--accent': c.accent }}>
            <div className="gr-stat-top">
              <span className="gr-stat-icon">{c.icon}</span>
              <span className={`gr-stat-badge gr-stat-badge--${c.badgeType}`}>{c.badge}</span>
            </div>
            <div className="gr-stat-value">{c.value}</div>
            <div className="gr-stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="gr-charts-row">

        {/* Distribution */}
        <div className="gr-card gr-dist-card">
          <div className="gr-card-header"><h3>Distribution des Notes</h3></div>
          <div className="gr-dist-body">
            {distKeys.map((l) => {
              const count = dist[l] || 0;
              const h = Math.max(8, (count / maxDist) * 160);
              return (
                <div className="gr-dist-group" key={l}>
                  <div className="gr-dist-bar-wrap">
                    <div className="gr-dist-bar" style={{ height: `${h}px`, background: distColors[l] }}>
                      <span className="gr-dist-tip">{count}</span>
                    </div>
                  </div>
                  <span className="gr-dist-label">{l}</span>
                  <span className="gr-dist-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject performance */}
        <div className="gr-card gr-perf-card">
          <div className="gr-card-header"><h3>Performance par Matière</h3></div>
          <div className="gr-perf-list">
            {subjPerf.length === 0 && (
              <p style={{ padding: '16px', fontSize: 13, color: 'var(--text-secondary)' }}>Aucune donnée</p>
            )}
            {subjPerf.map((cp, i) => {
              const colors = ['#6366f1','#10b981','#f59e0b','#ef4444','#ec4899','#a855f7'];
              const color  = colors[i % colors.length];
              return (
                <div className="gr-perf-item" key={cp.id}>
                  <div className="gr-perf-dot" style={{ background: color }} />
                  <div className="gr-perf-info">
                    <span className="gr-perf-name">{cp.name}</span>
                    <div className="gr-perf-bar-bg">
                      <div className="gr-perf-bar-fill" style={{ width: `${(cp.avg / 20) * 100}%`, background: color }} />
                    </div>
                  </div>
                  <span className="gr-perf-avg">{cp.avg}/20</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Table section ── */}
      <div className="gr-card gr-table-section">
        <div className="gr-table-header">
          <h3>
            Toutes les Notes
            <span className="gr-count-pill">{filtered.length}</span>
          </h3>
          <div className="gr-table-actions">
            <div className="gr-search">
              <Icons.Search />
              <input
                type="text"
                placeholder="Chercher étudiant, matière…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            <select className="gr-select" value={filterFiliere} onChange={(e) => { setFilterFiliere(e.target.value); setPage(1); }}>
              <option value="all">Toutes les filières</option>
              {filiereOptions.map((f) => (
                <option key={f.id} value={String(f.id)}>{f.nom || f.name}</option>
              ))}
            </select>

            <select className="gr-select" value={filterLetter} onChange={(e) => { setFilterLetter(e.target.value); setPage(1); }}>
              <option value="all">Toutes mentions</option>
              {distKeys.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>

            <button className="gr-btn gr-btn--ghost" onClick={handleExport}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Exporter
            </button>
            <button className="gr-btn gr-btn--primary" onClick={() => { setEditingGrade(null); setShowModal(true); }}>
              + Ajouter
            </button>
          </div>
        </div>

        <div className="gr-table-wrap">
          {paged.length > 0 ? (
            <table className="gr-table">
              <thead>
                <tr>
                  {[
                    { key: 'etudiant',    label: 'Étudiant' },
                    { key: 'sujjet',      label: 'Matière' },
                    { key: 'filiere',     label: 'Filière' },
                    { key: 'note',        label: 'Note /20' },
                    { key: 'grade',       label: 'Mention' },
                    { key: 'cofficients', label: 'Coeff.' },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className={sortField === col.key ? 'sorted' : ''}
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                      <span className="sort-icon">
                        {sortField === col.key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ' ⇅'}
                      </span>
                    </th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((g) => {
                  const e      = getEtudiant(g);
                  const note   = parseFloat(g.note);
                  const pct    = (note / 20) * 100;
                  const letter = noteToLetter(note);
                  const color  = avatarColor(g.etudiant_id);

                  return (
                    <tr key={g.id}>
                      {/* Étudiant */}
                      <td>
                        <div
                          className="gr-student-cell"
                          onClick={() =>
                            e &&
                            setDetailEtudiant({
                              etudiant: e,
                              grades: grades.filter((x) => x.etudiant_id === g.etudiant_id),
                            })
                          }
                          style={{ cursor: e ? 'pointer' : 'default' }}
                        >
                          <div className="gr-avatar" style={{ background: color }}>
                            {e
                              ? `${(e.nom || '?')[0]}${(e.prenom || '')[0]}`
                              : '?'}
                          </div>
                          <div>
                            <div className="gr-student-name">{getEtudiantName(g)}</div>
                            <div className="gr-student-sub">{getFiliereName(g)}</div>
                          </div>
                        </div>
                      </td>

                      {/* Matière */}
                      <td>
                        <span className="gr-subject-tag" style={{ '--sc': '#6366f1' }}>
                          {getSujjetName(g)}
                        </span>
                      </td>

                      {/* Filière */}
                      <td className="gr-assignment-cell">{getFiliereName(g)}</td>

                      {/* Note */}
                      <td>
                        <div className="gr-score-cell">
                          <span className="gr-score-text">
                            {note.toFixed(2)}<span className="gr-score-max">/20</span>
                          </span>
                          <div className="gr-mini-bar">
                            <div className="gr-mini-fill" style={{ width: `${pct}%`, background: getScoreColor(pct) }} />
                          </div>
                        </div>
                      </td>

                      {/* Mention */}
                      <td>
                        <span className={letterToBadgeClass(letter)}>{letter}</span>
                      </td>

                      {/* Coefficient */}
                      <td className="gr-date-cell">{g.cofficients}</td>

                      {/* Actions */}
                      <td>
                        <div className="gr-actions">
                          <button
                            className="gr-action-btn"
                            title="Modifier"
                            onClick={() => { setEditingGrade(g); setShowModal(true); }}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button
                            className="gr-action-btn gr-action-btn--del"
                            title="Supprimer"
                            onClick={() => handleDelete(g.id)}
                          >
                            <Icons.Close />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="gr-empty">
              <div className="gr-empty-icon">📋</div>
              <h4>Aucune note trouvée</h4>
              <p>Modifiez les filtres ou ajoutez une nouvelle note.</p>
            </div>
          )}
        </div>

        {filtered.length > 0 && (
          <div className="gr-table-footer">
            <span className="gr-page-info">
              {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} sur {filtered.length}
            </span>
            <div className="gr-pagination">
              <button className="gr-page-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹</button>
              {pageNums().map((n) => (
                <button key={n} className={`gr-page-btn${page === n ? ' gr-page-btn--active' : ''}`} onClick={() => setPage(n)}>{n}</button>
              ))}
              <button className="gr-page-btn" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <NoteModal
          Icons={Icons}
          grade={editingGrade}
          dataEtudiant={dataEtudiant}
          DataSujjet={DataSujjet}
          dataFilieres={dataFilieres}
          onClose={() => { setShowModal(false); setEditingGrade(null); }}
          onSave={handleSave}
        />
      )}

      {/* ── Student Detail Modal ── */}
      {detailEtudiant && (
        <EtudiantDetailModal
          Icons={Icons}
          etudiant={detailEtudiant.etudiant}
          grades={detailEtudiant.grades}
          onClose={() => setDetailEtudiant(null)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Add / Edit Modal
   ═══════════════════════════════════════════════════════ */
function NoteModal({ Icons, grade, dataEtudiant, DataSujjet, dataFilieres, onClose, onSave }) {
  const [form, setForm] = useState({
    etudiant_id:  grade?.etudiant_id  ?? dataEtudiant[0]?.id  ?? '',
    sujjet_id:    grade?.sujjet_id    ?? DataSujjet[0]?.id     ?? '',
    note:         grade?.note         ?? 10,
    id_filieres:  grade?.id_filieres  ?? dataFilieres[0]?.id   ?? '',
    cofficients:  grade?.cofficients  ?? 1,
  });

  const set  = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const note   = Math.min(20, Math.max(0, parseFloat(form.note) || 0));
  const letter = noteToLetter(note);
  const pct    = (note / 20) * 100;
  console.log(form)
  return (
    <div className="gr-overlay" onClick={onClose}>
      <div className="gr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="gr-modal-header">
          <h2>{grade ? '✏️ Modifier la Note' : '➕ Ajouter une Note'}</h2>
          <button className="gr-modal-close" onClick={onClose}><Icons.Close /></button>
        </div>

        <div className="gr-modal-body">
          <div className="gr-form-group">
            <label>Étudiant</label>
            <select value={form.etudiant_id} onChange={(e) => set('etudiant_id', +e.target.value)}>
              {dataEtudiant.map((e) => (
                <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>
              ))}
            </select>
          </div>

          <div className="gr-form-row">
            <div className="gr-form-group">
              <label>Matière</label>
              <select value={form.sujjet_id} onChange={(e) => set('sujjet_id', +e.target.value)}>
                {DataSujjet.map((s) => (
                  <option key={s.id} value={s.id}>{s.matiere_nom || s.nom || s.name}</option>
                ))}
              </select>
            </div>
            <div className="gr-form-group">
              <label>Filière</label>
              <div className="gr-form-group">
  <input
    type="text"
    value={
      dataEtudiant.find(v => v.id === form.etudiant_id)?.filiere?.nom || ''
    }
    readOnly
  />
</div>
            </div>
          </div>

          <div className="gr-form-row gr-form-row--3">
            <div className="gr-form-group">
              <label>Note /20</label>
              <input
                type="number" min="0" max="20" step="0.25"
                value={form.note}
                onChange={(e) => set('note', e.target.value)}
              />
            </div>
            <div className="gr-form-group">
              <label>Coefficient</label>
              <input
                type="number" min="1" max="10"
                value={form.cofficients}
                onChange={(e) => set('cofficients', +e.target.value || 1)}
              />
            </div>
            <div className="gr-form-group">
              <label>Mention</label>
              <div className="gr-computed-grade" style={{ color: getScoreColor(pct) }}>
                {letter} <span style={{ fontSize: 12, opacity: .6 }}>({note.toFixed(2)}/20)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="gr-modal-footer">
          <button className="gr-btn gr-btn--ghost" onClick={onClose}>Annuler</button>
          <button
            className="gr-btn gr-btn--primary"
            onClick={() => onSave({ ...form, note: parseFloat(form.note) })}
          >
            {grade ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Student Detail Modal
   — grades here still have nested .sujjet / .filiere
   ═══════════════════════════════════════════════════════ */
function EtudiantDetailModal({ Icons, etudiant, grades, onClose }) {
  const avg  = grades.length
    ? Math.round((grades.reduce((s, g) => s + parseFloat(g.note), 0) / grades.length) * 10) / 10
    : 0;
  const best = grades.length ? Math.max(...grades.map((g) => parseFloat(g.note))) : 0;

  const avatarColors = ['#6366f1','#10b981','#f59e0b','#ef4444','#ec4899'];
  const color        = avatarColors[(etudiant.id || 0) % avatarColors.length];

  const getSujjetName = (g) =>
    g.sujjet?.matiere_nom || g.sujjet?.nom || g.sujjet?.name || `Matière #${g.sujjet_id}`;
  const getFiliereName = (g) =>
    g.filiere?.nom || g.filiere?.name || `Filière #${g.id_filieres}`;

  return (
    <div className="gr-overlay" onClick={onClose}>
      <div className="gr-modal gr-modal--detail" onClick={(e) => e.stopPropagation()}>
        <div className="gr-modal-header">
          <div className="gr-detail-avatar" style={{ background: color }}>
            {(etudiant.nom || '?')[0]}{(etudiant.prenom || '')[0]}
          </div>
          <div>
            <h2>{etudiant.nom} {etudiant.prenom}</h2>
            <p className="gr-detail-meta">
              {etudiant.email || ''}{etudiant.filiere ? ` · ${etudiant.filiere}` : ''}
            </p>
          </div>
          <button className="gr-modal-close" style={{ marginLeft: 'auto' }} onClick={onClose}>
            <Icons.Close />
          </button>
        </div>

        <div className="gr-modal-body">
          <div className="gr-detail-stats">
            {[
              { label: 'Moyenne',   value: `${avg}/20` },
              { label: 'Notes',     value: grades.length },
              { label: 'Meilleure',value: `${best}/20` },
              { label: 'Mention',   value: noteToLetter(avg) },
            ].map((s) => (
              <div className="gr-detail-stat" key={s.label}>
                <div className="gr-detail-stat-value">{s.value}</div>
                <div className="gr-detail-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <h4 className="gr-history-title">Historique des notes</h4>
          {grades.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Aucune note.</p>
          ) : (
            [...grades]
              .sort((a, b) => parseFloat(b.note) - parseFloat(a.note))
              .map((g, i) => {
                const note   = parseFloat(g.note);
                const colors = ['#6366f1','#10b981','#f59e0b','#ef4444','#ec4899','#a855f7'];
                return (
                  <div className="gr-history-row" key={g.id}>
                    <div className="gr-history-dot" style={{ background: colors[i % colors.length] }} />
                    <div className="gr-history-info">
                      <span className="gr-history-subj">{getSujjetName(g)}</span>
                      <span className="gr-history-type">
                        {getFiliereName(g)} · Coeff. {g.cofficients}
                      </span>
                    </div>
                    <div className="gr-history-right">
                      <span className="gr-history-score">{note.toFixed(2)}/20</span>
                      <span className={letterToBadgeClass(noteToLetter(note))}>{noteToLetter(note)}</span>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}