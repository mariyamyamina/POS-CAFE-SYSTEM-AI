import React, { useEffect, useMemo, useState } from 'react';
import AppLayout from '../layout/AppLayout';
import PageNavbar from '../components/common/PageNavbar';
import Pagination from '../components/common/Pagination';
import UsersFilterBar from '../components/Users/UsersFilterBar';
import UsersTable from '../components/Users/UsersTable';
import UserFormModal from '../components/Users/UserFormModal';
import { icons } from '../constants/icons';
import { authApi } from '../api/index';

const transformUserData = (users) => {
  return users.map((user) => {
    const nameParts = (user.fullName || user.full_name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    const createdAt = new Date(user.created_at);
    const createdAtDate = createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const createdAtTime = createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    return {
      id: user.id,
      firstName,
      lastName,
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      status: user.isActive || user.is_active ? 'Active' : 'Inactive',
      createdAtDate,
      createdAtTime,
    };
  });
};

const UsersPage = ({ onToggleSidebar, onLogout, onNavigate, user }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await authApi.getUsers();
        const transformedData = transformUserData(data);
        setUsers(transformedData);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Modal state: whether it's open, which mode ('add' | 'edit'), and which
  // user (if any) is being edited.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedUser, setSelectedUser] = useState(null);

  const totalPages = Math.ceil(users.length / pageSize);
  const visibleItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [page, pageSize, users]);

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

  const handleSaveUser = async (formValues) => {
    try {
      const fullName = `${formValues.firstName} ${formValues.lastName}`.trim();
      const payload = {
        fullName,
        username: formValues.username,
        email: formValues.email,
        role: formValues.role,
        isActive: formValues.isActive,
        phone: formValues.phone,
      };

      // Only include password if it's provided (for new users or when changing password)
      if (formValues.password) {
        payload.password = formValues.password;
      }

      if (modalMode === 'edit') {
        await authApi.updateUser(formValues.id, payload);
      } else {
        await authApi.createUser(payload);
      }

      // Refresh the users list
      const data = await authApi.getUsers();
      const transformedData = transformUserData(data);
      setUsers(transformedData);
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save user:', error);
      alert(error.message || 'Failed to save user');
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      await authApi.deleteUser(user.id);
      
      // Refresh the users list
      const data = await authApi.getUsers();
      const transformedData = transformUserData(data);
      setUsers(transformedData);
      handleCloseModal();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert(error.message || 'Failed to delete user');
    }
  };

  return (
    <AppLayout activePage="users" onLogout={onLogout} onNavigate={onNavigate} user={user}>
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
                  Total {users.length} users
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

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-sm text-gray-500">Loading users...</div>
              </div>
            ) : (
              <UsersTable items={visibleItems} onEditUser={handleEditUser} />
            )}

            <Pagination
              page={page}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={users.length}
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