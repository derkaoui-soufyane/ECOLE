import { useEffect, useState } from 'react';
import './validation_compte.css';

function Validation_compte() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/neuveauinscrire_show')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = async (item, index) => {
  try {
    // 1. validation (insert into etudiant)
    const res = await fetch('http://127.0.0.1:8000/api/validation', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(item)
    });

    if (!res.ok) throw new Error("Erreur validation");

    const delRes = await fetch('http://127.0.0.1:8000/api/delete_neuveauinscrire', {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: item.id
      })
    });
    if (!delRes.ok) throw new Error("Erreur suppression");
    setData((prev) => prev.filter((_, i) => i !== index));

    showToast(`Compte de ${item.nom_i} ${item.prenom_i} approuvé.`, 'success');

  } catch (error) {
    console.error(error);
    showToast("وقع خطأ، حاول مرة أخرى", "error");
  }
};

  const handleReject = (item, index) => {
    fetch('http://127.0.0.1:8000/api/delete_neuveauinscrire', {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    id: item.id// 
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
    
    setData((prev) => prev.filter((_, i) => i !== index));
    showToast(`Compte de ${item.nom_i} ${item.prenom_i} refusé.`, 'danger');
  };

  const filtered = data.filter((v) =>
    `${v.nom_i} ${v.prenom_i} ${v.email} ${v.num_tele}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getInitials = (nom, prenom) =>
    `${nom?.charAt(0) ?? ''}${prenom?.charAt(0) ?? ''}`.toUpperCase();

  const avatarColors = [
    '#6366f1','#22c55e','#f97316','#ec4899',
    '#14b8a6','#a855f7','#0ea5e9','#f59e0b',
  ];
  const getColor = (i) => avatarColors[i % avatarColors.length];
  return (
    <div className="vc-wrapper">

      {/* ── Toast ── */}
      {toast && (
        <div className={`vc-toast vc-toast--${toast.type}`}>
          <span className="vc-toast-dot" />
          {toast.msg}
        </div>
      )}

      {/* ── Page header ── */}
      <div className="vc-page-header">
        <div className="vc-page-header-left">
          <div className="vc-page-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <polyline points="16 11 18 13 22 9" />
            </svg>
          </div>
          <div>
            <h2 className="vc-page-title">Validation des comptes</h2>
            <p className="vc-page-subtitle">Approuvez ou refusez les nouvelles inscriptions</p>
          </div>
        </div>
        <div className="vc-stats-row">
          <div className="vc-stat-pill">
            <span className="vc-stat-dot vc-stat-dot--pending" />
            <span>{data.length} en attente</span>
          </div>
        </div>
      </div>

      {/* ── Main card ── */}
      <div className="vc-card">

        {/* Toolbar */}
        <div className="vc-toolbar">
          <div className="vc-search">
            <svg className="vc-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher un inscrit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="vc-search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
          <span className="vc-count">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="vc-state">
            <div className="vc-spinner" />
            <p>Chargement en cours…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="vc-state">
            <div className="vc-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            <p>{search ? 'Aucun résultat pour cette recherche.' : 'Aucune inscription en attente.'}</p>
          </div>
        ) : (
          <div className="vc-table-wrap">
            <table className="vc-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>Nom complet</th>
                  <th>Téléphone</th>
                  <th>Email</th>
                  <th>filiere</th>
                  <th>nom parent</th>
                  <th>telephone de parent</th>
                  <th style={{ width: 180 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, i) => (
                  <tr key={i}>
                    <td className="vc-td-num">{i + 1}</td>
                    <td>
                      <div className="vc-identity">
                        <div
                          className="vc-avatar"
                          style={{ background: getColor(i) }}
                        >
                          {getInitials(v.nom_i, v.prenom_i)}
                        </div>
                        <div className="vc-identity-text">
                          <span className="vc-full-name">{v.nom_i} {v.prenom_i}</span>
                          <span className="vc-meta">Nouveau compte</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="vc-phone-cell">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.63A16 16 0 0 0 14 15.37l.54-.54a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.22 17z" />
                        </svg>
                        {v.num_tele}
                      </div>
                    </td>
                    <td>
                      <a className="vc-email-link" href={`mailto:${v.email}`}>{v.email}</a>
                    </td>
                    <td>
                      <a className="vc-full-name" >{v.filieres.nom}</a>
                    </td>
                    <td>
                      <a className="vc-full-name" >{v.nom_parents}</a>
                    </td>
                    <td>
                      <a className="vc-full-name" >{v.telephone_parent}</a>
                    </td>
                    <td>
                      <div className="vc-actions">
                        <button
                          className="vc-btn vc-btn--approve"
                          onClick={() => handleApprove(v, i)}
                          title="Approuver"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Approuver
                        </button>
                        <button
                          className="vc-btn vc-btn--reject"
                          onClick={() => handleReject(v, i)}
                          title="Refuser"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                          Refuser
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Validation_compte;