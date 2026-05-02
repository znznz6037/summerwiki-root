function Recentnotes({ notes }) {
    return (
        <div className="max-w-2xl">
            <div className="bg-white p-10 rounded-2xl shadow-sm border">
              <h2 className="text-3xl font-bold mb-6">최근 수정된 문서</h2>
              {/* 노트 리스트 */}
              <div className="space-y-4">
                {notes.map(note => (
                  <div key={note.id} className="p-4 border rounded-lg">
                    {note.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
    );
}

export default Recentnotes;