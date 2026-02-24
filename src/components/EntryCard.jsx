export default function EntryCard({ entry, onClick, onDelete, showDelete }) {
  const dateObj = new Date(entry.date);
  
  return (
    <div className="bg-white rounded-[24px] shadow-sm overflow-hidden flex items-center p-3 gap-4 border border-gray-50 w-full relative active:scale-[0.99] transition-transform">
      <div onClick={() => onClick(entry)} className="flex flex-1 items-center gap-4 cursor-pointer min-w-0">
        <div className="relative shrink-0">
          <img src={entry.image} alt="" className="w-20 h-20 rounded-[18px] object-cover bg-gray-50" />
          {entry.isDraft && (
            <div className="absolute -top-1 -left-1 bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-md">
              DRAFT
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2">
            <p className="text-[#007AFF] text-[10px] font-bold uppercase tracking-tight">
              {dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
            </p>
            {entry.isDraft && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>}
          </div>
          <h3 className={`text-lg font-bold truncate leading-tight ${entry.isDraft ? 'text-gray-500 italic' : 'text-gray-900'}`}>
            {entry.title || "Untitled Draft"}
          </h3>
          <p className="text-gray-400 text-sm truncate">{entry.content || "No content yet..."}</p>
        </div>
      </div>

      {showDelete && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-2 text-gray-300 hover:text-red-500 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
        </button>
      )}
    </div>
  );
}