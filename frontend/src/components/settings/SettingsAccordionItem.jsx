import React from 'react';
import { icons } from '../../constants/icons';

/**
 * Shared accordion shell used by every settings section.
 * Renders the clickable header row (chevron + title) and conditionally
 * renders its children when expanded.
 */
const SettingsAccordionItem = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="border-b border-[#EAECF3] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-5 py-4 text-left"
      >
        <icons.chevronDown
          className={`h-4 w-4 text-[#374151] transition-transform ${isOpen ? '' : '-rotate-90'}`}
        />
        <span className="text-[14px] font-semibold text-[#3F3D9E]">{title}</span>
      </button>

      {isOpen && (
        <div className="px-5 pb-5">
          {children}
        </div>
      )}
    </div>
  );
};

export default SettingsAccordionItem;