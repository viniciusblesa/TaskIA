import { LogOut } from "lucide-react";

const Sidebar = ({ onLogout }) => {
  return (
    <aside className="left-0 top-0 h-full w-sidebar-width bg-surface-container-low/90 backdrop-blur-xl border-r border-white/10 shadow-2xl flex flex-col py-8 z-50 hidden md:flex">
      {/* Logo Section */}
      <div className="px-6 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/40 hover:shadow-indigo-500/60 transition-all">
            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_tree
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">TaskIA</h1>
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mt-0.5">AI Productivity</p>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 space-y-2 px-3">
        <a className="flex items-center gap-3 px-4 py-3.5 text-white bg-indigo-600/20 border-l-2 border-indigo-500 rounded-lg hover:bg-indigo-600/30 transition-all duration-200 group" href="#">
          <span className="material-symbols-outlined text-lg text-indigo-400" style={{ fontVariationSettings: "'FILL' 1" }}>
            view_kanban
          </span>
          <span className="text-sm font-medium">Quadro Kanban</span>
        </a>
        
      </nav>

      {/* Bottom Section */}
      <div className="px-3 mt-auto space-y-3">
        <a className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/40 rounded-lg transition-all duration-200 group" href="#">
          <span className="material-symbols-outlined text-lg group-hover:text-indigo-400 transition-colors">help</span>
          <span className="text-sm font-medium">Ajuda</span>
        </a>
        <button type="button" onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 group">
          <LogOut aria-hidden="true" size={18} />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
