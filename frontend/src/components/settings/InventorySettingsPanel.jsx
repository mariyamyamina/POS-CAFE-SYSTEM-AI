import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

const InventorySettingsPanel = () => {
  const { settings, updateSettings } = useSettings();
  const [threshold, setThreshold] = useState(settings.low_stock_threshold);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setThreshold(settings.low_stock_threshold);
  }, [settings.low_stock_threshold]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSettings({
        low_stock_threshold: parseInt(threshold, 10),
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 border-t border-[#EAECF3] pt-5">
      <div className="max-w-[420px]">
        <label className="mb-1.5 block text-[13px] font-medium text-[#374151]">Low Stock Threshold</label>
        <input
          type="number"
          min={0}
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          className="h-10 w-full rounded-md border border-[#DDE1EC] bg-white px-3 text-[13px] font-medium text-[#7C3AED] outline-none transition-colors focus:border-[#7C3AED]"
        />
        <p className="mt-1.5 text-[12px] font-medium text-[#6B7280]">
          Products below this quantity will be marked as Low Stock.
        </p>
      </div>

      <div className="mt-1.5">
        <button
          type="button"
          onClick={handleSave}
          className="flex h-10 items-center rounded-md bg-[#7C3AED] px-5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#6D28D9]"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default InventorySettingsPanel;