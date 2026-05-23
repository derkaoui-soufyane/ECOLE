import React from 'react'
import './contact.css'

function Contact() {
  return (
    <div className="contact-container">
      <div className="contact-top">
        <p>
          Vous recherchez une école de qualité pour assurer l’avenir de vos enfants ?<br /><br />
          Découvrez notre établissement, un espace éducatif moderne et dynamique,
          parfaitement adapté à tous les niveaux scolaires.<br /><br />
          Nous proposons un enseignement de qualité, un encadrement pédagogique sérieux,
          ainsi qu’un environnement motivant pour développer les compétences de chaque élève.
        </p>
      </div>
      <div className="contact-bottom">
        <div className="contact-bottom-left">
          <form className="contact-form">
            <input type="text" placeholder="Votre nom" />
            <input type="text" placeholder="Sujet" />
            <input type="email" placeholder="Email" />
            <textarea placeholder="Votre message"></textarea>
            <button type="submit">Envoyer</button>
          </form>
        </div>

        {/* RIGHT MAP */}
        <div className="contact-bottom-right">
          <iframe
            className="contact-iframe"
            src="https://www.google.com/maps?q=34.0596987,-5.0220899&z=15&output=embed"
            allowFullScreen
            loading="lazy"
          ></iframe>

          <div className="loc-corner">
            📍 Fès — Maroc <br />
            34.0609° N · 5.0260° O
          </div>
        </div>

      </div>

    </div>
  )
}

export default Contact