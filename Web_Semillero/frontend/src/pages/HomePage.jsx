import PracticesHeader from '../components/PracticesHeader'
import PracticesSection from '../components/PracticesSection'

export default function HomePage() {
  const scrollToPractices = () => {
    const practicesContent = document.querySelector('.practices-content-section');
    if (practicesContent) {
      practicesContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      {/* Sección Header de Prácticas - PRIMERA */}
      <PracticesHeader onScrollToPractices={scrollToPractices} />

      {/* Sección Sobre Nosotros - SEGUNDA */}
      <section id="about" style={{ padding: '4rem 2rem', background: '#f8f9fa', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 24px 0 rgba(255,0,0,0.10)', borderTop: '6px solid #ff0000', borderRadius: '0 0 32px 32px' }}>
        <div style={{ maxWidth: '1200px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#ff0000', textShadow: '0 2px 12px rgba(255,0,0,0.15)' }}>Quiénes Somos</h2>
          <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.6' }}>
            Bienvenido a nuestro semillero de investigación. Somos un grupo dedicado a la innovación y el desarrollo tecnológico de la Universidad Piloto de Colombia, bajo la rama IEEE Student Branch.
          </p>
        </div>
      </section>

      {/* Sección Prácticas - TERCERA */}
      <section id="practices">
        <PracticesSection />
      </section>

    </div>
  )
}
