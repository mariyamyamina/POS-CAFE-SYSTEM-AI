import React from 'react';

const ProductCard = ({ item, onAdd, viewMode = "grid" }) => {
  if (viewMode === "list") {
    return (
      <div
        onClick={() => onAdd && onAdd(item)}
        className="flex cursor-pointer items-center justify-between rounded-md border border-[#EEF0F6] bg-white p-2 transition-all hover:border-[#7C3AED]/30 hover:shadow-sm"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-[#F4F5F9]">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover object-center"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=60";
              }}
            />
          </div>
          <div className="min-w-0 text-left">
            <span className="block truncate text-xs font-semibold text-[#10112B]">{item.name}</span>
            <span className="text-[10px] text-[#6B7194]">{item.category}</span>
          </div>
        </div>
        <span className="ml-3 shrink-0 text-xs font-bold text-[#171A4A]">₹{item.price.toFixed(2)}</span>
      </div>
    );
  }

  return (
    <div
      onClick={() => onAdd && onAdd(item)}
      className="flex h-[103px] cursor-pointer flex-col items-center justify-between rounded-md border border-[#EEF0F6] bg-white px-2 py-2 text-center transition-all hover:border-[#7C3AED]/35 hover:shadow-sm"
    >
      <div className="flex h-12 w-full items-center justify-center overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-12 w-16 object-contain object-center transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=60";
          }}
        />
      </div>

      <div className="min-w-0">
        <h4 className="line-clamp-2 text-[10px] font-semibold leading-tight text-[#01042A]">
          {item.name}
        </h4>
        <p className="mt-0.5 text-[11px] font-bold leading-none text-[#18205A]">
          ₹{item.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
