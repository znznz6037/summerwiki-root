import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Edit3, Save, X, Eye, Bold, Italic, List, Link, CheckSquare, Quote, Code, Heading } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { getNote, updateNote, updateNoteViewCount } from '../../api/axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function NoteDetail({ onBack, onUpdate }) {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    const fetchNoteAndUpdateViewCount = async () => {
      setLoading(true);
      try {
        const res = await getNote(id); // API 호출
        const data = res.data.data;
        setNote(data);
        setEditContent(data.content || '');
        setEditTitle(data.title || '');

        // 중복 조회 체크
        const viewedNotes = JSON.parse(localStorage.getItem('viewedNotes') || '[]');
        if(!viewedNotes.includes(String(id))) {
          await updateNoteViewCount(id);
          viewedNotes.push(String(id));
          localStorage.setItem('viewedNotes', JSON.stringify(viewedNotes));
        }

      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoteAndUpdateViewCount();
  }, [id]); // id가 바뀔 때마다 상세 페이지 내용이 갱신됨

  if (loading) return <div className="p-10 text-center text-gray-500">데이터를 불러오는 중...</div>;
  if (!note) return <div className="p-10 text-center text-gray-500">노트를 찾을 수 없습니다.</div>;

  const insertText = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editContent.substring(start, end);
    const newText = editContent.substring(0, start) + before + selectedText + after + editContent.substring(end);
    setEditContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

    const toolbarButtons = [
    { icon: <Heading size={16} />, label: '제목', action: () => insertText('### ', '') },
    { icon: <Bold size={16} />, label: '굵게', action: () => insertText('**', '**') },
    { icon: <Italic size={16} />, label: '기울임', action: () => insertText('*', '*') },
    { icon: <Quote size={16} />, label: '인용구', action: () => insertText('> ', '') },
    { icon: <Code size={16} />, label: '코드', action: () => insertText('`', '`') },
    { icon: <Link size={16} />, label: '링크', action: () => insertText('[', '](url)') },
    { icon: <List size={16} />, label: '불렛 목록', action: () => insertText('- ', '') },
    { icon: <CheckSquare size={16} />, label: '체크박스', action: () => insertText('- [ ] ', '') },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '날짜 정보 없음';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false
    }).format(date);
  };

  const handleSave = async () => {
    try {
        const response = await updateNote(note.id, editTitle, editContent, note.categoryId);

        if (response.data?.data) {
            const updatedData = response.data.data;

            // 상세 페이지 갱신
            setNote(updatedData); 
            console.log(updatedData);
            setEditContent(updatedData.content);
            setEditTitle(updatedData.title);
            setIsEditing(false);

            // onUpdate를 호출하되, 상세 페이지인 이 컴포넌트가 다시 API를 찌르지 않도록 흐름 분리
            if (onUpdate) {
                await onUpdate();
            }
        }
    } catch (error) {
        console.error("업데이트 실패:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const { selectionStart, selectionEnd } = e.target;
      const tabChar = "    ";
      const newContent = 
        editContent.substring(0, selectionStart) + 
        tabChar + 
        editContent.substring(selectionEnd);
      
      setEditContent(newContent);

      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + tabChar.length;
      }, 0);
    }
  };

  const markdownComponents = {
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className="max-w-5xl">
      {/* 상단 컨트롤 바 */}
      <div className="sticky top-0 z-20 flex items-center justify-between py-4 mb-2 bg-[#FBFBFB]/80">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-jannabi-green transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">목록으로 돌아가기</span>
        </button>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X size={16} /> 취소
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-jannabi-green hover:bg-jannabi-green/90 rounded-xl shadow-sm transition-all"
              >
                <Save size={16} /> 저장하기
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-jannabi-green bg-jannabi-bg hover:bg-jannabi-green/10 rounded-xl transition-all"
            >
              <Edit3 size={16} /> 노트 수정
            </button>
          )}
        </div>
      </div>

      <article key={note.lastModifiedDate} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* 헤더 영역 */}
        <div className="p-8 border-b border-gray-50 bg-[#F8FDF9]">
          {isEditing ? (
            <input 
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-3xl font-bold text-gray-900 w-full bg-transparent border-b border-jannabi-green/20 focus:border-jannabi-green outline-none pb-2 mb-4"
              placeholder="제목을 입력하세요..."
            />
          ) : (
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{note.title}</h1>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5"><Calendar size={14} /><span>{formatDate(note.lastModifiedDate)}</span></div>
            <div className="flex items-center gap-1.5"><User size={14} /><span>{note.lastModifiedBy || '작성자'}</span></div>
            <div className="flex items-center gap-1.5"><Eye size={14} /><span>{note.viewCount}</span></div>
            <div className="flex items-center gap-1.5 bg-jannabi-bg/50 px-2 py-0.5 rounded-full border border-jannabi-green/10">
              <Tag size={13} className="text-jannabi-green" />
              <span className="text-jannabi-green font-medium text-xs">{note.categoryName || 'General'}</span>
            </div>
          </div>
        </div>

        {/* 본문/에디터 영역 */}
        <div className="p-8 leading-relaxed text-gray-700 min-h-[500px]">
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              {/* 왼쪽: 입력 창 */}
              <div className="flex flex-col gap-4">
                {/* 마크다운 툴바 */}
              <div className="flex flex-wrap items-center gap-1 p-1.5 bg-gray-50 border border-gray-100 rounded-2xl w-fit">
                {toolbarButtons.map((btn, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      btn.action();
                    }}
                    className="p-2 text-gray-500 hover:bg-white hover:text-jannabi-green hover:shadow-sm rounded-xl transition-all"
                    title={btn.label}
                  >
                    {btn.icon}
                  </button>
                ))}
              </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <Edit3 size={12} /> Markdown Editor
                </div>
                <textarea 
                  ref={textareaRef}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full h-[500px] p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-jannabi-green/10 outline-none resize-none font-mono text-sm"
                  placeholder="마크다운 형식으로 내용을 입력하세요..."
                />
              </div>
              {/* 오른쪽: 미리보기 */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-jannabi-green uppercase tracking-wider">
                  <Eye size={12} /> Live Preview
                </div>
                <div className="prose prose-sm md:prose-base max-w-none prose-green whitespace-pre-wrap">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    components={markdownComponents}
                  >
                    {editContent}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ) : (
            <div className="prose prose-slate md:prose-lg max-w-none prose-green whitespace-pre-wrap">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={markdownComponents}
            >
              {note.content || '내용이 없습니다.'}
            </ReactMarkdown>
          </div>
          )}
        </div>
      </article>
    </div>
  );
}

export default NoteDetail;