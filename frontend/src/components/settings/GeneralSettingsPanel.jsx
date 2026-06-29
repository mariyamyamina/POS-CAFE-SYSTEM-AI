import React, { useState, useEffect } from 'react';
import { icons } from '../../constants/icons';
import { useSettings } from '../../context/SettingsContext';

const TIME_FORMAT_OPTIONS = ['hh:mm A', 'HH:mm'];

const inputCls =
  'h-10 w-full rounded-md border border-[#DDE1EC] bg-white px-3 text-[13px] font-medium text-[#7C3AED] outline-none transition-colors placeholder:text-[#A78BFA] focus:border-[#7C3AED]';

const selectCls = `${inputCls} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%237C3AED%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-9`;

const GeneralSettingsPanel = () => {
  const { settings, loading, updateSettings } = useSettings();
  const [cafeName, setCafeName] = useState(settings.cafe_name);
  const [timeFormat, setTimeFormat] = useState(settings.time_format);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(settings.logo);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCafeName(settings.cafe_name);
    setTimeFormat(settings.time_format);
    setLogoPreview(settings.logo);
  }, [settings]);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      let logoData = settings.logo;
      
      if (logoFile) {
        logoData = await fileToBase64(logoFile);
      }

      await updateSettings({
        cafe_name: cafeName,
        time_format: timeFormat,
        logo: logoData,
      });
      
      setLogoFile(null);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 border-t border-[#EAECF3] pt-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-[#374151]">Cafe Name</label>
          <input
            type="text"
            value={cafeName}
            onChange={(e) => setCafeName(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-[#374151]">Time Format</label>
          <select
            value={timeFormat}
            onChange={(e) => setTimeFormat(e.target.value)}
            className={selectCls}
          >
            {TIME_FORMAT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-w-[580px]">
        <label className="mb-1.5 block text-[13px] font-medium text-[#374151]">Cafe Logo</label>
        <div className="flex items-center gap-4 rounded-lg border border-dashed border-[#D6D9E3] bg-[#FAFAFC] p-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white bg-[#7C3AED] shadow-sm">
            {logoPreview ? (
              <img src={logoPreview} alt="Cafe logo" className="h-full w-full object-cover" />
            ) : (
              <icons.logo className="h-7 w-7 text-white" />
            )}
          </div>
          <label className="flex cursor-pointer flex-col gap-0.5">
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#7C3AED]">
              <icons.upload className="h-4 w-4" />
              Change Logo
            </span>
            <span className="text-[12px] font-medium text-[#7C3AED]/70">PNG, JPG or WEBP</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleLogoChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div>
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

export default GeneralSettingsPanel;