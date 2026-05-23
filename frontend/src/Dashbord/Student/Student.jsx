import React, { useState } from 'react';
import "./student.css";

const EMPTY_FORM = {
  prenom: '',
  nom: '',
  telephone: '',
  nom_parents: '',
  email: '',
  telephone_parent: '',
  id_filieres: '',
  num_carte_parent: '',
};

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #ec4899, #f43f5e)',
  'linear-gradient(135deg, #0ea5e9, #06b6d4)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f97316, #ef4444)',
  'linear-gradient(135deg, #a855f7, #6366f1)',
  'linear-gradient(135deg, #f59e0b, #f97316)',
  'linear-gradient(135deg, #14b8a6, #0ea5e9)',
];

function formFromStudent(student) {
  return {
    prenom:           student.prenom           ?? '',
    nom:              student.nom              ?? '',
    telephone:        student.telephone        ?? '',
    nom_parents:      student.nom_parents      ?? '',
    email:            student.email            ?? '',
    telephone_parent: student.telephone_parent ?? '',
    id_filieres:      student.id_filieres      ?? '',
    num_carte_parent: student.num_carte_parent  ?? '',
  };
}

const IconMail = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
  </svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
  </svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 14.094A5.973 5.973 0 004 17v1H1v-1a3 3 0 013.75-2.906z"/>
  </svg>
);
const IconEdit = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-2.207 2.207L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
  </svg>
);
const IconTrash = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd"/>
  </svg>
);
const IconPlus = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
    <path d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z"/>
  </svg>
);

