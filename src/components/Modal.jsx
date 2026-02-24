export default function Modal({ isOpen, onClose, title, children, isDraftMode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-500 overflow-y-auto max-h-[94vh]">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight truncate">{title}</h2>
          <button 
            onClick={onClose} 
            className="bg-gray-100 text-gray-500 w-8 h-8 rounded-full flex items-center justify-center active:bg-gray-200 transition-colors"
          >
            {/* Das Apple-typische Schließen-Symbol (X) */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}