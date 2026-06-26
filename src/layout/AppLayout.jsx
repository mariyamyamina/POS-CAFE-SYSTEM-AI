import React, { useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';

const AppLayout = ({ children, activePage = 'billing', onLogout, onNavigate }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F8FB] font-sans antialiased text-[#10112B]">
      <Sidebar
        activePage={activePage}
        isOpen={isMobileSidebarOpen}
        onClose={closeSidebar}
        onLogout={onLogout}
        onNavigate={onNavigate}
      />

      <div className="flex h-full flex-1 flex-col overflow-hidden">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { onToggleSidebar: toggleSidebar });
          }
          return child;
        })}
      </div>
    </div>
  );
};

export default AppLayout;
