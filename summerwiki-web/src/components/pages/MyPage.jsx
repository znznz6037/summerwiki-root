import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, ShieldCheck, LogOut } from 'lucide-react';

const MyPage = ({ user }) => {
    const { logout } = useAuth();

    const handleLogoutClick = () => {
        if (window.confirm("로그아웃 하시겠습니까?")) {
            logout();
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 max-w-md w-full border border-gray-50">
                <div className="flex flex-col items-center mb-8">
                    {/* 프로필 이미지 혹은 아이콘 */}
                    <div className="w-24 h-24 rounded-full bg-jannabi-bg flex items-center justify-center mb-4 border-4 border-white shadow-lg overflow-hidden">
                        {user?.data?.picture ? (
                            <img src={user.data.picture} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={40} className="text-jannabi-green" />
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{user?.data?.name || '사용자'}님</h2>
                    <p className="text-sm text-gray-400">SummerWiki 회원</p>
                </div>

                <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-jannabi-green/10 transition-colors">
                        <div className="p-2 bg-white rounded-xl shadow-sm text-jannabi-green">
                            <Mail size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">이메일 계정</p>
                            <p className="text-sm font-semibold text-gray-700">{user?.data?.email || '정보 없음'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-jannabi-green/10 transition-colors">
                        <div className="p-2 bg-white rounded-xl shadow-sm text-jannabi-green">
                            <ShieldCheck size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">인증 상태</p>
                            <p className="text-sm font-semibold text-gray-700">Google OAuth2 인증됨</p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleLogoutClick}
                    className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <LogOut size={18} />
                    로그아웃
                </button>
            </div>
        </div>
    );
};

export default MyPage;