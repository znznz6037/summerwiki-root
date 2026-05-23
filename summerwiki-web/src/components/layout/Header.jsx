import { useState, useRef, useEffect } from 'react';
import { User, BookOpenText, Search, LogOut, Settings, Menu, X} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchNotes } from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';

function Header({ user, isSearchOpen, setIsSearchOpen, isMobileSearchBarOpen, setIsMobileSearchBarOpen, onToggleSidebar }) {
    const navigate = useNavigate();
    const { token, logout } = useAuth();

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    
    const profileMenuRef = useRef(null);
    const searchRef = useRef(null);
    const timerRef = useRef(null);
    const mobileSearchRef = useRef(null);

    const GOOGLE_AUTH_URL = "/oauth2/authorization/google";
    
    const isLoggedIn = !!token;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) setIsProfileMenuOpen(false);
            if (searchRef.current && !searchRef.current.contains(event.target)) setIsSearchOpen(false);

            if (
                mobileSearchRef.current && 
                !mobileSearchRef.current.contains(event.target)
                //&& !event.target.closest('button Hong') // 아래 검색 버튼에 매핑할 식별자용 혹은 단순 제외 처리
            ) {
                const isToggleButton = event.target.closest('.mobile-search-toggle');
                if (!isToggleButton) {
                    setIsMobileSearchBarOpen(false);
                    setIsSearchOpen(false);
                    setSearchQuery("");
                }
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(async () => {
            if (value.trim()) {
                try {
                    const res = await searchNotes(value);
                    const result = res.data.data;
                    setSearchResults(result || []);
                    setIsSearchOpen(result?.length > 0);
                } catch (error) {
                    console.error("검색 실패:", error);
                }
            } else {
                setSearchResults([]);
                setIsSearchOpen(false);
            }
        }, 300);
    };

    const handleGoogleLogin = () => window.location.href = GOOGLE_AUTH_URL;

    const handleLogoutClick = () => {
        setIsProfileMenuOpen(false);
        logout();
    };

    return (
        <header className="h-16 w-full bg-white border-b border-gray-100 pr-6 pl-0 md:px-6 z-50 flex flex-row items-center justify-between shrink-0 relative">
            <div className="flex flex-row items-center gap-1 md:gap-2">
                {/* 모바일 전용 사이드바 토글 버튼 */}
                <button 
                    onClick={onToggleSidebar}
                    className="p-1 hover:bg-gray-50 rounded-xl text-gray-500 md:hidden transition-all min-w-10 h-10 flex items-center justify-center active:scale-95 focus:outline-none"
                    aria-label="Toggle Sidebar"
                >
                    <Menu size={20} />
                </button>

                <div className="flex flex-row items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                    <div className="flex items-center justify-center p-2 bg-jannabi-green rounded-lg text-white shadow-sm shadow-jannabi-green/20 group-hover:scale-105 transition-transform">
                        <BookOpenText size={20} className="md:w-5.5 md:h-5.5" />
                    </div>
                    <h1 className="md:text-xl font-bold tracking-tight text-jannabi-green">SummerWiki</h1>
                </div>
            </div>
            
            <div className="flex flex-row items-center gap-2 md:gap-4">
                {/* 검색 바 */}
                <div className="relative group hidden md:block" ref={searchRef}>
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-jannabi-green transition-colors" />
                    <input 
                        type="text"
                        placeholder="문서 검색..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="pl-9 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl text-sm w-64 focus:bg-white focus:border-jannabi-green/30 focus:ring-4 focus:ring-jannabi-green/5 outline-none transition-all"
                    />
                    {/* 검색 결과 드롭다운 */}
                    {isSearchOpen && (
                        <div className="absolute top-12 left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-200 max-h-80 overflow-y-auto">
                            {searchResults.map((note) => (
                                <button
                                    key={note.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/notes/${note.id}`);
                                        setIsSearchOpen(false);
                                        setSearchQuery("");
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-jannabi-bg/30 transition-colors"
                                >
                                    <div className="text-sm font-bold text-gray-800">{note.title}</div>
                                    <div className="text-xs text-gray-400 truncate mt-0.5 line-clamp-1">{note.content}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* [모바일용] 검색 돋보기 토글 버튼 */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMobileSearchBarOpen(!isMobileSearchBarOpen)}
                    }
                    className="mobile-search-toggle p-2 hover:bg-gray-50 rounded-xl text-gray-500 md:hidden transition-all min-w-10 h-10 flex items-center justify-center"
                >
                    <Search size={20} />
                </button>

                {/* 프로필 섹션 */}
                {isLoggedIn && user?.data ? (
                    <div className="flex items-center gap-3 relative" ref={profileMenuRef}>
                        <button 
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} 
                            className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center hover:ring-2 hover:ring-jannabi-green/30 transition-all shadow-sm active:scale-95"
                        >
                            {user.data.picture ? (
                                <img src={user.data.picture} alt="profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={20} className="text-gray-400" />
                            )}
                        </button>
                        <span className="text-sm font-semibold text-gray-700 hidden sm:block">{user.data.name}님</span>

                        {isProfileMenuOpen && (
                            <div className="absolute right-0 top-12 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">내 계정</p>
                                    <p className="text-sm font-bold text-gray-800 truncate">{user.data.email}</p>
                                </div>
                                <button 
                                    onClick={() => { navigate('/mypage'); setIsProfileMenuOpen(false); }} 
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-jannabi-bg/50 flex items-center gap-2 transition-colors"
                                >
                                    <Settings size={16} /> 내 정보 관리
                                </button>
                                <button 
                                    onClick={handleLogoutClick} 
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                >
                                    <LogOut size={16} /> 로그아웃
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button 
                        onClick={handleGoogleLogin} 
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
                        Google 로그인
                    </button>
                )}
            </div>

            {/* [모바일 전용] 확장 검색바 드롭다운 패널 */}
            {isMobileSearchBarOpen && (
                <div 
                    ref={mobileSearchRef}
                    className="absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-md p-3 z-40 md:hidden animate-in slide-in-from-top duration-150"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="문서 검색..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="pl-9 pr-10 py-2 bg-gray-50 border border-gray-200/60 rounded-xl text-sm w-full outline-none focus:bg-white focus:border-jannabi-green/30"
                        />
                        {searchQuery && (
                            <button onClick={() => { setSearchQuery(""); setSearchResults([]); setIsSearchOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    {isSearchOpen && searchResults.length > 0 && (
                        <div className="mt-2 bg-white border border-gray-50 rounded-xl max-h-60 overflow-y-auto">
                            {searchResults.map((note) => (
                                <button
                                    key={note.id}
                                    onClick={() => {
                                        navigate(`/notes/${note.id}`);
                                        setIsMobileSearchBarOpen(false);
                                        setIsSearchOpen(false);
                                        setSearchQuery("");
                                    }}
                                    className="w-full text-left px-3 py-2.5 border-b border-gray-50 last:border-b-0 active:bg-gray-50"
                                >
                                    <div className="text-sm font-bold text-gray-800">{note.title}</div>
                                    <div className="text-xs text-gray-400 truncate line-clamp-1">{note.content}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}

export default Header;