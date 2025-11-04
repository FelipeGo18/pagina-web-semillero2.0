import { useState, useEffect } from 'react'
import './PracticesHeader.css'
import logoSemillero from '../assets/logo_semillero.png'
import abejaComputador from '../assets/Abeja Computador.png'

export default function PracticesHeader({ onScrollToPractices }) {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [logoSemillero, abejaComputador];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="practices-header-section">
      <div className="practices-container">
        <h2 className="practices-title">Prácticas del Semillero</h2>
        <p className="practices-subtitle">
          Explora nuestras prácticas interactivas y comienza tu viaje en el mundo de la tecnología
        </p>
        <div className="practices-mascot-container">
          <img 
            src={logoSemillero} 
            alt="Mascota del Semillero" 
            className={`practices-mascot mascot-logo ${currentImage === 0 ? 'active' : ''}`}
          />
          <img 
            src={abejaComputador} 
            alt="Abeja Computador" 
            className={`practices-mascot mascot-abeja ${currentImage === 1 ? 'active' : ''}`}
          />
        </div>
        <button 
          className="scroll-to-practices-btn"
          onClick={onScrollToPractices}
          aria-label="Ver prácticas"
        >
          <span>Empecemos</span>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </button>
      </div>
    </section>
  )
}
