import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import './menu.css'
import { useNavigate } from "react-router-dom";
/* ════════════════════════════════════════════════
   NAV DATA
════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { label: 'Accueil', href: '/' },
  {
    label: 'À propos',
    href: '#apropos',
    sub: [
      {
        label: "Présentation de l'école",
        href: '/presantation',
        desc: 'Notre histoire & valeurs',
        icon: '🏛️',
        num: '01',
      },
      {
        label: 'Mission & Valeurs',
        href: '/mission&valeur',
        desc: 'Ce qui nous guide au quotidien',
        icon: '🧭',
        num: '02',
      },
    ],
  },
  {
    label: 'Admissions',
    href: '#admissions',
    sub: [
      {
        label: "Conditions d'inscription",
        href: '/condition inscription',
        desc: 'Critères, documents & processus',
        icon: '📋',
        num: '01',
      },
      {
        label: 'Frais de scolarité',
        href: '/frais inscription',
        desc: 'Tarifs, modalités & bourses',
        icon: '💳',
        num: '02',
      },
    ],
  },
  { label: 'Contact', href: '/contact' },
]

/* Account quick links (shown in My Account dropdown) */
const ACCOUNT_LINKS = [
  { label: 'Mon tableau de bord', href: '/Connection', icon: '⊞' },
 
]

/* ════════════════════════════════════════════════
   MEGA DROPDOWN — full-width panel
════════════════════════════════════════════════ */
function MegaDropdown({ items, label, open, onClose }) {
  return (
    <div
      className={`mega ${open ? 'mega--open' : ''}`}
      role="menu"
      aria-hidden={!open}
      aria-label={label}
    >
      <div className="mega__inner">
        {/* Left: numbered manifesto items */}
        <div className="mega__items">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="mega__item"
              role="menuitem"
              onClick={onClose}
            >
              <span className="mega__item-num">{item.num}</span>
             
              <span className="mega__item-body">
                <span className="mega__item-title">{item.label}</span>
                <span className="mega__item-desc">{item.desc}</span>
              </span>
              <span className="mega__item-arrow">→</span>
            </a>
          ))}
        </div>

        {/* Right: decorative panel */}
        <div className="mega__panel">
          <div className="mega__panel-eyebrow">École Médione</div>
          <div className="mega__panel-title">
            Excellence<br /><em>&amp; Innovation</em>
          </div>
          <div className="mega__panel-sub">
            Fès-Meknès · Depuis 1999
          </div>
          <div className="mega__panel-dot-grid" aria-hidden="true">
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} className="mega__panel-dot" />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="mega__foot">
        <a href="/Inscrire" className="mega__foot-cta" onClick={onClose}>
          Inscrire mon enfant →
        </a>
        <span className="mega__foot-hint">
          Inscriptions 2025–2026 ouvertes
        </span>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════
   MY ACCOUNT DROPDOWN
════════════════════════════════════════════════ */
function AccountDropdown({ open, userName, userRole, userInitial, onClose, onLogout }) {
  return (
    <div
      className={`acct-drop ${open ? 'acct-drop--open' : ''}`}
      role="menu"
      aria-hidden={!open}
      aria-label="Mon compte"
    >
      {/* Profile header */}
      <div className="acct-drop__head">
        <div className="acct-drop__avatar">
          <span className="acct-drop__avatar-initial">{userInitial}</span>
          <span className="acct-drop__avatar-online" aria-hidden="true" />
        </div>
        <div className="acct-drop__info">
          <span className="acct-drop__name">{userName}</span>
          <span className="acct-drop__role">{userRole}</span>
        </div>
      </div>

      {/* Quick links */}
      <div className="acct-drop__links">
        {ACCOUNT_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="acct-drop__link"
            role="menuitem"
            onClick={onClose}
          >
            <span className="acct-drop__link-icon">{link.icon}</span>
            <span className="acct-drop__link-label">{link.label}</span>
            <span className="acct-drop__link-arrow">›</span>
          </a>
        ))}
      </div>

      {/* Footer */}
      <div className="acct-drop__foot">
        <button className="acct-drop__logout" onClick={onLogout} type="button">
          <span>Se déconnecter</span>
          <span className="acct-drop__logout-icon">↗</span>
        </button>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════
   DRAWER ROW — mobile accordion
