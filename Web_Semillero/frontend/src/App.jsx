import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import PracticeDetailPage from './pages/PracticeDetailPage'
import ScrollToTop from './components/ScrollToTop'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Header />
      <main className="page">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/practice/:id" element={<PracticeDetailPage />} />
          {/* Próximas páginas: <Route path="/perfil" element={<ProfilePage />} /> */}
        </Routes>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}

export default App
