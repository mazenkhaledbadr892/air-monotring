import React from 'react';
import { Page } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Home, BarChart2, History, Settings as SettingsIcon, Sun, Moon } from './icons/Icons';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isAlerting: boolean;
}

const NavItem: React.FC<{
  label: Page;
  icon: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}> = ({ label, icon, currentPage, setCurrentPage }) => {
  const isActive = currentPage === label;
  
  return (
    <button
      onClick={() => setCurrentPage(label)}
      className={`relative flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ease-in-out group ${isActive ? 'text-accent' : 'text-text-light-secondary dark:text-text-dark-secondary hover:text-accent'}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="relative">
        {icon}
      </div>
      <span className={`text-xs mt-1 font-medium ${isActive ? 'text-accent' : ''}`}>
        {label}
      </span>
      {isActive && <div className="absolute bottom-1 w-8 h-1 bg-accent rounded-full"></div>}
    </button>
  );
};


const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage, isAlerting }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-bkg-light dark:bg-bkg-dark min-h-screen font-sans text-text-light-primary dark:text-text-dark-primary flex flex-col">
      <header className="fixed top-0 left-0 right-0 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm border-b border-gray-200 dark:border-slate-700 z-10">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-2">
             <svg className="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="2" stroke="currentColor"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M9.6 4.6A2 2 0 1 1 11 8H2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12.6 19.4A2 2 0 1 0 14 16H2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
             <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">Air Monitor</h1>
             {isAlerting && <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dangerous opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-dangerous"></span></span>}
          </div>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full transition-colors duration-200 text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-200 dark:hover:bg-slate-700"
          >
            {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
          </button>
        </div>
      </header>
      
      <main className="flex-grow pt-20 pb-24 px-4 container mx-auto">
        {children}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm border-t border-gray-200 dark:border-slate-700">
        <nav className="flex justify-around items-center h-16 max-w-lg mx-auto">
          <NavItem label="Dashboard" icon={<Home />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <NavItem label="Live" icon={<BarChart2 />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <NavItem label="History" icon={<History />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <NavItem label="Settings" icon={<SettingsIcon />} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </nav>
      </footer>
    </div>
  );
};

export default Layout;