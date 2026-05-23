import { useState, useMemo } from 'react';
import './ense.css';

// ─── Constants ────────────────────────────────────────────────

const AVATAR_COLORS = [
  '#3b82f6','#22c55e','#a855f7','#f97316',
  '#ec4899','#14b8a6','#ef4444','#6366f1',
  '#f59e0b','#0ea5e9','#84cc16','#78716c',
];

const FILIERE_COLORS = {
  'Sciences Math A':             '#3b82f6',
  'Sciences Math B':             '#6366f1',
  'Sciences Physiques':          '#22c55e',
  'Sciences de la Vie':          '#84cc16',
  'Lettres & Sciences Humaines': '#a855f7',
  'Sciences Economiques':        '#f97316',
};

// ─── Helpers ─────────────────────────────────────────────────

function getAvatarProps(teacher) {
  var first    = teacher.prenom_e ? teacher.prenom_e[0] : '?';
  var last     = teacher.nom_e   ? teacher.nom_e[0]    : '?';
  var initials = (first + last).toUpperCase();
  var charSum  = [...(teacher.prenom_e || ''), ...(teacher.nom_e || '')]
    .reduce(function(acc, c) { return acc + c.charCodeAt(0); }, 0);
  var color = AVATAR_COLORS[charSum % AVATAR_COLORS.length];
  return { initials, color };
}

function HoursBar({ hours, max }) {
  var m     = max || 25;
  var pct   = Math.min((hours / m) * 100, 100);
  var color = hours >= 20 ? '#ef4444' : hours >= 16 ? '#f97316' : '#22c55e';
  return (
    <div className="hours-bar-wrap">
      <div className="hours-bar-track">
        <div className="hours-bar-fill" style={{ width: pct + '%', background: color }} />
      </div>
      <span className="hours-bar-label" style={{ color }}>{hours}h/sem</span>
    </div>
  );
}

function FiliereTag({ name }) {
  var color = FILIERE_COLORS[name] || '#6b7280';
  return (
    <span className="filiere-tag" style={{ '--fc': color }}>{name}</span>
  );
}

// ─── Table Row ───────────────────────────────────────────────

function TeacherRow({ teacher, onSelect, selected, onDelete }) {
  var av           = getAvatarProps(teacher);
  var filiereName  = teacher.filiere ? teacher.filiere.nom : '—';
  var matiere      = teacher.sujjet  ? teacher.sujjet.matiere_nom : '—';
  var email        = teacher.user    ? teacher.user.email : '—';
  var hoursPerWeek = teacher.total_hours ? Math.round(teacher.total_hours / 18) : null;

  function handleDelete(e) {
    e.stopPropagation();
    onDelete(teacher.id);
  }

  return (
    <tr
      className={'teacher-roww' + (selected ? ' teacher-row--selected' : '')}
      onClick={function() { onSelect(teacher); }}
    >
      <td>
        <div className="teacher-identity">
          <div className="teacher-avatar" style={{ background: av.color }}>
            {av.initials}
          </div>
          <div>
            <div className="teacher-name">{teacher.prenom_e} {teacher.nom_e}</div>
            <div className="teacher-email">{email}</div>
          </div>
        </div>
      </td>
      <td><span className="sujjet-pill">{matiere}</span></td>
      <td>
        <div className="filieres-cell">
          <FiliereTag name={filiereName} />
        </div>
      </td>
      
      
      <td>
        <button className="btn-delete" onClick={handleDelete}>
          🗑 Supprimer
        </button>
      </td>
    </tr>
  );
}

// ─── Detail Drawer ───────────────────────────────────────────

