import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import PracticeDetailPage from './pages/PracticeDetailPage'
import ProfilePage from './pages/ProfilePage'
import ProgressPage from './pages/ProgressPage'
import ScrollToTop from './components/ScrollToTop'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import UsersManagement from './pages/admin/UsersManagement'
import CoursesManagement from './pages/admin/CoursesManagement'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Admin Routes - No Header/Footer */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="courses" element={<CoursesManagement />} />
        </Route>

        {/* Public Routes - With Header/Footer */}
        <Route path="*" element={
          <>
            <Header />
            <main className="page">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/practice/:id" element={<PracticeDetailPage />} />
                <Route path="/perfil" element={<ProfilePage />} />
                <Route path="/progreso" element={<ProgressPage />} />
              </Routes>
            </main>
            <Footer />
            <ScrollToTop />
          </>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default App
