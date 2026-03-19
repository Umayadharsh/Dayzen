import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Moon, Sun, LogOut, Download, Palette,
  Menu, X, BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import jsPDF from 'jspdf';
import api from '../utils/api';
import toast from 'react-hot-toast';

// Accent color presets
const ACCENTS = [
  { name: 'Amber',   hex: '#b8823a' },
  { name: 'Sage',    hex: '#5a8a6a' },
  { name: 'Dusty Rose', hex: '#a06070' },
  { name: 'Navy',    hex: '#3a5a8a' },
  { name: 'Plum',    hex: '#6a4a8a' },
  { name: 'Terracotta', hex: '#b85a3a' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, setDark, accent, setAccent } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Generate initials avatar from user name
  const initials = user?.name
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Export all memories as PDF
  const handleExport = async () => {
    setExporting(true);
    try {
      const { data } = await api.get('/memories?limit=500');
      const pdf = new jsPDF();
      const pageW = pdf.internal.pageSize.getWidth();
      let y = 20;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.setTextColor(50, 30, 14);
      pdf.text('Dayzen — My Memories', pageW / 2, y, { align: 'center' });
      y += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(139, 94, 46);
      pdf.text(`Exported on ${new Date().toLocaleDateString()}`, pageW / 2, y, { align: 'center' });
      y += 10;

      data.memories.forEach((mem, i) => {
        if (y > 260) { pdf.addPage(); y = 20; }

        // Date chip
        pdf.setFillColor(245, 233, 217);
        pdf.roundedRect(14, y - 4, 55, 8, 2, 2, 'F');
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(107, 69, 34);
        pdf.text(new Date(mem.date).toDateString(), 16, y + 1);
        y += 10;

        // Title
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(13);
        pdf.setTextColor(26, 15, 5);
        pdf.text(mem.title, 14, y);
        y += 7;

        // Description (wrapped)
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(107, 69, 34);
        const lines = pdf.splitTextToSize(mem.description, pageW - 28);
        pdf.text(lines, 14, y);
        y += lines.length * 5 + 10;

        // Separator
        pdf.setDrawColor(232, 207, 168);
        pdf.line(14, y - 5, pageW - 14, y - 5);
      });

      pdf.save('dayzen-memories.pdf');
      toast.success('Memories exported as PDF!');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-brown-900/90 backdrop-blur-md border-b border-brown-100 dark:border-brown-800">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <BookOpen size={20} className="text-brown-500" />
            <span className="font-serif text-xl font-bold text-brown-800 dark:text-brown-100">
              Dayzen
            </span>
          </Link>

          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-1">

            {/* Export PDF */}
            <button
              onClick={handleExport}
              disabled={exporting}
              title="Export all memories as PDF"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-brown-500 dark:text-brown-400 hover:bg-brown-50 dark:hover:bg-brown-800 transition disabled:opacity-50"
            >
              <Download size={15} />
              <span className="hidden md:inline">{exporting ? 'Exporting...' : 'Export'}</span>
            </button>

            {/* Theme palette */}
            <div className="relative">
              <button
                onClick={() => setPaletteOpen(!paletteOpen)}
                title="Theme color"
                className="p-2 rounded-lg text-brown-500 dark:text-brown-400 hover:bg-brown-50 dark:hover:bg-brown-800 transition"
              >
                <Palette size={17} />
              </button>

              {/* Palette dropdown */}
              {paletteOpen && (
                <div className="absolute right-0 top-10 bg-white dark:bg-brown-800 border border-brown-100 dark:border-brown-700 rounded-xl shadow-lg p-3 w-44 z-50 animate-scale-in">
                  <p className="text-xs font-medium text-brown-500 mb-2">Accent color</p>
                  <div className="grid grid-cols-3 gap-2">
                    {ACCENTS.map(a => (
                      <button
                        key={a.hex}
                        onClick={() => { setAccent(a.hex); setPaletteOpen(false); }}
                        title={a.name}
                        className="w-full aspect-square rounded-lg transition hover:scale-110 active:scale-95"
                        style={{
                          background: a.hex,
                          outline: accent === a.hex ? `3px solid ${a.hex}` : 'none',
                          outlineOffset: '2px'
                        }}
                      />
                    ))}
                  </div>
                  {/* Custom color input */}
                  <div className="mt-2 pt-2 border-t border-brown-100 dark:border-brown-700">
                    <label className="text-xs text-brown-400 block mb-1">Custom</label>
                    <input
                      type="color"
                      value={accent}
                      onChange={e => setAccent(e.target.value)}
                      className="w-full h-8 rounded cursor-pointer border-0"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDark(!dark)}
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg text-brown-500 dark:text-brown-400 hover:bg-brown-50 dark:hover:bg-brown-800 transition"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-brown-200 dark:bg-brown-700 mx-1"/>

            {/* User avatar */}
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: accent }}
              >
                {initials}
              </div>
              <span className="hidden md:block text-sm font-medium text-brown-700 dark:text-brown-200 max-w-[100px] truncate">
                {user?.name}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-2 rounded-lg text-brown-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              <LogOut size={16} />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-lg text-brown-500"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="sm:hidden border-t border-brown-100 dark:border-brown-800 bg-white dark:bg-brown-900 px-4 py-3 space-y-1 animate-slide-up">
            <div className="flex items-center gap-2 py-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: accent }}
              >{initials}</div>
              <span className="font-medium text-brown-800 dark:text-brown-100">{user?.name}</span>
            </div>
            <button onClick={handleExport} className="w-full flex items-center gap-2 py-2 text-sm text-brown-600 dark:text-brown-300">
              <Download size={15} /> Export PDF
            </button>
            <button onClick={() => setDark(!dark)} className="w-full flex items-center gap-2 py-2 text-sm text-brown-600 dark:text-brown-300">
              {dark ? <Sun size={15} /> : <Moon size={15} />}
              {dark ? 'Light mode' : 'Dark mode'}
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 py-2 text-sm text-red-500">
              <LogOut size={15} /> Sign out
            </button>
          </div>
        )}
      </header>

      {/* Close palette when clicking outside */}
      {paletteOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setPaletteOpen(false)}
        />
      )}
    </>
  );
}