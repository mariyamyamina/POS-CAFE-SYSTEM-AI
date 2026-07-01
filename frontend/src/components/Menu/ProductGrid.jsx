import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { icons } from '../../constants/icons';

const ProductGrid = ({
  items = [],
  billItems = [],
  onAddItem,
  selectedCategory = "All Items",
  searchQuery = "",
  viewMode = "grid",
  currentPage = 1,
  onPageChange = null
}) => {
  const itemsPerPage = 20;

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === "All Items" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 min-h-0 px-3 py-2">
        {paginatedItems.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-text-100 text-text-500">
              <icons.search className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-text-900">No items found</h3>
            <p className="mt-1 text-xs text-text-500">Try another category or search term.</p>
          </div>
        ) : (
          <div className={
            viewMode === "grid"
              ? "grid h-full grid-cols-4 grid-rows-5 gap-2"
              : "flex h-full flex-col gap-2 overflow-y-auto scrollbar-hide"
          }>
            {paginatedItems.map((item, index) => {
              const billItem = billItems.find(b => b.id === item.id);
              const quantity = billItem ? billItem.quantity : 0;
              const itemNumber = viewMode === "grid" ? startIndex + index + 1 : null;
              return (
                <ProductCard
                  key={item.id}
                  item={item}
                  quantity={quantity}
                  onAdd={onAddItem}
                  viewMode={viewMode}
                  itemNumber={itemNumber}
                />
              );
            })}
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
                onClick={() => onPageChange && onPageChange(pageNum)}
                type="button"
                className={`h-2.5 rounded-full transition-all duration-200 ${
                  isActive ? 'w-2.5 bg-primary' : 'w-2.5 bg-text-200 hover:bg-text-300'
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
