import { useState, useEffect } from 'react';
import EntryCard from './components/EntryCard';
import Modal from './components/Modal';

function App() {
  // Initialisierung direkt aus dem LocalStorage für sofortige Verfügbarkeit beim Refresh
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('diary-entries');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', image: '', content: '', id: null, isDraft: false });
  
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Speichern bei jeder Änderung der Entries
  useEffect(() => {
    localStorage.setItem('diary-entries', JSON.stringify(entries));
  }, [entries]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const setTodayDate = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({ ...formData, date: today });
  };

  // Reguläres Speichern (Finalisieren)
  const saveEntry = () => {
    if (!formData.title || !formData.date || !formData.content) {
      alert("Please fill in all required fields!");
      return;
    }

    const finalData = { ...formData, isDraft: false };

    if (isEditing) {
      setEntries(entries.map(en => en.id === formData.id ? finalData : en));
    } else {
      const newEntry = { 
        ...finalData, 
        id: Date.now(), 
        image: formData.image || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=500' 
      };
      setEntries([newEntry, ...entries]);
    }
    forceClose();
  };

  // Als Entwurf speichern und schließen (Wird durch das X-Symbol ausgelöst)
  const handleDiscardAsDraft = () => {
    // Nur speichern, wenn zumindest ein Titel oder Inhalt vorhanden ist
    if (formData.title || formData.content) {
      const draftData = { 
        ...formData, 
        isDraft: true, 
        id: formData.id || Date.now(),
        date: formData.date || new Date().toISOString().split('T')[0],
        image: formData.image || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=500'
      };

      if (isEditing || entries.some(e => e.id === formData.id)) {
        setEntries(entries.map(en => en.id === draftData.id ? draftData : en));
      } else {
        setEntries([draftData, ...entries]);
      }
    }
    forceClose();
  };

  const forceClose = () => {
    setIsAddModalOpen(false);
    setIsEditing(false);
    setSelectedEntry(null);
    setFormData({ title: '', date: '', image: '', content: '', id: null, isDraft: false });
  };

  const deleteSingle = (id) => {
    if (window.confirm("Delete this entry?")) {
      setEntries(entries.filter(e => e.id !== id));
      if (selectedEntry?.id === id) setSelectedEntry(null);
    }
  };

  const sortedEntries = [...entries].sort((a, b) => {
    if (b.date !== a.date) return new Date(b.date) - new Date(a.date);
    return b.id - a.id;
  });

  return (
    <div className="min-h-screen bg-[#F2F2F7] font-sans text-black pb-32">
      <header className="px-5 pt-14 pb-4 bg-[#F2F2F7]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight">Max's Diary</h1>
            <p className="mt-1 text-[15px] text-gray-500 leading-tight max-w-[280px]">
  Capture your most beautiful moments and keep your memories forever.
</p>
          </div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => { setIsSelectMode(!isSelectMode); setSelectedIds([]); }}
              className="text-[#007AFF] font-medium text-lg"
            >
              {isSelectMode ? 'Cancel' : 'Edit'}
            </button>
            {!isSelectMode && (
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#007AFF] text-white w-9 h-9 rounded-full flex items-center justify-center shadow-md active:scale-90"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="px-5 mt-4 max-w-lg mx-auto space-y-3">
        {sortedEntries.map((entry) => (
          <div key={entry.id} className="relative flex items-center gap-3">
            {isSelectMode && (
              <div 
                onClick={() => setSelectedIds(prev => prev.includes(entry.id) ? prev.filter(i => i !== entry.id) : [...prev, entry.id])}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedIds.includes(entry.id) ? 'bg-[#007AFF] border-[#007AFF]' : 'border-gray-300'}`}
              >
                {selectedIds.includes(entry.id) && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
              </div>
            )}
            <div className="flex-1">
              <EntryCard 
                entry={entry} 
                onClick={isSelectMode ? () => setSelectedIds(prev => prev.includes(entry.id) ? prev.filter(i => i !== entry.id) : [...prev, entry.id]) : (e) => {
                  if (e.isDraft) { setFormData(e); setIsEditing(true); setIsAddModalOpen(true); }
                  else { setSelectedEntry(e); }
                }} 
                onDelete={() => deleteSingle(entry.id)}
                showDelete={!isSelectMode}
              />
            </div>
          </div>
        ))}
      </main>

      {/* Form Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={handleDiscardAsDraft} // Hier wird das X-Symbol zum Draft-Speicher
        title={isEditing ? "Edit Entry" : "New Entry"}
        isDraftMode={true}
      >
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-2xl p-1">
            <input type="text" placeholder="Title" className="w-full bg-transparent p-3 outline-none font-medium text-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <div className="h-[0.5px] bg-gray-300 mx-3"></div>
            <div className="flex items-center pr-3">
              <input type="date" className="flex-1 bg-transparent p-3 outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              <button onClick={setTodayDate} className="text-[#007AFF] text-sm font-bold bg-white px-3 py-1 rounded-lg shadow-sm">Today</button>
            </div>
          </div>
          
          <div className="bg-gray-100 rounded-2xl p-6 border-2 border-dashed border-gray-300 flex flex-col items-center">
            {formData.image ? (
              <div className="relative w-full">
                <img src={formData.image} className="w-full h-48 object-cover rounded-xl" alt="Preview" />
                <button type="button" onClick={() => setFormData({...formData, image: ''})} className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full w-7 h-7 flex items-center justify-center border-2 border-white">✕</button>
              </div>
            ) : (
              <label className="flex flex-col items-center cursor-pointer py-4 text-[#007AFF]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                <span className="font-semibold">Upload Picture</span>
                <span className="text-xs text-gray-400 mt-1 italic">Optional</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>
          
          <textarea placeholder="Write your thoughts..." className="w-full bg-gray-100 p-4 rounded-2xl h-48 outline-none resize-none" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
          
          <button onClick={saveEntry} className="w-full bg-[#007AFF] text-white py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-[0.98] transition-transform">
            {isEditing ? "Update Entry" : "Save Entry"}
          </button>
        </div>
      </Modal>

      {/* Detail View */}
      <Modal isOpen={!!selectedEntry} onClose={() => setSelectedEntry(null)} title={selectedEntry?.title}>
        {selectedEntry && (
          <div className="space-y-5 pb-10">
            <img src={selectedEntry.image} alt="" className="w-full aspect-[4/3] object-cover rounded-3xl shadow-sm" />
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-2xl">
              <span className="text-gray-500 font-medium">{new Date(selectedEntry.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <div className="flex gap-2">
                <button onClick={() => { setFormData(selectedEntry); setIsEditing(true); setIsAddModalOpen(true); setSelectedEntry(null); }} className="p-2 bg-white text-[#007AFF] rounded-full shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button onClick={() => deleteSingle(selectedEntry.id)} className="p-2 bg-white text-red-500 rounded-full shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>
            <p className="text-xl leading-relaxed text-gray-800 px-1">{selectedEntry.content}</p>
          </div>
        )}
      </Modal>
    {/* Bulk Delete Toolbar */}
      {isSelectMode && (
        <div className="fixed bottom-10 left-0 right-0 flex justify-center z-50 px-5 animate-in slide-in-from-bottom-5">
          <button 
            disabled={selectedIds.length === 0}
            onClick={() => {
              if (window.confirm(`Delete ${selectedIds.length} items?`)) {
                setEntries(entries.filter(e => !selectedIds.includes(e.id)));
                setSelectedIds([]);
                setIsSelectMode(false);
              }
            }}
            className="w-full max-w-xs bg-white/90 backdrop-blur-md text-red-500 py-4 rounded-2xl shadow-2xl font-bold border border-red-100 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-30"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            Delete {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
          </button>
        </div>// Feature: Apple-Style Diary Logic implemented
      )}
    </div>
  );
}

export default App;