import { useState, useEffect, useCallback } from 'react';
import styles from './styles/App.module.css';

import { ALL_TOOLS } from './config.jsx';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

export default function App() {
  const [activeId, setActiveId] = useState(() => localStorage.getItem('ag-active') || 'base64');
  const [theme, setTheme] = useState(() => localStorage.getItem('ag-theme') || 'dark');
  const [helpOpen, setHelpOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isWails = window.go !== undefined;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ag-theme', theme);
  }, [theme]);

  // Persist active tool
  useEffect(() => {
    localStorage.setItem('ag-active', activeId);
  }, [activeId]);

  // Close sidebar on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const active = ALL_TOOLS.find(t => t.id === activeId);
  const ActiveComponent = active?.component;

  const selectTool = useCallback((id) => {
    setActiveId(id);
    setHelpOpen(false);
    setSidebarOpen(false);
  }, []);

  return (
    <div className={styles.window} data-mobile-menu={sidebarOpen}>
      <div className={styles.shell}>
        {sidebarOpen && <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />}

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeId={activeId}
          selectTool={selectTool}
          isWails={isWails}
          theme={theme}
          setTheme={setTheme}
        />

        <MainContent
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          active={active}
          activeId={activeId}
          helpOpen={helpOpen}
          setHelpOpen={setHelpOpen}
          ActiveComponent={ActiveComponent}
        />
      </div>
    </div>
  );
}
