import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Hash, Plus, Edit2, Trash2, Menu, X } from 'lucide-react';
import { createCategory, updateCategory, deleteCategory, createNote, updateNote, deleteNote } from '../../api/axios'; 

function SideBar({ isSidebarOpen, onToggleSidebar,categories, notes, onnoteClick, selectednoteId, refreshData }) {
  const [menuPos, setMenuPos] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY, type: 'none', id: null });
  };

  useEffect(() => {
    const handleClick = () => setMenuPos(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleSave = async (name, parentId, type, mode, targetId) => {
    try {
      if (type === 'category') {
        if (mode === 'create') await createCategory(name, parentId);
        else if (mode === 'edit') await updateCategory(targetId, name);
      } 
      else if (type === 'note') {
        if (mode === 'create') await createNote(name, parentId);
        else if (mode === 'edit') {
          await updateNote(targetId, name, "", parentId); 
        }
      }

      if (refreshData) await refreshData();
    } catch (error) {
      console.error("API Error:", error);
      alert("처리에 실패했습니다.");
    } finally {
      setEditingItem(null);
    }
  };

  const handleDelete = async (type, id) => {
    const msg = type === 'category' ? "카테고리를 삭제하시겠습니까?" : "노트를 삭제하시겠습니까?";
    if (!confirm(msg)) return;

    try {
      if (type === 'category') await deleteCategory(id);
      else await deleteNote(id);
      if (refreshData) await refreshData();
    } catch (error) {
      alert(error);
    } finally {
      setMenuPos(null);
    }
  };

return (
    <>
      <aside 
        onContextMenu={handleContextMenu} 
        className={`
          bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out
          fixed md:relative top-16 md:top-0 left-0 z-40 md:z-auto h-[calc(100vh-64px)] md:h-full shadow-xl md:shadow-none
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full md:translate-x-0'}
        `}
      >
        <div className="w-full h-full flex flex-col overflow-hidden">
          
          {/* 1. 상단: 토글 버튼 영역 (고정) */}
          <div className={`flex items-center py-6 px-4 shrink-0 ${isSidebarOpen ? 'justify-between px-6' : 'justify-center'}`}>
            {isSidebarOpen && (
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] animate-in fade-in duration-500">
                Categories
              </h2>
            )}
            <button 
              onClick={onToggleSidebar}
              className="p-2 hover:bg-jannabi-bg rounded-lg text-gray-400 hover:text-jannabi-green transition-colors"
            >
              {/* 모바일 화면이고 사이드바가 열려있으면 X 아이콘으로 교체출력하여 가독성 업 */}
              {isSidebarOpen ? (
                <>
                  {/* 사이드바가 열려있을 때: 모바일에서는 X, PC에서는 Menu 아이콘 표시 */}
                  <X size={20} className="md:hidden" />
                  <Menu size={20} className="hidden md:block" />
                </>
              ) : (
                <>
                  {/* 사이드바가 닫혀있을 때: 모바일과 PC 모두 Menu 아이콘 1개만 표시 */}
                  <Menu size={20} />
                </>
              )}
            </button>
          </div>

          {/* 2. 본문: 카테고리 목록 (스크롤 영역) */}
          <div className={`flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <nav className="space-y-0.5">
              {/* 루트 카테고리 생성창 */}
              {editingItem?.mode === 'create' && editingItem.parentId === null && editingItem.type === 'category' && (
                <InlineInput onSave={(name) => handleSave(name, null, 'category', 'create')} onCancel={() => setEditingItem(null)} />
              )}
              
              {/* 카테고리 리스트 */}
              {categories?.map((category) => (
                <CategoryItem 
                  key={category.id} item={category} level={0} allnotes={notes} onnoteClick={onnoteClick}
                  setMenuPos={setMenuPos} selectednoteId={selectednoteId} editingItem={editingItem}
                  setEditingItem={setEditingItem} handleSave={handleSave} onToggleSidebar={onToggleSidebar}
                />
              ))}
            </nav>
          </div>
        </div>

        {menuPos && (
          <ContextMenu 
            pos={menuPos} 
            onAddCategory={(id) => { setEditingItem({ mode: 'create', type: 'category', parentId: id }); setMenuPos(null); }}
            onEditCategory={(id) => { setEditingItem({ mode: 'edit', type: 'category', targetId: id }); setMenuPos(null); }}
            onDeleteCategory={(id) => handleDelete('category', id)}
            onAddnote={(id) => { setEditingItem({ mode: 'create', type: 'note', parentId: id }); setMenuPos(null); }}
            onEditnote={(id) => { setEditingItem({ mode: 'edit', type: 'note', targetId: id }); setMenuPos(null); }}
            onDeletenote={(id) => handleDelete('note', id)}
          />
        )}
      </aside>
    </>
  );
}

// InlineInput, CategoryItem, ContextMenu 컴포넌트는 기존 코드 유지 (전달받는 props는 SideBar에서 이미 맞춤)
// ... [기존 하단 컴포넌트 코드들] ...

// ⌨️ 인라인 입력 컴포넌트
function InlineInput({ level = 0, initialValue = '', onSave, onCancel, isNote = false }) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div className="px-2 py-1" style={{ paddingLeft: `${level * 12 + 8}px` }}>
      <div className="flex items-center gap-2 bg-gray-50 border border-jannabi-green/20 rounded-lg px-2 py-1 shadow-inner">
        {isNote ? <Hash size={13} className="text-gray-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-jannabi-green/40" />}
        <input
          ref={inputRef}
          className="bg-transparent border-none outline-none text-[13px] w-full text-gray-700"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave(value);
            if (e.key === 'Escape') onCancel();
          }}
          onBlur={() => !value ? onCancel() : onSave(value)}
          placeholder={isNote ? "노트 이름..." : "카테고리 이름..."}
        />
      </div>
    </div>
  );
}

function CategoryItem({ item, level, allnotes, onnoteClick, setMenuPos, selectednoteId, editingItem, setEditingItem, handleSave, onToggleSidebar }) {
  // [함수] 내 하위 어딘가에 선택된 노트가 있는지 재귀적으로 확인
  const checkHasSelectedChild = (category) => {
    // 1. 현재 카테고리에 선택된 노트가 있는지 확인
    const hasDirectNote = allnotes?.some(
      (n) => Number(n.categoryId) === Number(category.id) && Number(n.id) === Number(selectednoteId)
    );
    if (hasDirectNote) return true;

    // 2. 자식 카테고리들 중에 선택된 요소가 있는지 확인 (재귀)
    if (category.children && category.children.length > 0) {
      return category.children.some((child) => checkHasSelectedChild(child));
    }

    return false;
  };

  const shouldBeExpanded = checkHasSelectedChild(item);
  const [isExpanded, setIsExpanded] = useState(shouldBeExpanded);

  useEffect(() => {
    const shouldExpanded = async () => {
      if (shouldBeExpanded || editingItem?.parentId === item.id) {
        setIsExpanded(true);
      }
    };

    shouldExpanded();
    
  }, [shouldBeExpanded, editingItem, item.id]);
  
  const childCategories = item.children || [];
  const relatednotes = allnotes?.filter(note => Number(note.categoryId) === Number(item.id)) || [];
  const hasAnything = childCategories.length > 0 || relatednotes.length > 0;

  // 생성 시 자동 펼침
  useEffect(() => {
    const setExpanded = async () => {
      if (editingItem?.parentId === item.id) setIsExpanded(true);
    }
    
    setExpanded();

  }, [editingItem, item.id]);

  // 카테고리 본인이 수정 중인지 확인
  if (editingItem?.mode === 'edit' && editingItem.type === 'category' && editingItem.targetId === item.id) {
    return <InlineInput level={level} initialValue={item.name} onSave={(val) => handleSave(val, null, 'category', 'edit', item.id)} onCancel={() => setEditingItem(null)} />;
  }

  return (
    <div className="flex flex-col">
      <button 
        onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setMenuPos({ x: e.clientX, y: e.clientY, type: 'category', id: item.id }); }}
        onClick={() => hasAnything && setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-all group w-full text-left ${hasAnything ? 'hover:bg-jannabi-bg/70 text-gray-600 hover:text-jannabi-green cursor-pointer' : 'text-gray-400'}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {hasAnything && (
            <span className="shrink-0 w-4 inline-flex justify-center">
                {isExpanded ? <ChevronDown size={14} className="text-jannabi-green/80" /> : <ChevronRight size={14} className="text-gray-300 group-hover:text-jannabi-green/80" />}
            </span>
        )}
        <span className="truncate font-medium">{item.name}</span>
      </button>

      {isExpanded && (
        <div className="flex flex-col mt-0.5">
          {/* 2. 하위 노트 생성창 */}
          {editingItem?.mode === 'create' && editingItem.parentId === item.id && editingItem.type === 'note' && (
            <InlineInput level={level + 1} isNote onSave={(val) => handleSave(val, item.id, 'note', 'create')} onCancel={() => setEditingItem(null)} />
          )}

          {relatednotes.map((note) => (
             editingItem?.mode === 'edit' && editingItem.type === 'note' && editingItem.targetId === note.id ? (
                <InlineInput key={note.id} level={level + 1} isNote initialValue={note.title} onSave={(val) => handleSave(val, item.id, 'note', 'edit', note.id)} onCancel={() => setEditingItem(null)} />
             ) : (
                <button
                  key={note.id}
                  onClick={() => { 
                    onnoteClick(note.id); 
                    if (window.innerWidth < 768) {
                        onToggleSidebar();
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMenuPos({ x: e.clientX, y: e.clientY, type: 'note', id: note.id });
                  }}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[13px] transition-all w-full text-left group ${Number(selectednoteId) === Number(note.id) ? 'bg-jannabi-bg text-jannabi-green font-bold ring-1 ring-jannabi-green/10' : 'text-gray-500 hover:bg-gray-50 hover:text-jannabi-green'}`}
                  style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}>
                    <span className="shrink-0 w-4 inline-flex justify-center">
                      <Hash size={13} className={Number(selectednoteId) === Number(note.id) ? 'text-jannabi-green' : 'text-gray-300'} />
                    </span>
                    <span className="truncate">{note.title}</span>
                </button>
             )
          ))}

          {/* 3. 하위 카테고리 생성창 */}
          {editingItem?.mode === 'create' && editingItem.parentId === item.id && editingItem.type === 'category' && (
            <InlineInput level={level + 1} onSave={(name) => handleSave(name, item.id, 'category', 'create')} onCancel={() => setEditingItem(null)} />
          )}

          {childCategories.map((child) => (
            <CategoryItem key={child.id} item={child} level={level + 1} allnotes={allnotes} onnoteClick={onnoteClick} setMenuPos={setMenuPos} selectednoteId={selectednoteId} editingItem={editingItem} setEditingItem={setEditingItem} handleSave={handleSave} onToggleSidebar={onToggleSidebar} />
          ))}
        </div>
      )}
    </div>
  );
}