function DetailDrawer({ teacher, onClose, onEdit }) {
  if (!teacher) return null;

  var av           = getAvatarProps(teacher);
  var matiere      = teacher.sujjet  ? teacher.sujjet.matiere_nom  : '—';
  var filiereName  = teacher.filiere ? teacher.filiere.nom          : '—';
  var email        = teacher.user    ? teacher.user.email            : '—';
  var phone        = teacher.telephone_e       || '—';
  var cin          = teacher.num_carte_national || '—';
  var totalHours   = teacher.total_hours || 0;
  var hoursPerWeek = totalHours ? Math.round(totalHours / 18) : 0;

  return (
    <div className="detail-drawer">
      <div className="drawer-header">
        <div className="drawer-avatar-lg" style={{ background: av.color }}>
          {av.initials}
        </div>
        <div className="drawer-identity">
          <h3>{teacher.prenom_e} {teacher.nom_e}</h3>
          <p>{email}</p>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="drawer-section">
        <div className="drawer-label">Matiere enseignee</div>
        <span className="sujjet-pill sujjet-pill--lg">{matiere}</span>
      </div>

      <div className="drawer-section">
        <div className="drawer-label">Filiere assignee</div>
        <div className="drawer-filieres">
          <FiliereTag name={filiereName} />
        </div>
      </div>

      {(phone !== '—' || cin !== '—') && (
        <div className="drawer-section">
          <div className="drawer-label">Informations de contact</div>
          {phone !== '—' && (
            <div className="drawer-info-row"><span>Telephone</span><span>{phone}</span></div>
          )}
          {cin !== '—' && (
            <div className="drawer-info-row"><span>CIN</span><span>{cin}</span></div>
          )}
        </div>
      )}

      <div className="drawer-section">
        <div className="drawer-label">Charge horaire</div>
        <div className="hours-grid">
          <div className="hg-card">
            <span className="hg-val">{hoursPerWeek}h</span>
            <span className="hg-lbl">Par semaine</span>
          </div>
          <div className="hg-card">
            <span className="hg-val">{totalHours}h</span>
            <span className="hg-lbl">Total annuel</span>
          </div>
          <div className="hg-card">
            <span className="hg-val">18</span>
            <span className="hg-lbl">Semaines</span>
          </div>
        </div>
        {hoursPerWeek > 0 && <HoursBar hours={hoursPerWeek} />}
      </div>

      <button className="btn-edit-drawer" onClick={function() { onEdit(teacher); }}>
        Modifier les informations
      </button>
    </div>
  );
}

// ─── Shared Form Modal (Add and Edit) ────────────────────────

var emptyForm = {
  prenom_e: '', nom_e: '', email: '',
  id_jujjets: '', id_filieres: '',
  telephone_e: '', num_carte_national: '',
};