════════════════════════════════════════════════ */
function DrawerRow({ item, isOpen, onToggle, onClose, index }) {
  const maxH = isOpen ? `${(item.sub?.length ?? 0) * 80}px` : '0'

  if (!item.sub) {
    return (
      <div className="drow" style={{ '--i': index }}>
        <a href={item.href} className="drow__btn" onClick={onClose}>
          <span className="drow__btn-num">0{index + 1}</span>
          <span>{item.label}</span>
        </a>
      </div>
    )
  }

  return (
    <div className="drow" style={{ '--i': index }}>
      <button
        className={`drow__btn ${isOpen ? 'drow__btn--open' : ''}`}
        onClick={onToggle}
        aria-expanded={isOpen}
        type="button"
      >
        <span className="drow__btn-num">0{index + 1}</span>
        <span>{item.label}</span>
        <span className={`drow__chevron ${isOpen ? 'drow__chevron--up' : ''}`} aria-hidden="true">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      <div className="drow__acc" style={{ maxHeight: maxH }}>
        {item.sub.map((s, si) => (
          <a key={s.label} href={s.href} className="drow__sub" onClick={onClose}
            style={{ '--si': si }}>
            <span className="drow__sub-icon">{s.icon}</span>
            <span className="drow__sub-body">
              <span className="drow__sub-name">{s.label}</span>
              <span className="drow__sub-desc">{s.desc}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════
   MAIN MENU COMPONENT
════════════════════════════════════════════════ */
export default function Menu({ heroPage = false }) {
  const [openIdx,    setOpenIdx]    = useState(null)
  const [acctOpen,   setAcctOpen]   = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [accIdx,     setAccIdx]     = useState(null)
  const [scrolled,   setScrolled]   = useState(false)

  const navRef  = useRef(null)
  const acctRef = useRef(null)

  /* ── Check auth (all storage keys) ── */
  const isConnected = useMemo(() => {
    try {
      return !!(
        localStorage.getItem('codeSRC')  ||
        localStorage.getItem('codeENS')  ||
        localStorage.getItem('codeETD')  ||
        sessionStorage.getItem('codeSRC') ||
        sessionStorage.getItem('codeENS') ||
        sessionStorage.getItem('codeETD')
      )
    } catch { return false }
  }, [])

  /* ── Resolve user info from storage ── */
  const userInfo = useMemo(() => {
    try {
      const role =
        localStorage.getItem('codeSRC')  || sessionStorage.getItem('codeSRC')  ? 'Secrétariat'  :
        localStorage.getItem('codeENS')  || sessionStorage.getItem('codeENS')  ? 'Enseignant'   :
        localStorage.getItem('codeETD')  || sessionStorage.getItem('codeETD')  ? 'Étudiant'     :
        'Utilisateur'
      const name = localStorage.getItem('userName') || sessionStorage.getItem('userName') || 'Mon compte'
      const initial = name.charAt(0).toUpperCase() || 'M'
      return { role, name, initial }
    } catch {
      return { role: 'Utilisateur', name: 'Mon compte', initial: 'M' }
    }
  }, [])

  /* ── Passive scroll listener — GPU-safe ── */
  useEffect(() => {
    let ticking = false
    const fn = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 6)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* ── Close dropdowns on outside click ── */
  useEffect(() => {
    const fn = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenIdx(null)
      }
      if (acctRef.current && !acctRef.current.contains(e.target)) {
        setAcctOpen(false)
      }
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  /* ── Body scroll lock when drawer open ── */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  /* ── Escape key ── */
  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'Escape') {
        setOpenIdx(null)
        setAcctOpen(false)
        setDrawerOpen(false)
      }
    }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [])

  /* ── Memoized handlers — prevent needless re-renders ── */
  const closeDrawer     = useCallback(() => { setDrawerOpen(false); setAccIdx(null) }, [])
  const closeAll        = useCallback(() => { setOpenIdx(null); setAcctOpen(false) }, [])
  const toggleDropdown  = useCallback((i) => {
    setOpenIdx(prev => prev === i ? null : i)
    setAcctOpen(false)
  }, [])
  const toggleAcc       = useCallback((i) => setAccIdx(prev => prev === i ? null : i), [])
  const toggleAcct      = useCallback(() => {
    setAcctOpen(prev => !prev)
    setOpenIdx(null)
  }, [])

  const navigate = useNavigate();
  const handleLogout = useCallback(() => {
    try {
      ['codeSRC','codeENS','codeETD','userName'].forEach(k => {
        localStorage.removeItem(k)
        sessionStorage.removeItem(k)
      })
    } catch {}
  window.location.reload()
  }, [])

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>

        {/* ── TICKER — pure CSS, GPU-composited ── */}
        <div className="ticker" aria-label="Informations">
          <div className="ticker__track" aria-hidden="true">
            <div className="ticker__belt">
              {[
                '+212 612 892 323',
                'Instagram · @ecolemedione',
                "Bienvenue à l'École Médione",
                'Inscriptions 2025–2026 ouvertes',
                'Facebook · /ecolemedione',
                'Lycée · Fès-Meknès',
              ].map((t, i) => (
                <span key={i} className="ticker__item">
                  <span className="ticker__sep" aria-hidden="true">✦</span>
                  {t}
                </span>
              ))}
              {/* Duplicate for seamless loop — CSS only */}
              {[
                '+212 612 892 323',
                'Instagram · @ecolemedione',
                "Bienvenue à l'École Médione",
                'Inscriptions 2025–2026 ouvertes',
                'Facebook · /ecolemedione',
                'Lycée · Fès-Meknès',
              ].map((t, i) => (
                <span key={`b-${i}`} className="ticker__item" aria-hidden="true">
                  <span className="ticker__sep">✦</span>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── NAVBAR ── */}
        <nav className="navbar" ref={navRef} aria-label="Navigation principale">

          {/* Logo */}
          <a href="/" className="logo" aria-label="École Médione – Accueil">
            <div className="logo__badge">
              <img src="logo_ecole.png" alt="" className="logo__img" />
              <div className="logo__badge-ring" aria-hidden="true" />
            </div>
            <div className="logo__text">
              <span className="logo__name">École Mdione</span>
              <span className="logo__tagline">Excellence · Innovation</span>
            </div>
          </a>

          {/* Desktop nav */}
          <ul className="nl" role="menubar">
            {NAV_ITEMS.map((item, i) => (
              <li
                key={item.label}
                className={`nl__item ${openIdx === i ? 'nl__item--active' : ''}`}
                role="none"
              >
                {item.sub ? (
                  <>
                    <button
                      type="button"
                      className={`nl__btn ${openIdx === i ? 'nl__btn--on' : ''}`}
                      role="menuitem"
                      aria-haspopup="true"
                      aria-expanded={openIdx === i}
                      onClick={() => toggleDropdown(i)}
                    >
                      {item.label}
                      <svg
                        className={`nl__caret ${openIdx === i ? 'nl__caret--up' : ''}`}
                        width="9" height="6" viewBox="0 0 9 6" fill="none"
                        aria-hidden="true"
                      >
                        <path d="M1 1L4.5 5L8 1" stroke="currentColor"
                          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <MegaDropdown
                      items={item.sub}
                      label={item.label}
                      open={openIdx === i}
                      onClose={closeAll}
                    />
                  </>
                ) : (
                  <a
                    href={item.href}
                    className="nl__link"
                    role="menuitem"
                    onClick={closeAll}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* CTA / Account area */}
          <div className="nav-right">
            {!isConnected ? (
              /* ── Guest buttons ── */
              <div className="nav-guest">
                <a href="/Connection" className="btn-cx">Connexion</a>
                <a href="/Inscrire" className="btn-ins">S'inscrire →</a>
              </div>
            ) : (
              /* ── Authenticated: My Account dropdown trigger ── */
              <div className="nav-account" ref={acctRef}>
                <button
                  type="button"
                  className={`acct-trigger ${acctOpen ? 'acct-trigger--open' : ''}`}
                  onClick={toggleAcct}
                  aria-haspopup="true"
                  aria-expanded={acctOpen}
                  aria-label="Mon compte"
                >
                  <div className="acct-trigger__avatar">
                    <span>{userInfo.initial}</span>
                  </div>
                  <div className="acct-trigger__info">
                    <span className="acct-trigger__name">{userInfo.name}</span>
                    <span className="acct-trigger__role">{userInfo.role}</span>
                  </div>
                  <svg
                    className={`acct-trigger__caret ${acctOpen ? 'acct-trigger__caret--up' : ''}`}
                    width="9" height="6" viewBox="0 0 9 6" fill="none"
                    aria-hidden="true"
                  >
                    <path d="M1 1L4.5 5L8 1" stroke="currentColor"
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <AccountDropdown
                  open={acctOpen}
                  userName={userInfo.name}
                  userRole={userInfo.role}
                  userInitial={userInfo.initial}
                  onClose={closeAll}
                  onLogout={handleLogout}
                />
              </div>
            )}

            {/* Hamburger */}
            <button
              type="button"
              className={`ham ${drawerOpen ? 'ham--x' : ''}`}
              onClick={() => setDrawerOpen(v => !v)}
              aria-label={drawerOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
        </nav>

        {/* ── MOBILE DRAWER ── */}
        <aside
          id="mobile-drawer"
          className={`drawer ${drawerOpen ? 'drawer--open' : ''}`}
          aria-hidden={!drawerOpen}
          aria-label="Menu mobile"
        >
          {/* Drawer header */}
          <div className="drawer__head">
            <a href="/" className="drawer__logo" onClick={closeDrawer}>
              <span className="drawer__logo-name">École Médione</span>
              <span className="drawer__logo-tag">Excellence · Innovation</span>
            </a>
            <button
              type="button"
              className="drawer__close"
              onClick={closeDrawer}
              aria-label="Fermer le menu"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* If connected: mini profile strip */}
          {isConnected && (
            <div className="drawer__profile">
              <div className="drawer__profile-avatar">{userInfo.initial}</div>
              <div className="drawer__profile-info">
                <span className="drawer__profile-name">{userInfo.name}</span>
                <span className="drawer__profile-role">{userInfo.role}</span>
              </div>
              <a href="/Connection" className="drawer__profile-btn" onClick={closeDrawer}>
                Tableau de bord →
              </a>
            </div>
          )}

          {/* Nav rows */}
          <div className="drawer__scroll">
            {NAV_ITEMS.map((item, i) => (
              <DrawerRow
                key={item.label}
                item={item}
                index={i}
                isOpen={accIdx === i}
                onToggle={() => toggleAcc(i)}
                onClose={closeDrawer}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="drawer__foot">
            {!isConnected ? (
              <>
                <a href="/Connection" className="drawer__foot-cx" onClick={closeDrawer}>
                  Connexion
                </a>
                <a href="/Inscrire" className="drawer__foot-ins" onClick={closeDrawer}>
                  S'inscrire →
                </a>
              </>
            ) : (
              <button className="drawer__foot-logout" onClick={handleLogout} type="button">
                Se déconnecter ↗
              </button>
            )}
          </div>
        </aside>

        {/* Overlay */}
        <div
          className={`veil ${drawerOpen ? 'veil--on' : ''}`}
          onClick={closeDrawer}
          aria-hidden="true"
        />
      </header>

      {!heroPage && <div className="header-spacer" aria-hidden="true" />}
    </>
  )
}