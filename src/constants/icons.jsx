import React from 'react';
import {
  FiGrid,
  FiFileText,
  FiLayers,
  FiClipboard,
  FiTrendingUp,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiUser,
  FiSearch,
  FiPlus,
  FiMinus,
  FiPrinter,
  FiTrash2,
  FiRotateCcw,
  FiX,
  FiGift,
  FiHome,
  FiMenu,
  FiCoffee,
} from 'react-icons/fi';

import {
  MdOutlineQrCodeScanner,
  MdOutlineInbox,
  MdOutlineFastfood,
  MdOutlineSoupKitchen,
  MdOutlineLocalDrink,
  MdGridOn,
  MdList,
} from 'react-icons/md';

import {
  BiReceipt,
  BiBarcodeReader,
  BiChevronLeft,
  BiChevronRight,
  BiSolidFilePdf,
} from 'react-icons/bi';

// Custom SVG components for the specific food icons to ensure exact visual representation
const BunIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2C6.5 2 2 6.5 2 12c0 5 4 8 10 8s10-3 10-8c0-5.5-4.5-10-10-10z" />
    <path d="M2 12c4-2 8-2 12 0" />
    <path d="M10 12c1.5-2 3.5-2 5 0" />
    <path d="M6 12c2.5-3 5.5-3 8 0" />
    <path d="M12 20v2M12 2v2" />
  </svg>
);

const TimsumIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 16h20v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4z" />
    <path d="M2 16V9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v7" />
    <path d="M12 2v4" />
    <path d="M8 12c1-1 3-1 4 0s3 1 4 0" />
    <path d="M4 16c2-1 4-1 6 0s4 1 6 0 4 1 6 0" />
  </svg>
);

const FryIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17 14h.01M21 17h.01M17 18h.01" />
    <rect x="2" y="8" width="14" height="10" rx="2" />
    <path d="M16 10h5a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-5" />
    <path d="M6 8V4c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v4" />
    <path d="M2 13h14" />
  </svg>
);

const BakeIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9.5" />
    <path d="M16 2v4M20 2v4" />
    <rect x="6" y="8" width="8" height="6" rx="1" />
    <circle cx="8" cy="17" r="1" />
    <circle cx="12" cy="17" r="1" />
    <circle cx="16" cy="17" r="1" />
  </svg>
);

const NoodleIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 2L13 11" />
    <path d="M22 6L16 12" />
    <path d="M2 10a10 10 0 0 0 20 0H2z" />
    <path d="M5 10c0 3 1.5 6 4 7.5" />
    <path d="M19 10c0 3-1.5 6-4 7.5" />
    <path d="M9 10v4" />
    <path d="M12 10v6" />
    <path d="M15 10v4" />
  </svg>
);

const PorridgeIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 12a9 9 0 0 0 18 0H3z" />
    <path d="M12 2v4M8 3v3M16 3v3" />
    <path d="M6 12c0 2.5 2 4.5 4.5 4.5" />
    <path d="M2 12h20" />
  </svg>
);

const JuiceIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 22H6c-1.1 0-2-.9-2-2V8h16v12c0 1.1-.9 2-2 2zM15 2L9 8" />
    <path d="M4 8h16" />
  </svg>
);

export const icons = {
  // Navigation
  dashboard: FiGrid,
  billing: BiReceipt,
  inventory: FiLayers,
  itemRequest: FiClipboard,
  salesReport: FiTrendingUp,
  users: FiUsers,
  settings: FiSettings,
  logout: FiLogOut,
  fileText: FiFileText,
  
  // Profile / General
  user: FiUser,
  search: FiSearch,
  plus: FiPlus,
  minus: FiMinus,
  printer: FiPrinter,
  trash: FiTrash2,
  rotateCcw: FiRotateCcw,
  close: FiX,
  gift: FiGift,
  home: FiHome,
  menu: FiMenu,
  coffee: FiCoffee,
  
  // Custom Barcode / Scanner
  barcode: MdOutlineQrCodeScanner,
  barcodeReader: BiBarcodeReader,
  
  // View Toggle
  gridOn: MdGridOn,
  list: MdList,
  
  // Category Icons (Detailed outline icons)
  categoryBeverage: FiCoffee,
  categoryBun: BunIcon,
  categoryTimsum: TimsumIcon,
  categoryFry: FryIcon,
  categoryBake: BakeIcon,
  categoryNoodle: NoodleIcon,
  categoryPorridge: PorridgeIcon,
  categoryJuice: JuiceIcon,
  
  // Pagination
  chevronLeft: BiChevronLeft,
  chevronRight: BiChevronRight,
};
