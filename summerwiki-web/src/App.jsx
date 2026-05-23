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
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobileSearchBarOpen, setIsMobileSearchBarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isLoggedIn = !!token;
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split('/'); 
  const currentNoteId = pathParts[1] === 'notes' && pathParts[2] ? parseInt(pathParts[2]) : null;
  
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
    } catch (error) {
      console.error("Unauthorized or User Info Loading Failed:", error);
      setUser(null);
      logout();
    }
  }, [logout]);

  // 사용자가 브라우저 창 크기를 리사이즈하거나 디바이스를 회전할 때 대응
  useEffect(() => {
    const handleResize = () => {
      // 데스크톱 크기로 늘어나면 사이드바를 열어주고, 모바일 크기로 줄어들면 일단 닫아줍니다.
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const initializeAppData = async () => {
      if(isLoggedIn) {
        fetchUserInfo();
        fetchData();
      } else {
        setUser(null);
        setNotes([]);
        setCategories([]);
      }
    }

    initializeAppData();

  }, [isLoggedIn, fetchUserInfo, fetchData]);

  return (
    <div className="flex flex-col h-screen w-screen bg-white overflow-hidden text-gray-900 font-sans">
      {isSidebarOpen && !isMobileSearchBarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} // 외부 영역 터치 시 사이드바 닫기
          className="fixed inset-0 z-30 md:hidden animate-in fade-in duration-200"
        />
      )}
      <Header 
        user={user}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        isMobileSearchBarOpen={isMobileSearchBarOpen}
        setIsMobileSearchBarOpen={setIsMobileSearchBarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-col md:flex-row flex-1 w-full overflow-hidden relative">
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
        <main className="flex-1 overflow-y-auto bg-[#FBFBFB] relative w-full">
          <div className="max-w-full min-h-full md:mb-4 md:px-1 md:py-1 mx-auto">
            <Routes>
              <Route path="/" element={
              isLoggedIn ? <div/> 
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
      <div className="block">
        <Footer />
      </div>
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