function ContextMenu({ pos, onAddCategory, onEditCategory, onDeleteCategory, onAddnote, onEditnote, onDeletenote }) {
  const isCategory = pos.type === 'category';
  const isnote = pos.type === 'note';
  const isNone = pos.type === 'none';
  const menuItemClass = "w-full px-4 py-2 text-left hover:bg-jannabi-bg hover:text-jannabi-green flex items-center gap-2.5 transition-colors text-gray-600 whitespace-nowrap overflow-hidden";

  return (
    <div className="fixed z-50 bg-white/95 backdrop-blur-md border border-gray-100 shadow-2xl shadow-gray-200/50 rounded-xl py-1.5 w-48 text-[13px] animate-in fade-in zoom-in-95 duration-150" style={{ top: pos.y, left: pos.x }}>
      {(isCategory || isNone) && (
        <>
          <button onClick={() => onAddCategory(pos.id)} className={menuItemClass}><Plus size={14} /> <span>{isNone ? '루트 카테고리 생성' : '하위 카테고리 생성'}</span></button>
          {isCategory && (
            <>
              <button onClick={() => onEditCategory(pos.id)} className={menuItemClass}><Edit2 size={14} /> <span>카테고리 이름 변경</span></button>
              <button onClick={() => onDeleteCategory(pos.id)} className={`${menuItemClass} text-red-500 hover:bg-red-50`}><Trash2 size={14} /> <span>카테고리 삭제</span></button>
              <div className="my-1 border-t border-gray-50" />
              <button onClick={() => onAddnote(pos.id)} className={menuItemClass}><Plus size={14} /> <span>노트 생성</span></button>
            </>
          )}
        </>
      )}
      {isnote && (
        <>
          <button onClick={() => onEditnote(pos.id)} className={menuItemClass}><Edit2 size={14} /> <span>노트 제목 변경</span></button>
          <button onClick={() => onDeletenote(pos.id)} className={`${menuItemClass} text-red-500 hover:bg-red-50`}><Trash2 size={14} /> <span>노트 삭제</span></button>
        </>
      )}
    </div>
  );
}

export default SideBar;