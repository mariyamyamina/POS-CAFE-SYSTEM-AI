import React, { useMemo, useState } from 'react';
import AppLayout from '../layout/AppLayout';
import PageNavbar from '../components/common/PageNavbar';
import Pagination from '../components/common/Pagination';
import UsersFilterBar from '../components/Users/UsersFilterBar';
import UsersTable from '../components/Users/UsersTable';
import UserFormModal from '../components/Users/UserFormModal';
import { icons } from '../constants/icons';

const USERS_ITEMS = [
  { id: 1,  firstName: 'Fouzan',       lastName: 'M', username: 'fouzan',      email: 'fouzan@poscafe.com',      role: 'Cashier',     phone: '7890987890', status: 'Active', createdAtDate: '22 June 2026', createdAtTime: '04:54 pm' },
  { id: 2,  firstName: 'Mohamed Ahyan',lastName: 'M', username: 'ahyan',       email: 'ahyan@poscafe.com',       role: 'Manager',     phone: '8345908224', status: 'Active', createdAtDate: '22 June 2026', createdAtTime: '02:13 pm' },
  { id: 3,  firstName: 'Shakthi',      lastName: 'S', username: 'shakthi',     email: 'shakthi@poscafe.com',     role: 'Supervisor',  phone: '8909872343', status: 'Active', createdAtDate: '22 June 2026', createdAtTime: '02:12 pm' },
  { id: 4,  firstName: 'Ezhilmathi',   lastName: 'K', username: 'ezhilmathi',  email: 'ezhil@gmail.com',         role: 'Cashier',     phone: '8905678987', status: 'Active', createdAtDate: '22 June 2026', createdAtTime: '10:08 am' },
  { id: 5,  firstName: 'kalai selvi',  lastName: 'S', username: 'kalaiselvi',  email: 'kalaiselvis@poscafe.com', role: 'Accountant',  phone: '7890125676', status: 'Active', createdAtDate: '21 June 2026', createdAtTime: '02:37 pm' },
  { id: 6,  firstName: 'Priya',        lastName: 'R', username: 'priya',       email: 'priya@poscafe.com',       role: 'Cashier',     phone: '9876543210', status: 'Active', createdAtDate: '20 June 2026', createdAtTime: '11:20 am' },
  { id: 7,  firstName: 'Arun',         lastName: 'T', username: 'arun',        email: 'arun@poscafe.com',        role: 'Manager',     phone: '9812345670', status: 'Inactive',createdAtDate: '19 June 2026', createdAtTime: '09:15 am' },
  { id: 8,  firstName: 'Deepa',        lastName: 'V', username: 'deepa',       email: 'deepa@poscafe.com',       role: 'Supervisor',  phone: '9900112233', status: 'Active', createdAtDate: '18 June 2026', createdAtTime: '03:45 pm' },
  { id: 9,  firstName: 'Suresh',       lastName: 'N', username: 'suresh',      email: 'suresh@poscafe.com',      role: 'Cashier',     phone: '9988776655', status: 'Active', createdAtDate: '17 June 2026', createdAtTime: '01:30 pm' },
  { id: 10, firstName: 'Meena',        lastName: 'L', username: 'meena',       email: 'meena@poscafe.com',       role: 'Accountant',  phone: '9871234560', status: 'Pending',createdAtDate: '16 June 2026', createdAtTime: '04:00 pm' },
];

const UsersPage = ({ onToggleSidebar, onLogout, onNavigate }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modal state: whether it's open, which mode ('add' | 'edit'), and which
  // user (if any) is being edited.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedUser, setSelectedUser] = useState(null);

  const totalPages = Math.ceil(USERS_ITEMS.length / pageSize);
  const visibleItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return USERS_ITEMS.slice(start, start + pageSize);
  }, [page, pageSize]);

  const handlePageSizeChange = (nextPageSize) => {
    setPageSize(nextPageSize);
    setPage(1);
  };

  // Clicking the edit (pencil) icon in a table row opens the modal in
  // "edit" mode, pre-filled with that user's existing values.
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // Clicking "Add New User" opens the same modal in "add" mode with an
  // empty form.
  const handleAddUser = () => {
    setSelectedUser(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = (formValues) => {
    // Wire this up to your create/update API call.
    console.log(modalMode === 'edit' ? 'Update user:' : 'Create user:', formValues);
    handleCloseModal();
  };

  const handleDeleteUser = (user) => {
    // Wire this up to your delete API call.
    console.log('Delete user:', user);
    handleCloseModal();
  };

  return (
    <AppLayout activePage="users" onLogout={onLogout} onNavigate={onNavigate}>
      <PageNavbar title="Users Management" onToggleSidebar={onToggleSidebar} />

      <main className="flex-1 overflow-y-auto px-3 pb-4 lg:px-4">
        <div className="flex min-h-full flex-col gap-3">
          <UsersFilterBar />

          <section className="rounded-lg border border-[#EAECF3] bg-white shadow-[0_2px_8px_rgba(20,18,56,0.04)]">
            {/* Header row */}
            <div className="flex flex-col gap-3 px-5 pt-5 pb-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-[#111827]">Users List</h2>
                <p className="mt-0.5 text-[12px] font-medium text-[#7C3AED]">
                  Total {USERS_ITEMS.length} users
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleAddUser}
                  className="flex h-9 items-center gap-1.5 rounded-md bg-[#7C3AED] px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-[#6D28D9]"
                  type="button"
                >
                  <icons.plus className="h-4 w-4" />
                  Add New User
                </button>
                <button
                  className="flex h-9 items-center gap-1.5 rounded-md border border-[#DDE1EC] bg-white px-4 text-[12px] font-semibold text-[#374151] transition hover:bg-[#F8F8FB]"
                  type="button"
                >
                  <icons.fileText className="h-4 w-4 text-[#7C3AED]" />
                  Export to Excel
                </button>
              </div>
            </div>

            <UsersTable items={visibleItems} onEditUser={handleEditUser} />

            <Pagination
              page={page}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={USERS_ITEMS.length}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
          </section>
        </div>
      </main>

      <UserFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        user={selectedUser}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        onDelete={handleDeleteUser}
      />
    </AppLayout>
  );
};

export default UsersPage;