function TeacherModal({ dataFilieres, DataSujjet, mode, initialData, onClose, onSubmit }) {
  var isEdit = mode === 'edit';

  var [form, setForm] = useState(function() {
    if (isEdit && initialData) {
      return {
        prenom_e:           initialData.prenom_e                        || '',
        nom_e:              initialData.nom_e                            || '',
        email:              (initialData.user && initialData.user.email) || '',
        id_jujjets:         initialData.id_jujjets                       || '',
        id_filieres:        initialData.id_filieres                      || '',
        telephone_e:        initialData.telephone_e                      || '',
        num_carte_national: initialData.num_carte_national               || '',
      };
    }
    return Object.assign({}, emptyForm);
  });

  var [errors, setErrors] = useState({});

  var set = function(k, v) {
    setForm(function(f) { var n = Object.assign({}, f); n[k] = v; return n; });
  };

  var validate = function() {
    var e = {};
    if (!form.prenom_e.trim())     e.prenom_e    = 'Requis';
    if (!form.nom_e.trim())        e.nom_e       = 'Requis';
    if (!form.email.includes('@')) e.email       = 'Email invalide';
    if (!form.id_jujjets)          e.id_jujjets  = 'Requis';
    if (!form.id_filieres)         e.id_filieres = 'Choisir une filiere';
    return e;
  };

  // ── Shared: build the payload from the current form state ──
  var buildPayload = function() {
    return Object.assign({}, isEdit ? initialData : { id: Date.now() }, {
      prenom_e:           form.prenom_e.trim(),
      nom_e:              form.nom_e.trim(),
      email:              form.email.trim(),
      id_jujjets:         form.id_jujjets,
      id_filieres:        form.id_filieres,
      telephone_e:        form.telephone_e.trim(),
      num_carte_national: form.num_carte_national.trim(),
      password:           form.num_carte_national.trim(), // CIN as default password
    });
  };

  // ── Add handler (POST) ──────────────────────────────────────
  var handleSubmit = function() {
    var e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    var payload = buildPayload();

    fetch('http://127.0.0.1:8000/api/enseignementsStore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function(res) { return res.json(); })
      .then(function(data) { console.log('Created:', data); })
      .catch(function(err) { console.error('Add failed:', err); });

    onSubmit(payload); // show in table immediately
    onClose();
  };

  // ── Edit handler (PUT) ──────────────────────────────────────
  // FIX 1: was using undefined `id` variable → now uses initialData.id
  // FIX 2: was sending empty JSON.stringify() → now sends full payload
  var handleUpdate = function() {
    var e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    var payload = buildPayload();

    fetch('http://127.0.0.1:8000/api/enseignements/' + initialData.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function(res) { return res.json(); })
      .then(function(data) { console.log('Updated:', data); })
      .catch(function(err) { console.error('Update failed:', err); });

    onSubmit(payload); // update table + drawer immediately
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={function(e) { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? "Modifier l'enseignant" : 'Ajouter un enseignant'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-row-2">
            <div className="form-group">
              <label>Prenom</label>
              <input
                value={form.prenom_e}
                onChange={function(e) { set('prenom_e', e.target.value); }}
                placeholder="Marie"
              />
              {errors.prenom_e && <span className="form-err">{errors.prenom_e}</span>}
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input
                value={form.nom_e}
                onChange={function(e) { set('nom_e', e.target.value); }}
                placeholder="Dupont"
              />
              {errors.nom_e && <span className="form-err">{errors.nom_e}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={function(e) { set('email', e.target.value); }}
              placeholder="marie.dupont@school.edu"
            />
            {errors.email && <span className="form-err">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Matiere</label>
            <select
              value={form.id_jujjets}
              onChange={function(e) { set('id_jujjets', e.target.value); }}
            >
              <option value="" hidden>Choisir</option>
              {DataSujjet.map(function(s) {
                return <option key={s.id} value={s.id}>{s.matiere_nom}</option>;
              })}
            </select>
            {errors.id_jujjets && <span className="form-err">{errors.id_jujjets}</span>}
          </div>

          <div className="form-group">
            <label>Filiere</label>
            <select
              value={form.id_filieres}
              onChange={function(e) { set('id_filieres', e.target.value); }}
            >
              <option value="">Choisir</option>
              {dataFilieres.map(function(f) {
                return <option key={f.id} value={f.id}>{f.nom}</option>;
              })}
            </select>
            {errors.id_filieres && <span className="form-err">{errors.id_filieres}</span>}
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Telephone</label>
              <input
                value={form.telephone_e}
                onChange={function(e) { set('telephone_e', e.target.value); }}
                placeholder="0612345678"
              />
            </div>
            <div className="form-group">
              <label>CIN</label>
              <input
                value={form.num_carte_national}
                onChange={function(e) { set('num_carte_national', e.target.value); }}
                placeholder="AB123456"
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Annuler</button>
          {/*
            FIX 3: was `isEdit === 'Ajouter'` — comparing a boolean to a string,
            always false, so the edit branch never ran.
            Now correctly: edit mode → PUT (handleUpdate), add mode → POST (handleSubmit).
          */}
          <button className="btn-submit" onClick={isEdit ? handleUpdate : handleSubmit}>
            {isEdit ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────

export default function Ense({ dataFilieres, DataSujjet, DataEnse }) {
  var data = DataEnse || [];

  var [localOverrides, setLocalOverrides] = useState({});
  var [deletedIds,     setDeletedIds]     = useState(new Set());
  var [selected,       setSelected]       = useState(null);
  var [search,         setSearch]         = useState('');
  var [filterFiliere,  setFilterFiliere]  = useState('');
  var [filterStatus,   setFilterStatus]   = useState('');
  var [showModal,      setShowModal]      = useState(false);
  var [editTarget,     setEditTarget]     = useState(null);
  var [sortBy,         setSortBy]         = useState('name');

  var teachers = useMemo(function() {
    var base = data
      .filter(function(t) { return !deletedIds.has(t.id); })
      .map(function(t) { return localOverrides[t.id] || t; });

    var added = Object.values(localOverrides).filter(function(t) {
      return !deletedIds.has(t.id) && !data.find(function(d) { return d.id === t.id; });
    });
    return base.concat(added);
  }, [data, localOverrides, deletedIds]);

  // Single handler for both Add and Edit — updates localOverrides and refreshes drawer
  var handleSubmitFromModal = function(t) {
    setLocalOverrides(function(prev) {
      var n = Object.assign({}, prev);
      n[t.id] = t;
      return n;
    });
    setSelected(function(prev) {
      return prev && prev.id === t.id ? t : prev;
    });
  };

  var handleDelete = function(id) {
    fetch('http://127.0.0.1:8000/api/enseignementsDestroy', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id }),
    })
      .then(function(res) { return res.json(); })
      .then(function(data) { console.log('Deleted:', data); })
      .catch(function(err) { console.error('Delete failed:', err); });

    setSelected(function(prev) { return prev && prev.id === id ? null : prev; });
    setDeletedIds(function(prev) {
      var next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  var handleSelect = function(t) {
    setSelected(function(prev) { return prev && prev.id === t.id ? null : t; });
  };

  var filtered = teachers
    .filter(function(t) {
      var q       = search.toLowerCase();
      var matiere = t.sujjet ? t.sujjet.matiere_nom : '';
      var email   = t.user   ? t.user.email          : '';
      if (q && !(t.prenom_e + ' ' + t.nom_e + ' ' + matiere + ' ' + email).toLowerCase().includes(q))
        return false;
      if (filterFiliere && String(t.id_filieres) !== String(filterFiliere))
        return false;
      return true;
    })
    .sort(function(a, b) {
      if (sortBy === 'name')  return (a.nom_e || '').localeCompare(b.nom_e || '');
      if (sortBy === 'hours') return (b.total_hours || 0) - (a.total_hours || 0);
      return 0;
    });

  var totalHours  = teachers.reduce(function(s, t) { return s + (t.total_hours || 0); }, 0);
  var allFilieres = new Set(
    teachers.map(function(t) { return t.filiere ? t.filiere.nom : null; }).filter(Boolean)
  );

  return (
    <div className="ens-page">

      <div className="ens-summary">
        {[
          { icon: '👨‍🏫', label: 'Enseignants',       value: teachers.length },
       
        ].map(function(s) {
          return (
            <div key={s.label} className="summary-card">
              <span className="sc-icon">{s.icon}</span>
              <div>
                <div className="sc-val">{s.value}</div>
                <div className="sc-lbl">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="ens-toolbar">
        <div className="ens-search">
          <span className="search-ico">🔍</span>
          <input
            value={search}
            onChange={function(e) { setSearch(e.target.value); }}
            placeholder="Rechercher enseignant, matiere..."
          />
        </div>

        <select
          className="ens-select"
          value={filterFiliere}
          onChange={function(e) { setFilterFiliere(e.target.value); }}
        >
          <option value="">Toutes les filieres</option>
          {dataFilieres.map(function(f) {
            return <option key={f.id} value={f.id}>{f.nom}</option>;
          })}
        </select>

        

        <select
          className="ens-select"
          value={sortBy}
          onChange={function(e) { setSortBy(e.target.value); }}
        >
          <option value="name">Trier : Nom</option>
          <option value="hours">Trier : Heures</option>
        </select>

        <button className="btn-add" onClick={function() { setShowModal(true); }}>
          + Ajouter
        </button>
      </div>

      <div className={'ens-workspace' + (selected ? ' has-drawer' : '')}>
        <div className="table-wrap">
          <table className="teachers-table">
            <thead>
              <tr>
                <th>Enseignant</th>
                <th>Matiere</th>
                <th>Filiere</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6" className="empty-row">Aucun resultat</td></tr>
              ) : (
                filtered.map(function(t) {
                  return (
                    <TeacherRow
                      key={t.id}
                      teacher={t}
                      selected={selected && selected.id === t.id}
                      onSelect={handleSelect}
                      onDelete={handleDelete}
                    />
                  );
                })
              )}
            </tbody>
          </table>
          <div className="table-footer">
            {filtered.length} enseignant{filtered.length !== 1 ? 's' : ''} affiche{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {selected && (
          <DetailDrawer
            teacher={selected}
            onClose={function() { setSelected(null); }}
            onEdit={function(t) { setEditTarget(t); }}
          />
        )}
      </div>

      {showModal && (
        <TeacherModal
          dataFilieres={dataFilieres}
          DataSujjet={DataSujjet}
          mode="add"
          onClose={function() { setShowModal(false); }}
          onSubmit={handleSubmitFromModal}
        />
      )}

      {editTarget && (
        <TeacherModal
          dataFilieres={dataFilieres}
          DataSujjet={DataSujjet}
          mode="edit"
          initialData={editTarget}
          onClose={function() { setEditTarget(null); }}
          onSubmit={handleSubmitFromModal}
        />
      )}
    </div>
  );
}