import React, { useState } from 'react';
import AppLayout from '../layout/AppLayout';
import PageNavbar from '../components/common/PageNavbar';
import SettingsAccordionItem from '../components/Settings/SettingsAccordionItem';
import GeneralSettingsPanel from '../components/Settings/GeneralSettingsPanel';
import InventorySettingsPanel from '../components/Settings/InventorySettingsPanel';
import MenuManagementSettingsPanel from '../components/Settings/MenuManagementSettingsPanel';
import UserSettingsPanel from '../components/Settings/UserSettingsPanel';

const SECTIONS = [
  { key: 'general', title: 'General Settings', Panel: GeneralSettingsPanel },
  { key: 'inventory', title: 'Inventory Settings', Panel: InventorySettingsPanel },
  { key: 'menu', title: 'Menu Management Settings', Panel: MenuManagementSettingsPanel },
  { key: 'users', title: 'User Settings', Panel: UserSettingsPanel },
];

const SettingsPage = ({ onToggleSidebar, onLogout, onNavigate, user }) => {
  // Only one section is expanded at a time, matching the design.
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (key) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  return (
    <AppLayout activePage="settings" onLogout={onLogout} onNavigate={onNavigate} user={user}>
      <PageNavbar title="Settings" onToggleSidebar={onToggleSidebar} />

      <main className="flex-1 overflow-y-auto px-3 pb-4 lg:px-4">
        <div className="flex min-h-full flex-col gap-3">
          <section>
            {SECTIONS.map(({ key, title, Panel }) => (
              <SettingsAccordionItem
                key={key}
                title={title}
                isOpen={openSection === key}
                onToggle={() => toggleSection(key)}
              >
                <Panel />
              </SettingsAccordionItem>
            ))}
          </section>
        </div>
      </main>
    </AppLayout>
  );
};

export default SettingsPage;