import { useState, useEffect } from 'react'
import PracticeCard from './PracticeCard'
import './PracticesSection.css'
import { getPracticesWithCache } from '../services/practicesApi'
import { XCircleIcon } from './Icons'
import { useSearch } from '../context/SearchContext'

export default function PracticesSection() {
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchTerm } = useSearch();
  
  // Filtrar prácticas según el término de búsqueda
  const filteredPractices = practices.filter(practice => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = practice.title?.toLowerCase().includes(searchLower);
    const descriptionMatch = practice.description?.toLowerCase().includes(searchLower);
    const categoryMatch = practice.category?.toLowerCase().includes(searchLower);
    
    return titleMatch || descriptionMatch || categoryMatch;
  });
  
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
  

  // (Eliminado) Scroll automático al buscar. Ahora solo se hace scroll al dar click en sugerencia del buscador.

  const scrollToPractices = () => {
    const practicesContent = document.querySelector('.practices-content-section');
    if (practicesContent) {
      practicesContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="practices-section">
      <div className="practices-content-section">
        <p className="practices-subtitle2">
          {searchTerm.trim() 
            ? `Resultados para "${searchTerm}" (${filteredPractices.length})`
            : 'Escoge una práctica'
          }
        </p>
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
          
          {!loading && !error && filteredPractices.length === 0 && searchTerm.trim() && (
            <div className="no-results-state">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
                <path d="M11 8v6"/>
                <path d="M8 11h6"/>
              </svg>
              <h3>No se encontraron resultados</h3>
              <p>No hay prácticas que coincidan con "{searchTerm}"</p>
              <p className="suggestion">Intenta con otros términos de búsqueda</p>
            </div>
          )}
          
          {!loading && !error && filteredPractices.length > 0 && (
            <div className="practices-grid">
              {filteredPractices.map((practice) => (
                <PracticeCard key={practice.id} practice={practice} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
