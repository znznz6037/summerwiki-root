import './index.css'
import { useEffect, useState, useCallback } from 'react';
import { getCategories, getNotes, getUserInfo} from './api/axios'; 
import Header from './components/layout/Header';
import SideBar from './components/layout/SideBar';
import Footer from './components/layout/Footer';
import RecentNotes from './components/pages/RecentNotes';
import NoteDetail from './components/pages/NoteDetail';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';
import MyPage from './components/pages/MyPage';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
  const { token, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  //const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));
  const isLoggedIn = !!token;
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split('/'); 
  const currentNoteId = pathParts[1] === 'notes' && pathParts[2] 
    ? parseInt(pathParts[2]) 
    : null;
  const fetchData = useCallback(async () => {
    try {
      const [noteRes, catRes] = await Promise.all([getNotes(), getCategories()]);
      setNotes(noteRes.data.data);
      setCategories(catRes.data.data);
    } catch (error) {
      console.error("Data Loading Failed:", error);
    }
  }, []);

  const fetchUserInfo = useCallback(async () => {
    try {
      const res = await getUserInfo();
      setUser(res.data);
      //setIsLoggedIn(true);
    } catch (error) {
      console.error("Unauthorized or User Info Loading Failed:", error);
      setUser(null);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    //fetchData();
    if(isLoggedIn) {
      fetchUserInfo();
      fetchData();
    } else {
      setUser(null);
      setNotes([]);
      setCategories([]);
    }
  }, [isLoggedIn, fetchUserInfo, fetchData]);

  return (
    <div className="flex flex-col h-screen w-screen bg-white overflow-hidden text-gray-900 font-sans">
      <Header user={user} />
      <div className="flex flex-row flex-1 w-full overflow-hidden">
        <SideBar 
                isSidebarOpen={isSidebarOpen} 
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                categories={categories} 
                notes={notes}
                onnoteClick={(noteId) => navigate(`/notes/${noteId}`)}
                selectednoteId={currentNoteId}
                refreshData={fetchData} 
        />
        {/* 메인 위키 레이아웃 */}
        <main className="flex-1 overflow-y-auto bg-[#FBFBFB] relative">
          <div className="max-w-5xl h-full px-8 py-10">
            <Routes>
              <Route path="/" element={
              isLoggedIn ? <RecentNotes notes={notes} onnoteClick={(id) => navigate(`/notes/${id}`)} /> 
                         : <div className="py-10 text-gray-500">로그인이 필요합니다.</div>
              } />
              <Route path="/notes/:id" element={<NoteDetail onBack={() => navigate('/')} onUpdate={fetchData} />} />
              <Route path="/mypage" element={isLoggedIn ? <MyPage user={user} /> : <Navigate to="/login" />} />
              <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
              <Route path="/oauth2/authorization/google" element={null} />
            </Routes>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;