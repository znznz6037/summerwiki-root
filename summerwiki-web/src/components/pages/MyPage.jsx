const MyPage = () => {
    
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        window.location.href = "/";
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#FBFBFB]">
            <div className="bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 max-w-sm w-full">
                <h2 className="text-2xl font-bold mb-6 text-jannabi-green">마이페이지</h2>
                <div className="space-y-4 mb-8">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-xs text-gray-400 mb-1">상태</p>
                        <p className="font-semibold">로그인 중 (구글 계정)</p>
                    </div>
                </div>
                <button 
                    onClick={handleLogout}
                    className="w-full py-3 bg-red-50 text-red-500 rounded-xl font-medium hover:bg-red-100 transition-all"
                >
                    로그아웃
                </button>
            </div>
        </div>
    );
};
export default MyPage;