function Student({ dataFilieres = [], Icons, allStudents: initialStudents, setAllStudents }) {
  const [students, setStudents]               = useState(initialStudents ?? []);
  const [viewMode, setViewMode]               = useState('grid');
  const [searchTerm, setSearchTerm]           = useState('');
  const [filterFiliere, setFilterFiliere]     = useState('All Filieres');
  const [filterStatus, setFilterStatus]       = useState('All Status');
  const [sortBy, setSortBy]                   = useState('name');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showForm, setShowForm]               = useState(false);
  const [editingId, setEditingId]             = useState(null);
  const [formData, setFormData]               = useState({ ...EMPTY_FORM });
  const [formError, setFormError]             = useState('');
  const [deletingId, setDeletingId]           = useState(null);

  const getPrenom     = (s) => s.prenom      ?? '';
  const getNom        = (s) => s.nom         ?? '';
  const getEmail      = (s) => s.email       ?? '';
  const getclasse      = (s) => s.classe?.nom_classe       ?? '';
  const getTelephone  = (s) => s.telephone   ?? '';
  const getNomParents = (s) => s.nom_parents ?? '';
  const getTelParent  = (s) => s.telephone_parent ?? '';
  const getNumCarte   = (s) => s.num_carte_parent ?? '';
  const getStatus     = (s) => s.status ?? 'active';
  const getAvatar     = (s) => s.avatar ?? AVATAR_GRADIENTS[((s.id ?? 0) % AVATAR_GRADIENTS.length)];

  const getFiliere = (s) => {
    if (s.nom_filiere)  return s.nom_filiere;
    if (s.filiere?.nom) return s.filiere.nom;
    if (s.id_filieres && dataFilieres?.length) {
      const found = dataFilieres.find((f) => String(f.id) === String(s.id_filieres));
      if (found) return found.nom;
    }
    return s.id_filieres ? `Filiere #${s.id_filieres}` : '-';
  };

  const filteredStudents = students
    .filter((s) => {
      const fullName = `${getPrenom(s)} ${getNom(s)}`.toLowerCase();
      const matchSearch  = fullName.includes(searchTerm.toLowerCase())
        || getEmail(s).toLowerCase().includes(searchTerm.toLowerCase())
        || getFiliere(s).toLowerCase().includes(searchTerm.toLowerCase());
      const matchFiliere = filterFiliere === 'All Filieres' || getFiliere(s) === filterFiliere;
      const matchStatus  = filterStatus  === 'All Status'   || getStatus(s) === filterStatus;
      return matchSearch && matchFiliere && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name')    return getNom(a).localeCompare(getNom(b));
      if (sortBy === 'filiere') return getFiliere(a).localeCompare(getFiliere(b));
      return 0;
    });

  const statusMeta = (s) => {
    if (s === 'honor-roll') return { label: "Tableau d'honneur", cls: 'badge--honor' };
    if (s === 'probation')  return { label: 'En probation',      cls: 'badge--probation' };
    return                         { label: 'Actif',             cls: 'badge--active' };
  };

  const syncStudents = (next) => { setStudents(next); setAllStudents?.(next); };

  const openAdd = () => { setEditingId(null); setFormData({ ...EMPTY_FORM }); setFormError(''); setShowForm(true); };
  const openEdit = (student, e) => {
    e?.stopPropagation();
    setEditingId(student.id);
    setFormData(formFromStudent(student));
    setFormError('');
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); setFormData({ ...EMPTY_FORM }); setFormError(''); };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'num_carte_parent' ? { password: value } : {}),
    }));
  };

  const handleSave = () => {
    if (!formData.prenom.trim() || !formData.nom.trim()) { setFormError('Le prenom et le nom sont obligatoires.'); return; }
    if (!formData.email.trim()) { setFormError("L'email est obligatoire."); return; }
    const payload = { ...formData, password: formData.num_carte_parent };

    if (editingId !== null) {
      
      fetch(`http://127.0.0.1:8000/api/etudiantsUpdat/${editingId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
        .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
        .then((updated) => {
          syncStudents(students.map((s) => (s.id === editingId ? { ...s, ...updated } : s)));
          if (selectedStudent?.id === editingId) setSelectedStudent((p) => ({ ...p, ...updated }));
          closeForm();
        })
        .catch(() => {
          syncStudents(students.map((s) => (s.id === editingId ? { ...s, ...payload } : s)));
          if (selectedStudent?.id === editingId) setSelectedStudent((p) => ({ ...p, ...payload }));
          closeForm();
        });
    } else {
      fetch('http://127.0.0.1:8000/api/etudiantsStore', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
        .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
        .then((created) => {
          const newId = created.id ?? (Math.max(0, ...students.map((s) => s.id)) + 1);
          syncStudents([...students, { ...payload, ...created, id: newId, avatar: AVATAR_GRADIENTS[newId % AVATAR_GRADIENTS.length] }]);
          closeForm();
        })
        .catch(() => {
          const newId = Math.max(0, ...students.map((s) => s.id)) + 1;
          syncStudents([...students, { ...payload, id: newId, avatar: AVATAR_GRADIENTS[newId % AVATAR_GRADIENTS.length] }]);
          closeForm();
        });
    }
  };

  const askDelete = (id, e) => { e?.stopPropagation(); setDeletingId(id); };
  const confirmDelete = () => {
    fetch("http://127.0.0.1:8000/api/etudiantsDestroy", {
  method: "DELETE",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id: deletingId })
}).catch(() => {});
    syncStudents(students.filter((s) => s.id !== deletingId));
    if (selectedStudent?.id === deletingId) setSelectedStudent(null);
    setDeletingId(null);
  };

  const uniqueFilieres = Array.from(new Set(students.map(getFiliere).filter(Boolean)));
  const total          = students.length;


  return (
    <div className="roster-page">

      {/* Stats */}
      <div className="roster-stats">
        <div className="stat-pill">
          <span className="stat-pill__num">{total}</span>
          <span className="stat-pill__lbl">Total etudiants</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="roster-toolbar">
        <div className="toolbar-left">
          <div className="search-wrap">
            <svg className="search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="9" r="6"/><path d="M15 15l-3.5-3.5"/>
            </svg>
            <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="select-etudiant-filter">
            <select value={filterFiliere} onChange={(e) => setFilterFiliere(e.target.value)}>
              <option value="All Filieres">Toutes les filieres</option>
              {uniqueFilieres.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
            
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Trier par nom</option>
              <option value="filiere">Trier par filiere</option>
            </select>
          </div>
        </div>
        <div className="toolbar-right">
          <button className="btn-view" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid'
              ? <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15"><path d="M3 4h14v2H3V4zm0 5h14v2H3V9zm0 5h14v2H3v-2z"/></svg>
              : <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15"><path d="M3 3h6v6H3V3zm8 0h6v6h-6V3zm-8 8h6v6H3v-6zm8 0h6v6h-6v-6z"/></svg>
            }
            {viewMode === 'grid' ? 'Vue liste' : 'Vue grille'}
          </button>
          <button className="btn-add" onClick={openAdd}>
            <IconPlus /> Ajouter un etudiant
          </button>
        </div>
      </div>

      <p className="roster-count">
        {filteredStudents.length} etudiant{filteredStudents.length !== 1 ? 's' : ''} affiche{filteredStudents.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      {viewMode === 'grid' && (
        <div className="roster-grid">
          {filteredStudents.map((student) => {
            const { label, cls } = statusMeta(getStatus(student));
            const initials = `${getPrenom(student)[0] ?? ''}${getNom(student)[0] ?? ''}`;
            return (
              <div key={student.id} className="roster-card" onClick={() => setSelectedStudent(student)}>
                <div className="roster-card__top">
                  <div className="roster-card__avatar" style={{ background: getAvatar(student) }}>{initials}</div>
                  <span className={`badge ${cls}`}>{label}</span>
                </div>
                <div className="roster-card__name">{getPrenom(student)} {getNom(student)}</div>
                <div className="roster-card__meta">{getFiliere(student)}</div>
                <ul className="roster-card__info-list">
                  {getTelephone(student) && <li><IconPhone /><span>{getTelephone(student)}</span></li>}
                  {getNomParents(student) && <li><IconUsers /><span>{getNomParents(student)}</span></li>}
                </ul>
                <div className="roster-card__email">
                  <IconMail /><span>{getEmail(student) || '-'}</span>
                </div>
                <div className="roster-card__actions" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-action btn-action--edit" onClick={(e) => openEdit(student, e)}>
                    <IconEdit /> Modifier
                  </button>
                  <button className="btn-action btn-action--delete" onClick={(e) => askDelete(student.id, e)}>
                    <IconTrash /> Supprimer
                  </button>
                </div>
              </div>
            );
          })}
          {filteredStudents.length === 0 && (
            <div className="roster-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <p>Aucun etudiant trouve</p>
            </div>
          )}
        </div>
      )}

      {/* Liste */}
      {viewMode === 'list' && (
        <div className="roster-table-wrap">
          <table className="roster-table">
            <thead>
              <tr>
                <th>Etudiant</th>
                <th>Filiere</th>
                <th>Telephone</th>
                <th>Parent</th>
                <th>Tel. parent</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const { label, cls } = statusMeta(getStatus(student));
                const initials = `${getPrenom(student)[0] ?? ''}${getNom(student)[0] ?? ''}`;
                return (
                  <tr key={student.id} onClick={() => setSelectedStudent(student)}>
                    <td>
                      <div className="table-cell-student">
                        <div className="table-avatar" style={{ background: getAvatar(student) }}>{initials}</div>
                        <div>
                          <div className="table-name">{getPrenom(student)} {getNom(student)}</div>
                          <div className="table-email">{getEmail(student)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="td-muted">{getFiliere(student)}</td>
                    <td className="td-muted">{getTelephone(student) || '-'}</td>
                    <td className="td-muted">{getNomParents(student) || '-'}</td>
                    <td className="td-muted">{getTelParent(student) || '-'}</td>
                    <td><span className={`badge ${cls}`}>{label}</span></td>
                    <td>
                      <div className="table-actions" onClick={(e) => e.stopPropagation()}>
                        <button className="btn-action btn-action--edit btn-action--sm" onClick={(e) => openEdit(student, e)}>Modifier</button>
                        <button className="btn-action btn-action--delete btn-action--sm" onClick={(e) => askDelete(student.id, e)}>Supprimer</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="roster-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <p>Aucun etudiant trouve</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Profil */}
      {selectedStudent && (() => {
        const { label, cls } = statusMeta(getStatus(selectedStudent));
        const initials = `${getPrenom(selectedStudent)[0] ?? ''}${getNom(selectedStudent)[0] ?? ''}`;
        return (
          <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
            <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedStudent(null)}>x</button>
              <div className="profile-modal__avatar" style={{ background: getAvatar(selectedStudent) }}>{initials}</div>
              <h2 className="profile-modal__name">{getPrenom(selectedStudent)} {getNom(selectedStudent)}</h2>
              <p className="profile-modal__sub">{getFiliere(selectedStudent)}</p>
              <span className={`badge ${cls}`} style={{ marginBottom: '1.25rem', display: 'inline-block' }}>{label}</span>
              <ul className="profile-modal__rows">
                {getEmail(selectedStudent)      && <li><span>Email</span><span>{getEmail(selectedStudent)}</span></li>}
                {getEmail(selectedStudent)      && <li><span>classe</span><span>{getclasse(selectedStudent)}</span></li>}
                {getTelephone(selectedStudent)  && <li><span>Tel. etudiant</span><span>{getTelephone(selectedStudent)}</span></li>}
                {getNomParents(selectedStudent) && <li><span>Parent</span><span>{getNomParents(selectedStudent)}</span></li>}
                {getTelParent(selectedStudent)  && <li><span>Tel. parent</span><span>{getTelParent(selectedStudent)}</span></li>}
                {getNumCarte(selectedStudent)   && <li><span>N carte parent</span><span>{getNumCarte(selectedStudent)}</span></li>}
              </ul>
              <div className="profile-modal__actions">
                <button className="btn-action btn-action--edit" onClick={() => { setSelectedStudent(null); openEdit(selectedStudent); }}>
                  <IconEdit /> Modifier
                </button>
                <button className="btn-action btn-action--delete" onClick={() => { setSelectedStudent(null); askDelete(selectedStudent.id); }}>
                  <IconTrash /> Supprimer
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal Formulaire */}
      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeForm}>x</button>
            <div className="form-modal__header">
              <div className="form-modal__icon">
                {editingId !== null ? <IconEdit /> : <IconPlus />}
              </div>
              <h2>{editingId !== null ? "Modifier l'etudiant" : 'Ajouter un etudiant'}</h2>
            </div>
            {formError && <div className="form-error">{formError}</div>}
            <div className="form-row-2">
              <div className="form-field">
                <label>Prenom <span className="req">*</span></label>
                <input name="prenom" value={formData.prenom} onChange={handleFormChange} placeholder="Ahmed" />
              </div>
              <div className="form-field">
                <label>Nom <span className="req">*</span></label>
                <input name="nom" value={formData.nom} onChange={handleFormChange} placeholder="Benali" />
              </div>
            </div>
            <div className="form-field">
              <label>Email <span className="req">*</span></label>
              <input name="email" type="email" value={formData.email} onChange={handleFormChange} placeholder="ahmed@ecole.ma" />
            </div>
            <div className="form-row-2">
              <div className="form-field">
                <label>Telephone etudiant</label>
                <input name="telephone" type="tel" value={formData.telephone} onChange={handleFormChange} placeholder="06 00 00 00 00" />
              </div>
              <div className="form-field">
                <label>Nom des parents</label>
                <input name="nom_parents" value={formData.nom_parents} onChange={handleFormChange} placeholder="M. Benali" />
              </div>
            </div>
            <div className="form-row-2">
              <div className="form-field">
                <label>Telephone parent</label>
                <input name="telephone_parent" type="tel" value={formData.telephone_parent} onChange={handleFormChange} placeholder="06 00 00 00 01" />
              </div>
              <div className="form-field">
                <label>Filiere</label>
                <select name="id_filieres" value={formData.id_filieres} onChange={(e) => setFormData({ ...formData, id_filieres: e.target.value })}>
                  <option value="" hidden>Choisir une filiere</option>
                  {dataFilieres.map((v) => <option key={v.id} value={v.id}>{v.nom}</option>)}
                </select>
              </div>
            </div>
            <div className="form-field">
              <label>N carte parent <span className="req">*</span></label>
              <input name="num_carte_parent" value={formData.num_carte_parent} onChange={handleFormChange} placeholder="CIN / Carte parent" />
              <small style={{ color: 'var(--text-3)', fontSize: '0.77rem', marginTop: '2px' }}>
                Ce numero sera utilise comme mot de passe initial.
              </small>
            </div>
            <div className="form-actions">
              <button className="btn-cancel" onClick={closeForm}>Annuler</button>
              <button className="btn-save" onClick={handleSave}>
                {editingId !== null ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {deletingId !== null && (
        <div className="modal-overlay" onClick={() => setDeletingId(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
            </div>
            <h3>Supprimer cet etudiant ?</h3>
            <p>Cette action est irreversible. Toutes les donnees seront definitvement supprimees.</p>
            <div className="confirm-modal__actions">
              <button className="btn-cancel" onClick={() => setDeletingId(null)}>Annuler</button>
              <button className="btn-confirm-delete" onClick={confirmDelete}>Oui, supprimer</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Student;