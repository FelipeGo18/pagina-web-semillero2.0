import { useState, useEffect } from 'react'
import PracticeCard from './PracticeCard'
import './PracticesSection.css'
import { getPracticesWithCache } from '../services/practicesApi'
import { XCircleIcon } from './Icons'
import logoSemillero from '../assets/logo_semillero.png'
import abejaComputador from '../assets/Abeja Computador.png'

export default function PracticesSection() {
  const [currentImage, setCurrentImage] = useState(0);
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const images = [logoSemillero, abejaComputador];
  
  // Cargar prácticas desde la API
  useEffect(() => {
    const loadPractices = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPracticesWithCache();
        setPractices(data);
      } catch (err) {
        console.error('Error loading practices:', err);
        setError(err.message || 'Error al cargar las prácticas');
      } finally {
        setLoading(false);
      }
    };

    loadPractices();
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, []);

  const scrollToPractices = () => {
    const practicesContent = document.querySelector('.practices-content-section');
    if (practicesContent) {
      practicesContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="practices-section">
      <div className="practices-header-section">
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
            onClick={scrollToPractices}
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
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="practices-content-section">
        <p className="practices-subtitle2">Escoge una practica</p>
        <div className="practices-container">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando prácticas...</p>
            </div>
          )}
          
          {error && (
            <div className="error-state">
              <p>
                <XCircleIcon size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                {error}
              </p>
              <button onClick={() => window.location.reload()} className="retry-btn">
                Reintentar
              </button>
            </div>
          )}
          
          {!loading && !error && (
            <div className="practices-grid">
              {practices.map((practice) => (
                <PracticeCard key={practice.id} practice={practice} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
