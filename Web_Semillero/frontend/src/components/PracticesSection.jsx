import PracticeCard from './PracticeCard'
import './PracticesSection.css'
import { practicesData } from '../data/practicesData'

export default function PracticesSection() {
  return (
    <section className="practices-section">
      <div className="practices-container">
        <h2 className="practices-title">Prácticas del Semillero</h2>
        <p className="practices-subtitle">
          Explora nuestras prácticas interactivas y comienza tu viaje en el mundo de la tecnología
        </p>
        
        <div className="practices-grid">
          {practicesData.map((practice) => (
            <PracticeCard key={practice.id} practice={practice} />
          ))}
        </div>
      </div>
    </section>
  )
}
