import React, { useState } from 'react';
import { icons } from '../../constants/icons';

const INITIAL_CATEGORIES = [
  { id: 1, name: 'Beverage' },
  { id: 2, name: 'Steamed Bun' },
  { id: 3, name: 'Streamed Timsum' },
  { id: 4, name: 'Deep Fry Timsum' },
  { id: 5, name: 'Bake' },
  { id: 6, name: 'Noodle/ Dumplings' },
  { id: 7, name: 'Porridge' },
  { id: 8, name: 'Fresh Juice' },
  { id: 9, name: 'All Items' },
];

const MenuManagementSettingsPanel = () => {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  const handleAdd = () => {
    const name = newCategory.trim();
    if (!name) return;
    setCategories((prev) => [...prev, { id: Date.now(), name }]);
    setNewCategory('');
    // Wire this up to your category-create API.
    console.log('Add category:', name);
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setEditingValue(category.name);
  };

  const confirmEdit = () => {
    const name = editingValue.trim();
    if (!name) return;
    setCategories((prev) =>
      prev.map((c) => (c.id === editingId ? { ...c, name } : c))
    );
    // Wire this up to your category-update API.
    console.log('Update category:', editingId, name);
    setEditingId(null);
    setEditingValue('');
  };

  const handleDelete = (category) => {
    setCategories((prev) => prev.filter((c) => c.id !== category.id));
    // Wire this up to your category-delete API.
    console.log('Delete category:', category);
  };

  return (
    <div className="flex flex-col gap-4 border-t border-[#EAECF3] pt-5">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          placeholder="Category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="h-10 w-full flex-1 rounded-md border border-[#DDE1EC] bg-white px-3 text-[13px] font-medium text-[#374151] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#7C3AED]"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="flex h-10 items-center justify-center gap-1.5 rounded-md bg-[#7C3AED] px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#6D28D9] sm:w-auto"
        >
          <icons.plus className="h-4 w-4" />
          Add
        </button>
      </div>

      <div className="overflow-hidden rounded-md border border-[#EAECF3]">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#F3F4F8]">
              <th className="px-4 py-3 text-[13px] font-semibold text-[#374151]">Category</th>
              <th className="px-4 py-3 text-[13px] font-semibold text-[#374151]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t border-[#EAECF3]">
                <td className="px-4 py-3 text-[13px] font-medium">
                  {editingId === category.id ? (
                    <input
                      type="text"
                      value={editingValue}
                      autoFocus
                      onChange={(e) => setEditingValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && confirmEdit()}
                      onBlur={confirmEdit}
                      className="h-8 w-full max-w-[260px] rounded-md border border-[#7C3AED] bg-white px-2 text-[13px] font-medium text-[#374151] outline-none"
                    />
                  ) : (
                    <span className="text-[#374151]">{category.name}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => startEdit(category)}
                      aria-label={`Edit ${category.name}`}
                      className="text-[#7C3AED] transition hover:text-[#6D28D9]"
                    >
                      <icons.edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category)}
                      aria-label={`Delete ${category.name}`}
                      className="text-[#EF4444] transition hover:text-[#DC2626]"
                    >
                      <icons.trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuManagementSettingsPanel;