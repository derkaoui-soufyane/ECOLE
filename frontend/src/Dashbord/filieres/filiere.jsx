import React, { useState } from "react";
import "./filiere.css";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function calcStats(filieres) {
  const total = filieres.length;
  const totalMatieres = filieres.reduce((s, f) => s + (f.sujjets?.length || 0), 0);
  const avg = total > 0 ? Math.round((totalMatieres / total) * 10) / 10 : 0;
  const rich = filieres.filter((f) => (f.sujjets?.length || 0) >= 5).length;
  return { total, totalMatieres, avg, rich };
}

const ITEMS_PER_PAGE = 8;

const accentColor = (i) => {
  const colors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#a855f7", "#14b8a6", "#f97316"];
  return colors[i % colors.length];
};

/* ════════════════════════════════════════════════════════
   Main Component
   ════════════════════════════════════════════════════════ */
function Filiere({ dataFilieres: initialFilieres = [] }) {
  const [filieres, setFilieres] = useState(initialFilieres);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("nom");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);

  /* Modals */
  const [showFiliereModal, setShowFiliereModal] = useState(false);
  const [editingFiliere, setEditingFiliere] = useState(null);
  const [showMatiereModal, setShowMatiereModal] = useState(null); // filiere object
  const [expandedId, setExpandedId] = useState(null);

  /* ── Stats ── */
  const stats = calcStats(filieres);

  /* ── Filter + Sort ── */
  const filtered = (() => {
    let list = [...filieres];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.nom?.toLowerCase().includes(q) ||
          f.code?.toLowerCase().includes(q) ||
          f.sujjets?.some((s) => s.matiere_nom?.toLowerCase().includes(q))
      );
    }
    list.sort((a, b) => {
      let va, vb;
      if (sortField === "matieres") {
        va = a.sujjets?.length || 0;
        vb = b.sujjets?.length || 0;
      } else if (sortField === "code") {
        va = a.code || "";
        vb = b.code || "";
      } else {
        va = a.nom || "";
        vb = b.nom || "";
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  })();

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
    setPage(1);
  };

  /* ── CRUD Filiere ── */
  const handleSaveFiliere = async (data) => {
    if (editingFiliere) {
      setFilieres((prev) =>
        prev.map((f) => (f.id === editingFiliere.id ? { ...f, ...data } : f))
      );
      try {
        await fetch(`http://127.0.0.1:8000/api/filieresUpdate/${editingFiliere.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
      } catch (e) { console.warn("Update failed:", e); }
    } else {
      const tempId = Date.now();
      setFilieres((prev) => [...prev, { ...data, id: tempId, sujjets: [] }]);
      try {
        const res = await fetch("http://127.0.0.1:8000/api/filieresStore", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const saved = await res.json();
        setFilieres((prev) =>
          prev.map((f) => (f.id === tempId ? { ...f, id: saved.id } : f))
        );
      } catch (e) { console.warn("Store failed:", e); }
    }
    setShowFiliereModal(false);
    setEditingFiliere(null);
  };

  const handleDeleteFiliere = async (id) => {
    if (!window.confirm("Supprimer cette filière et toutes ses matières ?")) return;
    setFilieres((prev) => prev.filter((f) => f.id !== id));
    try {
      await fetch(`http://127.0.0.1:8000/api/filieresDestroy/${id}`, { method: "DELETE" });
    } catch (e) { console.warn("Delete failed:", e); }
  };

  /* ── CRUD Matiere ── */
  const handleSaveMatiere = async (filiere, matiere_nom) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/sujjetsStore/${filiere.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matiere_nom, filiere_id: filiere.id }),
      });
      const saved = await res.json();
      setFilieres((prev) =>
        prev.map((f) =>
          f.id === filiere.id
            ? { ...f, sujjets: [...(f.sujjets || []), saved] }
            : f
        )
      );
    } catch (e) {
      const tempId = Date.now();
      setFilieres((prev) =>
        prev.map((f) =>
          f.id === filiere.id
            ? { ...f, sujjets: [...(f.sujjets || []), { id: tempId, matiere_nom }] }
            : f
        )
      );
    }
    setShowMatiereModal(null);
  };

  const handleDeleteMatiere = async (filiereId, matiereId) => {
    setFilieres((prev) =>
      prev.map((f) =>
        f.id === filiereId
          ? { ...f, sujjets: f.sujjets.filter((s) => s.id !== matiereId) }
          : f
      )
    );
    try {
      await fetch(`http://127.0.0.1:8000/api/sujjetsDestroy/${matiereId}`, { method: "DELETE" });
    } catch (e) { console.warn("Delete matiere failed:", e); }
  };

  const handleUpdateMatiere = async (filiereId, matiereId, matiere_nom) => {
    setFilieres((prev) =>
      prev.map((f) =>
        f.id === filiereId
          ? { ...f, sujjets: f.sujjets.map((s) => (s.id === matiereId ? { ...s, matiere_nom } : s)) }
          : f
      )
    );
    try {
      await fetch(`http://127.0.0.1:8000/api/sujjetsUpdate/${matiereId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ matiere_nom }),
      });
    } catch (e) { console.warn("Update matiere failed:", e); }
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

  /* ── Bar chart data: top 6 filieres by matiere count ── */
  const barData = [...filieres]
    .sort((a, b) => (b.sujjets?.length || 0) - (a.sujjets?.length || 0))
    .slice(0, 6);
  const maxBar = Math.max(...barData.map((f) => f.sujjets?.length || 0), 1);

  /* ════════════════════ JSX ══ */
  return (
    <div className="fl-wrap">

      {/* ── Stat Cards ── */}
      <div className="fl-stats">
        {[
          { icon: "🎓", label: "Total Filières",       value: stats.total,        accent: "#6366f1", badge: "enregistrées",  badgeType: "neutral" },
          { icon: "📚", label: "Total Matières",        value: stats.totalMatieres, accent: "#10b981", badge: "toutes filières", badgeType: "neutral" },
          { icon: "📊", label: "Moy. Matières / Filière", value: stats.avg,       accent: "#f59e0b", badge: "moyenne",       badgeType: "neutral" },
          { icon: "⭐", label: "Filières Riches (≥5)",  value: stats.rich,         accent: "#ec4899", badge: stats.rich > 0 ? "Complètes" : "—", badgeType: stats.rich > 0 ? "up" : "neutral" },
        ].map((c) => (
          <div className="fl-stat-card" key={c.label} style={{ "--accent": c.accent }}>
            <div className="fl-stat-top">
              <span className="fl-stat-icon">{c.icon}</span>
              <span className={`fl-stat-badge fl-stat-badge--${c.badgeType}`}>{c.badge}</span>
            </div>
            <div className="fl-stat-value">{c.value}</div>
            <div className="fl-stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      

      {/* ── Table Section ── */}
      <div className="fl-card fl-table-section">
        <div className="fl-table-header">
          <h3>
            Toutes les Filières
            <span className="fl-count-pill">{filtered.length}</span>
          </h3>
          <div className="fl-table-actions">
            <div className="fl-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Chercher filière, code, matière…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <button
              className="fl-btn fl-btn--primary"
              onClick={() => { setEditingFiliere(null); setShowFiliereModal(true); }}
            >
              + Ajouter une filière
            </button>
          </div>
        </div>

        <div className="fl-table-wrap">
          {paged.length > 0 ? (
            <table className="fl-table">
              <thead>
                <tr>
                  {[
                    { key: "nom",      label: "Filière" },
                    { key: "code",     label: "code" },
                    { key: "matieres", label: "Matières" },
                    { key: "detail",   label: "Détail" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className={sortField === col.key ? "sorted" : ""}
                      onClick={() => col.key !== "detail" && handleSort(col.key)}
                      style={{ cursor: col.key === "detail" ? "default" : "pointer" }}
                    >
                      {col.label}
                      {col.key !== "detail" && (
                        <span className="sort-icon">
                          {sortField === col.key ? (sortDir === "asc" ? " ▲" : " ▼") : " ⇅"}
                        </span>
                      )}
                    </th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((f, i) => {
                  const count = f.sujjets?.length || 0;
                  const color = accentColor(filieres.indexOf(f));
                  const isExpanded = expandedId === f.id;
                  return (
                    <React.Fragment key={f.id}>
                      <tr className={isExpanded ? "fl-row--expanded" : ""}>
                        {/* Filière name */}
                        <td>
                          <div className="fl-filiere-cell">
                            <div className="fl-filiere-avatar" style={{ background: color }}>
                              {(f.nom || "?")[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="fl-filiere-name">{f.nom}</div>
                              <div className="fl-filiere-sub">{f.code}</div>
                            </div>
                          </div>
                        </td>

                        {/* Code */}
                        <td>
                          <span className="fl-code-tag" style={{ "--sc": color }}>
                            {f.code || "—"}
                          </span>
                        </td>

                        {/* Matières count */}
                        <td>
                          <div className="fl-count-cell">
                            <span className="fl-count-num">{count}</span>
                            <div className="fl-mini-bar">
                              <div
                                className="fl-mini-fill"
                                style={{
                                  width: `${Math.max(4, (count / Math.max(maxBar, 1)) * 100)}%`,
                                  background: color,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Matieres preview */}
                        <td>
                          <div className="fl-tags-preview">
                            {(f.sujjets || []).slice(0, 3).map((s) => (
                              <span key={s.id} className="fl-tag">{s.matiere_nom}</span>
                            ))}
                            {count > 3 && (
                              <span className="fl-tag fl-tag--more">+{count - 3}</span>
                            )}
                            {count === 0 && (
                              <span className="fl-no-mat">Aucune matière</span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="fl-actions">
                            <button
                              className="fl-action-btn"
                              title="Voir matières"
                              onClick={() => setExpandedId(isExpanded ? null : f.id)}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                {isExpanded
                                  ? <polyline points="18 15 12 9 6 15" />
                                  : <polyline points="6 9 12 15 18 9" />}
                              </svg>
                            </button>
                            <button
                              className="fl-action-btn fl-action-btn--add"
                              title="Ajouter matière"
                              onClick={() => setShowMatiereModal(f)}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                            </button>
                            <button
                              className="fl-action-btn"
                              title="Modifier"
                              onClick={() => { setEditingFiliere(f); setShowFiliereModal(true); }}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button
                              className="fl-action-btn fl-action-btn--del"
                              title="Supprimer"
                              onClick={() => handleDeleteFiliere(f.id)}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Matieres Row */}
                      {isExpanded && (
                        <tr className="fl-expanded-row">
                          <td colSpan={5}>
                            <MatiereExpandedPanel
                              filiere={f}
                              accentColor={color}
                              onDelete={(mid) => handleDeleteMatiere(f.id, mid)}
                              onUpdate={(mid, name) => handleUpdateMatiere(f.id, mid, name)}
                              onAdd={() => setShowMatiereModal(f)}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="fl-empty">
              <div className="fl-empty-icon">🎓</div>
              <h4>Aucune filière trouvée</h4>
              <p>Modifiez les filtres ou ajoutez une nouvelle filière.</p>
            </div>
          )}
        </div>

        {filtered.length > 0 && (
          <div className="fl-table-footer">
            <span className="fl-page-info">
              {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} sur {filtered.length}
            </span>
            <div className="fl-pagination">
              <button className="fl-page-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹</button>
              {pageNums().map((n) => (
                <button
                  key={n}
                  className={`fl-page-btn${page === n ? " fl-page-btn--active" : ""}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button className="fl-page-btn" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Filière Modal ── */}
      {showFiliereModal && (
        <FiliereModal
          filiere={editingFiliere}
          onClose={() => { setShowFiliereModal(false); setEditingFiliere(null); }}
          onSave={handleSaveFiliere}
        />
      )}

      {/* ── Matière Modal ── */}
      {showMatiereModal && (
        <MatiereModal
          filiere={showMatiereModal}
          onClose={() => setShowMatiereModal(null)}
          onSave={handleSaveMatiere}
        />
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   Expanded Matieres Panel (inline)
   ════════════════════════════════════════════════════════ */
function MatiereExpandedPanel({ filiere, accentColor, onDelete, onUpdate, onAdd }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  return (
    <div className="fl-expanded-panel">
      <div className="fl-expanded-header">
        <span style={{ color: accentColor, fontWeight: 700, fontSize: 13 }}>
          📚 {filiere.nom} — {filiere.sujjets?.length || 0} matière(s)
        </span>
        <button className="fl-btn fl-btn--sm fl-btn--primary" onClick={onAdd}>
          + Matière
        </button>
      </div>
      <div className="fl-matiere-grid">
        {(filiere.sujjets || []).length === 0 && (
          <p className="fl-no-mat" style={{ padding: "12px 0" }}>Aucune matière. Ajoutez-en une.</p>
        )}
        {(filiere.sujjets || []).map((s) => (
          <div key={s.id} className="fl-matiere-card">
            {editingId === s.id ? (
              <div className="fl-matiere-edit">
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { onUpdate(s.id, editValue); setEditingId(null); }
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
                <button
                  className="fl-btn fl-btn--sm fl-btn--primary"
                  onClick={() => { onUpdate(s.id, editValue); setEditingId(null); }}
                >
                  ✓
                </button>
                <button
                  className="fl-btn fl-btn--sm fl-btn--ghost"
                  onClick={() => setEditingId(null)}
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <div className="fl-matiere-dot" style={{ background: accentColor }} />
                <span className="fl-matiere-name">{s.matiere_nom}</span>
                <div className="fl-matiere-acts">
                  <button
                    className="fl-action-btn"
                    title="Modifier"
                    onClick={() => { setEditingId(s.id); setEditValue(s.matiere_nom); }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    className="fl-action-btn fl-action-btn--del"
                    title="Supprimer"
                    onClick={() => onDelete(s.id)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   Filière Add/Edit Modal
   ════════════════════════════════════════════════════════ */
function FiliereModal({ filiere, onClose, onSave }) {
  const [form, setForm] = useState({
    nom:  filiere?.nom  || "",
    code: filiere?.code || "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fl-overlay" onClick={onClose}>
      <div className="fl-modal" onClick={(e) => e.stopPropagation()}>
        <div className="fl-modal-header">
          <h2>{filiere ? "✏️ Modifier la Filière" : "➕ Ajouter une Filière"}</h2>
          <button className="fl-modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="fl-modal-body">
          <div className="fl-form-group">
            <label>Nom de la filière</label>
            <input
              type="text"
              placeholder="ex: Génie Informatique"
              value={form.nom}
              onChange={(e) => set("nom", e.target.value)}
            />
          </div>
          <div className="fl-form-group">
            <label>Code</label>
            <input
              type="text"
              placeholder="ex: GI, GC, GE…"
              value={form.code}
              onChange={(e) => set("code", e.target.value)}
            />
          </div>
        </div>
        <div className="fl-modal-footer">
          <button className="fl-btn fl-btn--ghost" onClick={onClose}>Annuler</button>
          <button
            className="fl-btn fl-btn--primary"
            onClick={() => form.nom.trim() && onSave(form)}
            disabled={!form.nom.trim()}
          >
            {filiere ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   Matière Add Modal
   ════════════════════════════════════════════════════════ */
function MatiereModal({ filiere, onClose, onSave }) {
  const [matiere_nom, setNom] = useState("");

  return (
    <div className="fl-overlay" onClick={onClose}>
      <div className="fl-modal fl-modal--sm" onClick={(e) => e.stopPropagation()}>
        <div className="fl-modal-header">
          <h2>📚 Ajouter une Matière</h2>
          <button className="fl-modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="fl-modal-body">
          <p className="fl-modal-sub">Filière : <strong>{filiere.nom}</strong></p>
          <div className="fl-form-group">
            <label>Nom de la matière</label>
            <input
              autoFocus
              type="text"
              placeholder="ex: Algorithmique, Base de données…"
              value={matiere_nom}
              onChange={(e) => setNom(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && matiere_nom.trim() && onSave(filiere, matiere_nom)}
            />
          </div>
        </div>
        <div className="fl-modal-footer">
          <button className="fl-btn fl-btn--ghost" onClick={onClose}>Annuler</button>
          <button
            className="fl-btn fl-btn--primary"
            onClick={() => matiere_nom.trim() && onSave(filiere, matiere_nom)}
            disabled={!matiere_nom.trim()}
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

export default Filiere;