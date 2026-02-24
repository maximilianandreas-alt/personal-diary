export default function EntryCard({ entry, onClick, onDelete, showDelete }) {
  const dateObj = new Date(entry.date);
  
  return (
    <div 
      className="bg-white rounded-[24px] shadow-sm overflow-hidden flex items-center p-3 gap-4 border border-gray-50 w-full group relative active:scale-[0.99] transition-transform"
    >
      {/* Klickbare Fläche für Details */}
      <div onClick={() => onClick(entry)} className="flex flex-1 items-center gap-4 cursor-pointer min-w-0">
        <img src={entry.image} alt="" className="w-20 h-20 rounded-[18px] object-cover bg-gray-50 shrink-0" />
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[#007AFF] text-[10px] font-bold uppercase tracking-tight">
            {dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
          </p>
          <h3 className="text-lg font-bold text-gray-900 truncate leading-tight">{entry.title}</h3>
          <p className="text-gray-400 text-sm truncate">{entry.content}</p>
        </div>
      </div>

      {/* Direkt-Löschen Button */}
      {showDelete && (
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Verhindert, dass das Modal aufgeht
            onDelete();
          }}
          className="p-2 text-gray-300 hover:text-red-500 transition-colors"
          title="Delete entry"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
        </button>
      )}
    </div>
  );
}