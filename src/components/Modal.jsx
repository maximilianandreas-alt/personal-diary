export default function Modal({ isOpen, onClose, onDone, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose}></div>
      
      {/* Sheet */}
      <div className="relative bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-500 overflow-y-auto max-h-[94vh]">
        {/* iOS Grabber */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight truncate pr-4">{title}</h2>
          <button 
            onClick={onDone || onClose} 
            className="bg-gray-100 text-[#007AFF] px-4 py-1.5 rounded-full text-sm font-bold active:bg-gray-200 shrink-0"
          >
            Done
          </button>
        </div>
        
        {children}
      </div>
    </div>
  );
}