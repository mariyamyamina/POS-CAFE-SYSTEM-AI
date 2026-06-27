import React from 'react';
import { colors } from '../../constants/colors';
import { icons } from '../../constants/icons';

const CategoryList = ({ selectedCategory = "All Items", onSelectCategory }) => {
  const categories = [
    { id: 'Beverage', label: 'Beverage', icon: icons.categoryBeverage },
    { id: 'Steamed Bun', label: 'Steamed Bun', icon: icons.categoryBun },
    { id: 'Streamed Timsum', label: 'Streamed Timsum', icon: icons.categoryTimsum },
    { id: 'Deep Fry Timsum', label: 'Deep Fry Timsum', icon: icons.categoryFry },
    { id: 'Bake', label: 'Bake', icon: icons.categoryBake },
    { id: 'Noodle/Dumplings', label: 'Noodle/ Dumplings', icon: icons.categoryNoodle },
    { id: 'Porridge', label: 'Porridge', icon: icons.categoryPorridge },
    { id: 'Fresh Juice', label: 'Fresh Juice', icon: icons.categoryJuice },
    { id: 'All Items', label: 'All Items', icon: icons.gridOn },
  ];

  return (
    <div className="flex h-full flex-col justify-between gap-1">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory && onSelectCategory(cat.id)}
            className={`flex min-h-[45px] w-full items-center gap-3 rounded-md px-3 text-[11px] font-semibold transition-all duration-200 ${isActive ? 'text-white' : 'bg-white text-text-900 hover:bg-text-100'
              }`}
            style={{
              background: isActive
                ? `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`
                : undefined
            }}
            type="button"
          >
            <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-text-600'}`} />
            <span className="whitespace-normal break-words text-left leading-4">
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryList;
