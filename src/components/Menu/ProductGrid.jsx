import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { icons } from '../../constants/icons';

const ProductGrid = ({
  items = [],
  onAddItem,
  selectedCategory = "All Items",
  searchQuery = "",
  viewMode = "grid"
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === "All Items" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 min-h-0 px-3 py-2">
        {paginatedItems.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3F5F9] text-[#6E768E]">
              <icons.search className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-[#10112B]">No items found</h3>
            <p className="mt-1 text-xs text-[#6E768E]">Try another category or search term.</p>
          </div>
        ) : (
          <div className={
            viewMode === "grid"
              ? "grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4"
              : "flex flex-col gap-2"
          }>
            {paginatedItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onAdd={onAddItem}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex h-8 shrink-0 items-center justify-center gap-2 bg-white">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = currentPage === pageNum;

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                type="button"
                className={`h-2.5 rounded-full transition-all duration-200 ${
                  isActive ? 'w-2.5 bg-[#7C3AED]' : 'w-2.5 bg-[#DFE2EA] hover:bg-[#A0A8C0]'
                }`}
                aria-label={`Go to page ${pageNum}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
