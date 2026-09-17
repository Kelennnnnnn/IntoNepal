import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mountain, Building2, ShieldCheck, Mail, Palette } from 'lucide-react';
import { isAll } from '@/lib/portal';

export const DevPortalBanner: React.FC = () => {
  const location = useLocation();

  if (!isAll) {
    return null;
  }

  const portals = [
    {
      label: 'Customer Portal',
      path: '/',
      icon: Mountain,
      active: location.pathname === '/' || location.pathname.startsWith('/activities'),
      activeClass: 'bg-amber-500 text-slate-950 font-bold',
    },
    {
      label: 'Contact Us',
      path: '/contact',
      icon: Mail,
      active: location.pathname === '/contact',
      activeClass: 'bg-amber-500 text-slate-950 font-bold',
    },
    {
      label: 'Agency Partner',
      path: '/agency',
      icon: Building2,
      active: location.pathname.startsWith('/agency'),
      activeClass: 'bg-blue-500 text-white font-bold',
    },
    {
      label: 'Super Admin Console',
      path: '/admin',
      icon: ShieldCheck,
      active: location.pathname.startsWith('/admin'),
      activeClass: 'bg-emerald-500 text-slate-950 font-bold',
    },
    {
      label: 'Design System',
      path: '/design-system',
      icon: Palette,
      active: location.pathname === '/design-system',
      activeClass: 'bg-purple-500 text-white font-bold',
    },
  ];

  return (
    <aside
      aria-label="Development Portal Switcher"
      className="bg-[#0D121F] text-slate-300 text-xs border-b border-[#1E293B] px-3 py-1.5 sticky top-0 z-50 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1E293B] text-[10px] font-semibold text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Unified Dev Mode
          </span>
          <span className="hidden sm:inline text-slate-400 text-[11px]">
            Switch portal view:
          </span>
        </div>

        <nav aria-label="Portal Navigation" className="flex items-center flex-wrap gap-1">
          {portals.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.path}
                to={p.path}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                  p.active
                    ? p.activeClass
                    : 'text-slate-300 hover:text-white hover:bg-[#1E293B]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{p.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
