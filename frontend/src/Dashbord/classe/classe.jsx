import React, { useState, useRef, useEffect } from "react";
import "./classe.css";

/* ─── hooks ─── */
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

/* ─── Avatar ─── */
function Avatar({ name, prenom, size = "md" }) {
  const initials = `${(name || "?")[0]}${(prenom || "")[0] || ""}`.toUpperCase();
  const hue = [...(name || "")].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return (
    <span className={`cl-avatar cl-avatar--${size}`} style={{ "--av-hue": hue }}>
      {initials}
    </span>
  );
}

/* ─── Pill badge ─── */
function Pill({ text, variant = "neutral" }) {
  return <span className={`cl-pill cl-pill--${variant}`}>{text}</span>;
}

/* ─── Stat card ─── */
function StatCard({ label, value, icon, variant }) {
  return (
    <div className={`cl-stat cl-stat--${variant}`}>
      <div className="cl-stat__icon">{icon}</div>
      <div className="cl-stat__content">
        <span className="cl-stat__value">{value}</span>
        <span className="cl-stat__label">{label}</span>
      </div>
    </div>
  );
}

/* ─── Icons ─── */
const IBook = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const IUsers = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const ICheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IAlert = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IPlus = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);
const IClose = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const ISwap = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
    <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>
);
const IUserMinus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <line x1="23" y1="11" x2="17" y2="11"/>
  </svg>
);
const ITrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const ISearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const ITeacher = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 14l9-5-9-5-9 5 9 5z"/>
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
  </svg>
);

