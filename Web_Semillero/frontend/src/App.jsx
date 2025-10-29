import Header from './components/Header'
import HomePage from './pages/HomePage'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Header />
      <main className="page">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Próximas páginas: <Route path="/perfil" element={<ProfilePage />} /> */}
        </Routes>
      </main>
    </>
  )
}

export default App