/* ─── Modal wrapper ─── */
function Modal({ onClose, children, width = 500 }) {
  const ref = useRef(null);
  useClickOutside(ref, onClose);
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="cl-overlay" role="dialog" aria-modal="true">
      <div className="cl-modal" ref={ref} style={{ maxWidth: width }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Add Class Modal ─── */
function AddClasseModal({ dataFilieres, onClose, onSubmit }) {
  const [obj, setObj] = useState({ nom_classe: "", id_filiere: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!obj.nom_classe.trim()) e.nom_classe = "Le nom est requis";
    if (!obj.id_filiere) e.id_filiere = "Choisissez une filière";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(obj);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className="cl-modal__head">
        <div className="cl-modal__icon cl-modal__icon--teal"><IPlus size={18} /></div>
        <div className="cl-modal__head-text">
          <h2 className="cl-modal__title">Nouvelle classe</h2>
          <p className="cl-modal__sub">Remplissez les informations ci-dessous</p>
        </div>
        <button className="cl-modal__close" onClick={onClose} aria-label="Fermer"><IClose size={14} /></button>
      </div>
      <form className="cl-modal__body" onSubmit={handleSubmit}>
        <div className={`cl-field ${errors.nom_classe ? "cl-field--err" : ""}`}>
          <label className="cl-field__label">Nom de la classe</label>
          <input
            type="text"
            className="cl-field__input"
            placeholder="ex : Terminale A, 3ème B…"
            value={obj.nom_classe}
            autoFocus
            onChange={(e) => { setObj({ ...obj, nom_classe: e.target.value }); setErrors({ ...errors, nom_classe: "" }); }}
          />
          {errors.nom_classe && <span className="cl-field__msg" role="alert">{errors.nom_classe}</span>}
        </div>
        <div className={`cl-field ${errors.id_filiere ? "cl-field--err" : ""}`}>
          <label className="cl-field__label">Filière</label>
          <select
            className="cl-field__input"
            value={obj.id_filiere}
            onChange={(e) => { setObj({ ...obj, id_filiere: e.target.value }); setErrors({ ...errors, id_filiere: "" }); }}
          >
            <option value="">— Choisir une filière —</option>
            {dataFilieres.map((v) => <option key={v.id} value={v.id}>{v.nom}</option>)}
          </select>
          {errors.id_filiere && <span className="cl-field__msg" role="alert">{errors.id_filiere}</span>}
        </div>
        <div className="cl-modal__foot">
          <button type="button" className="cl-btn cl-btn--ghost" onClick={onClose}>Annuler</button>
          <button type="submit" className="cl-btn cl-btn--primary"><IPlus size={13} /> Créer la classe</button>
        </div>
      </form>
    </Modal>
  );
}

/* ─── Change / Assign Class Modal ─── */
function ChangeClasseModal({ etudiant, dataClasse, onClose, onSubmit }) {
  const [selectedId, setSelectedId] = useState("");
  const filtered = dataClasse.filter(
    (c) => String(c.id_filiere) === String(etudiant.id_filieres) &&
           String(c.id) !== String(etudiant.classe?.id)
  );
  const isUnassigned = !etudiant.classe;

  return (
    <Modal onClose={onClose} width={420}>
      <div className="cl-modal__head">
        <Avatar name={etudiant.nom} prenom={etudiant.prenom} />
        <div className="cl-modal__head-text">
          <h2 className="cl-modal__title">{isUnassigned ? "Affecter à une classe" : "Changer de classe"}</h2>
          <p className="cl-modal__sub">{etudiant.nom} {etudiant.prenom}</p>
        </div>
        <button className="cl-modal__close" onClick={onClose} aria-label="Fermer"><IClose size={14} /></button>
      </div>
      <div className="cl-modal__body">
        <div className="cl-field">
          <label className="cl-field__label">{isUnassigned ? "Classe" : "Nouvelle classe"}</label>
          {filtered.length === 0 ? (
            <p className="cl-modal__empty-hint">Aucune autre classe disponible dans cette filière.</p>
          ) : (
            <select className="cl-field__input" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              <option value="">— Choisir —</option>
              {filtered.map((c) => (
                <option key={c.id} value={c.id}>{c.nom_classe} · {c.filiere?.nom ?? "—"}</option>
              ))}
            </select>
          )}
        </div>
        <div className="cl-modal__foot">
          <button className="cl-btn cl-btn--ghost" onClick={onClose}>Annuler</button>
          <button
            className="cl-btn cl-btn--primary"
            disabled={!selectedId}
            onClick={() => { onSubmit(String(etudiant.id), selectedId); onClose(); }}
          >
            Confirmer
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Assign Student Modal ─── */
function AssignStudentModal({ classe, dataEtudiants, onClose, onSubmit }) {
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");

  const available = dataEtudiants.filter(
    (e) =>
      !e.classe &&
      String(e.id_filieres) === String(classe.id_filiere) &&
      (!search || `${e.nom} ${e.prenom} ${e.email}`.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Modal onClose={onClose} width={520}>
      <div className="cl-modal__head">
        <div className="cl-modal__icon cl-modal__icon--blue"><IUsers /></div>
        <div className="cl-modal__head-text">
          <h2 className="cl-modal__title">Affecter un étudiant</h2>
          <p className="cl-modal__sub">Classe : <strong>{classe.nom_classe}</strong></p>
        </div>
        <button className="cl-modal__close" onClick={onClose} aria-label="Fermer"><IClose size={14} /></button>
      </div>
      <div className="cl-modal__body">
        <div className="cl-search-row">
          <span className="cl-search-row__icon"><ISearch /></span>
          <input
            className="cl-search-row__input"
            type="text"
            placeholder="Rechercher par nom ou email…"
            value={search}
            autoFocus
            onChange={(e) => { setSearch(e.target.value); setSelectedId(""); }}
          />
          {search && (
            <button className="cl-search-row__clear" onClick={() => { setSearch(""); setSelectedId(""); }}>
              <IClose size={11} />
            </button>
          )}
        </div>

        {available.length === 0 ? (
          <div className="cl-pick-empty">
            <IUsers />
            <span>{search ? "Aucun résultat pour cette recherche." : "Aucun étudiant disponible pour cette filière."}</span>
          </div>
        ) : (
          <div className="cl-pick-list">
            {available.map((e) => {
              const selected = selectedId === String(e.id);
              return (
                <button
                  key={e.id}
                  type="button"
                  className={`cl-pick-item ${selected ? "cl-pick-item--selected" : ""}`}
                  onClick={() => setSelectedId(String(e.id))}
                >
                  <Avatar name={e.nom} prenom={e.prenom} size="sm" />
                  <div className="cl-pick-item__text">
                    <span className="cl-pick-item__name">{e.nom} {e.prenom}</span>
                    <span className="cl-pick-item__email">{e.email}</span>
                  </div>
                  {e.filiere?.nom && <Pill text={e.filiere.nom} variant="blue" />}
                  <span className="cl-pick-item__radio">{selected && <ICheck />}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="cl-modal__foot">
          <button className="cl-btn cl-btn--ghost" onClick={onClose}>Annuler</button>
          <button
            className="cl-btn cl-btn--primary"
            disabled={!selectedId}
            onClick={() => { onSubmit(selectedId, classe.id); onClose(); }}
          >
            <ICheck /> Confirmer l'affectation
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Assign Teacher Modal ─── */
function AssignEnseignantModal({ mode, enseignant, classe, dataEnseignants, dataClasses, onClose, onSubmit }) {
  const [selectedId, setSelectedId] = useState("");
  const isFromClass = mode === "from_class";
  const available = dataEnseignants.filter((e) => e.id_classe === null || e.id_classe === undefined);

  return (
    <Modal onClose={onClose} width={440}>
      <div className="cl-modal__head">
        <div className="cl-modal__icon cl-modal__icon--purple"><ITeacher /></div>
        <div className="cl-modal__head-text">
          <h2 className="cl-modal__title">Affecter un enseignant</h2>
          <p className="cl-modal__sub">
            {isFromClass
              ? `Classe : ${classe?.nom_classe}`
              : `Enseignant : ${enseignant?.nom_e} ${enseignant?.prenom_e}`}
          </p>
        </div>
        <button className="cl-modal__close" onClick={onClose} aria-label="Fermer"><IClose size={14} /></button>
      </div>
      <div className="cl-modal__body">
        {isFromClass ? (
          available.length === 0 ? (
            <p className="cl-modal__empty-hint">Aucun enseignant disponible sans classe.</p>
          ) : (
            <div className="cl-field">
              <label className="cl-field__label">Enseignant à affecter</label>
              <select className="cl-field__input" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                <option value="">— Choisir un enseignant —</option>
                {available.map((e) => (
                  <option key={e.id} value={e.id}>{e.nom_e} {e.prenom_e} — {e.sujjets?.matiere_nom ?? "—"}</option>
                ))}
              </select>
            </div>
          )
        ) : (
          dataClasses.length === 0 ? (
            <p className="cl-modal__empty-hint">Aucune classe disponible.</p>
          ) : (
            <div className="cl-field">
              <label className="cl-field__label">Classe à affecter</label>
              <select className="cl-field__input" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                <option value="">— Choisir une classe —</option>
                {dataClasses.map((c) => (
                  <option key={c.id} value={c.id}>{c.nom_classe} · {c.filiere?.nom ?? "—"}</option>
                ))}
              </select>
            </div>
          )
        )}
        <div className="cl-modal__foot">
          <button className="cl-btn cl-btn--ghost" onClick={onClose}>Annuler</button>
          <button
            className="cl-btn cl-btn--primary"
            disabled={!selectedId}
            onClick={() => {
              isFromClass ? onSubmit(selectedId, classe.id) : onSubmit(enseignant.id, selectedId);
              onClose();
            }}
          >
            Affecter
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Confirm Delete ─── */
function ConfirmDeleteModal({ nom, onClose, onConfirm }) {
  return (
    <Modal onClose={onClose} width={400}>
      <div className="cl-confirm">
        <div className="cl-confirm__icon"><ITrash /></div>
        <h2 className="cl-confirm__title">Supprimer la classe</h2>
        <p className="cl-confirm__desc">
          Êtes-vous sûr de vouloir supprimer <strong>« {nom} »</strong> ?<br />
          Cette action est irréversible.
        </p>
        <div className="cl-confirm__actions">
          <button className="cl-btn cl-btn--ghost" onClick={onClose}>Annuler</button>
          <button className="cl-btn cl-btn--danger" onClick={() => { onConfirm(); onClose(); }}>
            <ITrash /> Supprimer
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function Classe({
  DataEnse = [],
  dataFilieres = [],
  dataEtudiant = [],
  dataClasse = [],
}) {
  const [activeClass,        setActiveClass]        = useState(null);
  const [activeTab,          setActiveTab]          = useState({});
  const [showAddModal,       setShowAddModal]       = useState(false);
  const [changeModal,        setChangeModal]        = useState(null);
  const [assignStudentModal, setAssignStudentModal] = useState(null);
  const [assignModal,        setAssignModal]        = useState(null);
  const [deleteModal,        setDeleteModal]        = useState(null);
  const [search,             setSearch]             = useState("");
  const [localClasses,       setLocalClasses]       = useState(dataClasse);
  const [localEtudiants,     setLocalEtudiants]     = useState(dataEtudiant);
  const [localEnseignants,   setLocalEnseignants]   = useState(DataEnse);

  useEffect(() => { setLocalClasses(dataClasse); },    [dataClasse]);
  useEffect(() => { setLocalEtudiants(dataEtudiant); }, [dataEtudiant]);
  useEffect(() => { setLocalEnseignants(DataEnse); },  [DataEnse]);

  const grouped = localClasses.map((classe) => ({
    ...classe,
    etudiants:   localEtudiants.filter((e) => e.classe?.id === classe.id),
    enseignants: localEnseignants.filter((e) => String(e.id_classe) === String(classe.id)),
  }));

  const sansClasse = localEtudiants.filter(
    (e) => !e.classe &&
      (!search || `${e.nom} ${e.prenom} ${e.email}`.toLowerCase().includes(search.toLowerCase()))
  );
  const enseignantsSansClasse = localEnseignants.filter(
    (e) => e.id_classe === null || e.id_classe === undefined
  );

  const totalEtudiants = localEtudiants.length;
  const assigned       = localEtudiants.filter((e) => e.classe).length;
  const unassigned     = totalEtudiants - assigned;

  const handleAddClasse = (obj) => {
    const filiere   = dataFilieres.find((f) => String(f.id) === String(obj.id_filiere));
    const newClasse = { id: Date.now(), nom_classe: obj.nom_classe, id_filiere: obj.id_filiere, filiere };
    setLocalClasses((prev) => [...prev, newClasse]);
    fetch("http://127.0.0.1:8000/api/classeStore", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj),
    });
  };

  const handleDeleteClasse = (id) => {
    setLocalClasses((prev) => prev.filter((c) => c.id !== id));
    if (activeClass === id) setActiveClass(null);
    setLocalEtudiants((prev) => prev.map((e) => e.classe?.id === id ? { ...e, classe: null } : e));
    setLocalEnseignants((prev) => prev.map((e) => String(e.id_classe) === String(id) ? { ...e, id_classe: null } : e));
    fetch(`http://127.0.0.1:8000/api/classeDestroy/${id}`, { method: "DELETE" });
  };

  const handleAssignStudent = (etudiantId, classeId) => {
    const classe = localClasses.find((c) => String(c.id) === String(classeId));
    setLocalEtudiants((prev) => prev.map((e) => String(e.id) === String(etudiantId) ? { ...e, classe } : e));
    fetch(`http://127.0.0.1:8000/api/updateClasseEtud/${etudiantId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_classe: classeId }),
    });
  };

  const handleChangeClasse = (etudiantId, classeId) => {
    const classe = localClasses.find((c) => String(c.id) === String(classeId));
    setLocalEtudiants((prev) => prev.map((e) => String(e.id) === String(etudiantId) ? { ...e, classe } : e));
    fetch(`http://127.0.0.1:8000/api/updateClasseEtud/${etudiantId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_classe: classeId }),
    });
  };

  const handleRemoveFromClass = (etudiantId) => {
    setLocalEtudiants((prev) => prev.map((e) => String(e.id) === String(etudiantId) ? { ...e, classe: null } : e));
    fetch(`http://127.0.0.1:8000/api/retireretudiantclacc/${etudiantId}`, { method: "PUT" });
  };

  const handleAssignEnseignant = (enseignantId, classeId) => {
    setLocalEnseignants((prev) => prev.map((e) => String(e.id) === String(enseignantId) ? { ...e, id_classe: classeId } : e));
    fetch(`http://127.0.0.1:8000/api/updateClasseEnse/${enseignantId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_classe: classeId }),
    });
  };

  const handleRemoveEnseignant = (enseignantId) => {
    setLocalEnseignants((prev) => prev.map((e) => String(e.id) === String(enseignantId) ? { ...e, id_classe: null } : e));
    fetch(`http://127.0.0.1:8000/api/retirerEnsegnClacc/${enseignantId}`, { method: "PUT" });
  };

  const getTab = (id) => activeTab[id] || "students";
  const setTab = (id, tab) => setActiveTab((prev) => ({ ...prev, [id]: tab }));

  return (
    <div className="cl-page">

      {/* ── Header ── */}
      <header className="cl-header">
        <div className="cl-header__text">
          <h1 className="cl-header__title">Gestion des Classes</h1>
          <p className="cl-header__sub">Organisez vos élèves et enseignants par classe et filière</p>
        </div>
        <button className="cl-btn cl-btn--primary cl-btn--lg" onClick={() => setShowAddModal(true)}>
          <IPlus size={14} /> Nouvelle classe
        </button>
      </header>

      {/* ── Stats ── */}
      <div className="cl-stats-grid">
        <StatCard label="Classes"     value={localClasses.length}    icon={<IBook />}    variant="teal" />
        <StatCard label="Étudiants"   value={totalEtudiants}          icon={<IUsers />}   variant="blue" />
        <StatCard label="Affectés"    value={assigned}                icon={<ICheck />}   variant="green" />
        <StatCard label="Sans classe" value={unassigned}              icon={<IAlert />}   variant={unassigned > 0 ? "amber" : "green"} />
        <StatCard label="Enseignants" value={localEnseignants.length} icon={<ITeacher />} variant="violet" />
      </div>

      {/* ── Classes list ── */}
      <section className="cl-section">
        <div className="cl-section__head">
          <h2 className="cl-section__title">
            <span className="cl-section__title-icon"><IBook /></span>
            Classes
            <Pill text={localClasses.length} variant="teal" />
          </h2>
        </div>

        {localClasses.length === 0 ? (
          <div className="cl-empty">
            <div className="cl-empty__icon"><IBook /></div>
            <p className="cl-empty__text">Aucune classe créée pour le moment.</p>
            <button className="cl-btn cl-btn--primary" onClick={() => setShowAddModal(true)}>
              <IPlus size={13} /> Créer une classe
            </button>
          </div>
        ) : (
          <div className="cl-class-list">
            {grouped.map((classe, idx) => {
              const isOpen = activeClass === classe.id;
              const tab    = getTab(classe.id);
              return (
                <div
                  key={classe.id}
                  className={`cl-card ${isOpen ? "cl-card--open" : ""}`}
                  style={{ "--card-idx": idx }}
                >
                  {/* Card row */}
                  <div className="cl-card__row" onClick={() => setActiveClass(isOpen ? null : classe.id)}>
                    <div className="cl-card__letter">
                      {(classe.nom_classe || "?")[0].toUpperCase()}
                    </div>
                    <div className="cl-card__info">
                      <span className="cl-card__name">{classe.nom_classe}</span>
                      <span className="cl-card__filiere">{classe.filiere?.nom ?? "—"}</span>
                    </div>
                    <div className="cl-card__meta">
                      <span className="cl-card__counter cl-card__counter--blue">
                        <IUsers /> {classe.etudiants.length} élève{classe.etudiants.length !== 1 ? "s" : ""}
                      </span>
                      <span className="cl-card__counter cl-card__counter--violet">
                        <ITeacher /> {classe.enseignants.length} enseignant{classe.enseignants.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="cl-card__controls" onClick={(e) => e.stopPropagation()}>
                      <button className="cl-del-btn" onClick={() => setDeleteModal(classe)}>
                        <ITrash /> Supprimer
                      </button>
                    </div>
                    <span className={`cl-chevron ${isOpen ? "cl-chevron--up" : ""}`}>
                      <IChevron />
                    </span>
                  </div>

                  {/* Expanded panel */}
                  {isOpen && (
                    <div className="cl-panel">
                      <div className="cl-tabs">
                        <button
                          className={`cl-tab ${tab === "students" ? "cl-tab--active" : ""}`}
                          onClick={() => setTab(classe.id, "students")}
                        >
                          <IUsers /> Étudiants
                          <span className="cl-tab__badge">{classe.etudiants.length}</span>
                        </button>
                        <button
                          className={`cl-tab ${tab === "teachers" ? "cl-tab--active" : ""}`}
                          onClick={() => setTab(classe.id, "teachers")}
                        >
                          <ITeacher /> Enseignants
                          <span className="cl-tab__badge">{classe.enseignants.length}</span>
                        </button>
                        <div className="cl-tabs__gap" />
                        {tab === "students" && (
                          <button className="cl-btn cl-btn--blue cl-btn--sm" onClick={() => setAssignStudentModal(classe)}>
                            <IPlus size={12} /> Affecter un étudiant
                          </button>
                        )}
                        {tab === "teachers" && (
                          <button className="cl-btn cl-btn--primary cl-btn--sm" onClick={() => setAssignModal(classe)}>
                            <IPlus size={12} /> Affecter un enseignant
                          </button>
                        )}
                      </div>

                      {tab === "students" && (
                        classe.etudiants.length === 0 ? (
                          <div className="cl-panel-empty"><IUsers /><span>Aucun étudiant dans cette classe.</span></div>
                        ) : (
                          <table className="cl-table">
                            <thead>
                              <tr><th>Étudiant</th><th>Email</th><th className="cl-th--center">Actions</th></tr>
                            </thead>
                            <tbody>
                              {classe.etudiants.map((e) => (
                                <tr key={e.id}>
                                  <td>
                                    <div className="cl-person">
                                      <Avatar name={e.nom} prenom={e.prenom} size="sm" />
                                      <span className="cl-person__name">{e.nom} {e.prenom}</span>
                                    </div>
                                  </td>
                                  <td><span className="cl-email">{e.email}</span></td>
                                  <td className="cl-td--center">
                                    <div className="cl-row-actions">
                                      <button className="cl-action-btn cl-action-btn--blue" onClick={(ev) => { ev.stopPropagation(); setChangeModal(e); }}>
                                        <ISwap /> Changer
                                      </button>
                                      <button className="cl-action-btn cl-action-btn--gray" onClick={(ev) => { ev.stopPropagation(); handleRemoveFromClass(e.id); }}>
                                        <IUserMinus /> Retirer
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )
                      )}

                      {tab === "teachers" && (
                        classe.enseignants.length === 0 ? (
                          <div className="cl-panel-empty"><ITeacher /><span>Aucun enseignant affecté à cette classe.</span></div>
                        ) : (
                          <table className="cl-table">
                            <thead>
                              <tr><th>Enseignant</th><th>Matière</th><th>Email</th><th className="cl-th--center">Actions</th></tr>
                            </thead>
                            <tbody>
                              {classe.enseignants.map((e) => (
                                <tr key={e.id}>
                                  <td>
                                    <div className="cl-person">
                                      <Avatar name={e.nom_e} prenom={e.prenom_e} size="sm" />
                                      <span className="cl-person__name">{e.nom_e} {e.prenom_e}</span>
                                    </div>
                                  </td>
                                  <td>
                                    {e.sujjets?.matiere_nom
                                      ? <Pill text={e.sujjets.matiere_nom} variant="violet" />
                                      : <span className="cl-na">—</span>}
                                  </td>
                                  <td><span className="cl-email">{e.email}</span></td>
                                  <td className="cl-td--center">
                                    <div className="cl-row-actions">
                                      <button className="cl-action-btn cl-action-btn--gray" onClick={(ev) => { ev.stopPropagation(); handleRemoveEnseignant(e.id); }}>
                                        <IUserMinus /> Retirer
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Unassigned students ── */}
      <section className="cl-section">
        <div className="cl-section__head">
          <h2 className="cl-section__title">
            <span className="cl-section__title-icon"><IUsers /></span>
            Étudiants sans classe
            {unassigned > 0 && <Pill text={unassigned} variant="amber" />}
          </h2>
          
        </div>

        {sansClasse.length === 0 ? (
          <div className="cl-empty cl-empty--sm">
            <div className="cl-empty__icon"><ICheck /></div>
            <p className="cl-empty__text">
              {search ? "Aucun résultat pour cette recherche." : "Tous les étudiants sont affectés."}
            </p>
          </div>
        ) : (
          <div className="cl-table-wrap">
            <table className="cl-table">
              <thead>
                <tr><th>Étudiant</th><th>Email</th><th>Filière</th><th className="cl-th--center">Actions</th></tr>
              </thead>
              <tbody>
                {sansClasse.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <div className="cl-person">
                        <Avatar name={e.nom} prenom={e.prenom} size="sm" />
                        <span className="cl-person__name">{e.nom} {e.prenom}</span>
                      </div>
                    </td>
                    <td><span className="cl-email">{e.email}</span></td>
                    <td>{e.filiere?.nom ? <Pill text={e.filiere.nom} variant="blue" /> : <span className="cl-na">—</span>}</td>
                    <td className="cl-td--center">
                      <div className="cl-row-actions">
                        <button className="cl-action-btn cl-action-btn--blue" onClick={() => setChangeModal(e)}>
                          <IPlus size={11} /> Affecter
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Unassigned teachers ── */}
      <section className="cl-section">
        <div className="cl-section__head">
          <h2 className="cl-section__title">
            <span className="cl-section__title-icon"><ITeacher /></span>
            Enseignants sans classe
            {enseignantsSansClasse.length > 0 && <Pill text={enseignantsSansClasse.length} variant="amber" />}
          </h2>
        </div>

        {enseignantsSansClasse.length === 0 ? (
          <div className="cl-empty cl-empty--sm">
            <div className="cl-empty__icon"><ICheck /></div>
            <p className="cl-empty__text">Tous les enseignants sont affectés.</p>
          </div>
        ) : (
          <div className="cl-table-wrap">
            <table className="cl-table">
              <thead>
                <tr><th>Enseignant</th><th>Matière</th><th>Email</th><th className="cl-th--center">Actions</th></tr>
              </thead>
              <tbody>
                {enseignantsSansClasse.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <div className="cl-person">
                        <Avatar name={e.nom_e} prenom={e.prenom_e} size="sm" />
                        <span className="cl-person__name">{e.nom_e} {e.prenom_e}</span>
                      </div>
                    </td>
                    <td>{e.sujjet?.matiere_nom ? <Pill text={e.sujjet?.matiere_nom} variant="violet" /> : <span className="cl-na">—</span>}</td>
                    <td><span className="cl-email">{e.user?.email}</span></td>
                    <td className="cl-td--center">
                      <div className="cl-row-actions">
                        <button className="cl-action-btn cl-action-btn--violet" onClick={() => setAssignModal({ _singleEnseignant: e })}>
                          <IPlus size={11} /> Affecter
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Modals ── */}
      {showAddModal && (
        <AddClasseModal dataFilieres={dataFilieres} onClose={() => setShowAddModal(false)} onSubmit={handleAddClasse} />
      )}
      {assignStudentModal && (
        <AssignStudentModal classe={assignStudentModal} dataEtudiants={localEtudiants} onClose={() => setAssignStudentModal(null)} onSubmit={handleAssignStudent} />
      )}
      {changeModal && (
        <ChangeClasseModal etudiant={changeModal} dataClasse={localClasses} onClose={() => setChangeModal(null)} onSubmit={changeModal.classe ? handleChangeClasse : handleAssignStudent} />
      )}
      {assignModal && (
        <AssignEnseignantModal
          mode={assignModal._singleEnseignant ? "from_teacher" : "from_class"}
          enseignant={assignModal._singleEnseignant ?? null}
          classe={assignModal._singleEnseignant ? null : assignModal}
          dataEnseignants={localEnseignants}
          dataClasses={localClasses}
          onClose={() => setAssignModal(null)}
          onSubmit={handleAssignEnseignant}
        />
      )}
      {deleteModal && (
        <ConfirmDeleteModal nom={deleteModal.nom_classe} onClose={() => setDeleteModal(null)} onConfirm={() => handleDeleteClasse(deleteModal.id)} />
      )}
    </div>
  );
}