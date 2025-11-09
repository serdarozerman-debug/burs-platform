"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export type FilterState = {
  search: string;
  type: string[];
  education_level: string[];
  min_amount: number;
  max_amount: number;
  days_left: number | null;
};

interface ScholarshipFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  currentFilters: FilterState;
}

const ScholarshipFilters = ({ onFilterChange, currentFilters }: ScholarshipFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(currentFilters.search);
  const [debouncedSearch, setDebouncedSearch] = useState(currentFilters.search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch]);

  // Update filters when debounced search changes
  useEffect(() => {
    onFilterChange({
      ...currentFilters,
      search: debouncedSearch,
    });
  }, [debouncedSearch]);

  const handleTypeChange = (type: string) => {
    const newTypes = currentFilters.type.includes(type)
      ? currentFilters.type.filter((t) => t !== type)
      : [...currentFilters.type, type];
    
    onFilterChange({
      ...currentFilters,
      type: newTypes,
    });
  };

  const handleEducationLevelChange = (level: string) => {
    const newLevels = currentFilters.education_level.includes(level)
      ? currentFilters.education_level.filter((l) => l !== level)
      : [...currentFilters.education_level, level];
    
    onFilterChange({
      ...currentFilters,
      education_level: newLevels,
    });
  };

  const handleAmountChange = (field: "min_amount" | "max_amount", value: number) => {
    onFilterChange({
      ...currentFilters,
      [field]: value,
    });
  };

  const handleDaysLeftChange = (days: number | null) => {
    onFilterChange({
      ...currentFilters,
      days_left: days,
    });
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      search: "",
      type: [],
      education_level: [],
      min_amount: 0,
      max_amount: 25000,
      days_left: null,
    };
    setLocalSearch("");
    onFilterChange(clearedFilters);
  };

  const scholarshipTypes = [
    { value: "akademik", label: "Akademik", count: 45 },
    { value: "engelli", label: "Engelli", count: 23 },
    { value: "ihtiyaç", label: "İhtiyaç", count: 67 },
  ];

  const educationLevels = [
    { value: "lise", label: "Lise", count: 89 },
    { value: "lisans", label: "Lisans", count: 156 },
    { value: "yükseklisans", label: "Yüksek Lisans", count: 78 },
  ];

  const daysOptions = [
    { value: null, label: "Tümü", count: 180 },
    { value: 30, label: "30 Gün İçinde", count: 45 },
    { value: 60, label: "60 Gün İçinde", count: 67 },
    { value: 90, label: "90 Gün İçinde", count: 89 },
  ];

  return (
    <div className="sidebar-shadow none-shadow mb-30">
      <div className="sidebar-filters">
        {/* Header */}
        <div className="filter-block head-border mb-30">
          <h5>
            Advance Filter
            <Link href="#" onClick={(e) => { e.preventDefault(); clearFilters(); }}>
              <span className="link-reset">Reset</span>
            </Link>
          </h5>
        </div>

        {/* Search Input */}
        <div className="filter-block mb-30">
          <div className="form-group select-style select-style-icon">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Arama yapın..."
              className="form-control form-icons"
            />
            <i className="fi-rr-marker" />
          </div>
        </div>

        {/* Scholarship Type Checkboxes */}
        <div className="filter-block mb-20">
          <h5 className="medium-heading mb-15">Burs Türü</h5>
          <div className="form-group">
            <ul className="list-checkbox">
              {scholarshipTypes.map((type) => (
                <li key={type.value}>
                  <label className="cb-container">
                    <input
                      type="checkbox"
                      checked={currentFilters.type.includes(type.value)}
                      onChange={() => handleTypeChange(type.value)}
                    />
                    <span className="text-small">{type.label}</span>
                    <span className="checkmark" />
                  </label>
                  <span className="number-item">{type.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Education Level Checkboxes */}
        <div className="filter-block mb-20">
          <h5 className="medium-heading mb-15">Eğitim Seviyesi</h5>
          <div className="form-group">
            <ul className="list-checkbox">
              {educationLevels.map((level) => (
                <li key={level.value}>
                  <label className="cb-container">
                    <input
                      type="checkbox"
                      checked={currentFilters.education_level.includes(level.value)}
                      onChange={() => handleEducationLevelChange(level.value)}
                    />
                    <span className="text-small">{level.label}</span>
                    <span className="checkmark" />
                  </label>
                  <span className="number-item">{level.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Amount Range */}
        <div className="filter-block mb-20">
          <h5 className="medium-heading mb-25">Burs Miktarı</h5>
          <div className="list-checkbox pb-20">
            <div className="row position-relative mt-10 mb-20">
              <div className="col-sm-12 box-slider-range">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-sm color-brand-1">
                    {currentFilters.min_amount.toLocaleString("tr-TR")} ₺
                  </span>
                  <span className="font-sm color-brand-1">
                    {currentFilters.max_amount.toLocaleString("tr-TR")} ₺
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25000"
                  step="100"
                  value={currentFilters.min_amount}
                  onChange={(e) => handleAmountChange("min_amount", parseInt(e.target.value))}
                  className="w-100"
                  style={{ height: "6px" }}
                />
                <input
                  type="range"
                  min="0"
                  max="25000"
                  step="100"
                  value={currentFilters.max_amount}
                  onChange={(e) => handleAmountChange("max_amount", parseInt(e.target.value))}
                  className="w-100 mt-2"
                  style={{ height: "6px" }}
                />
              </div>
            </div>
            <div className="box-number-money">
              <div className="row mt-30">
                <div className="col-sm-6 col-6">
                  <span className="font-sm color-brand-1">0 ₺</span>
                </div>
                <div className="col-sm-6 col-6 text-end">
                  <span className="font-sm color-brand-1">25,000 ₺</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Days Left Dropdown */}
        <div className="filter-block mb-30">
          <h5 className="medium-heading mb-10">Son Başvuru Tarihi</h5>
          <div className="form-group">
            <ul className="list-checkbox">
              {daysOptions.map((option) => (
                <li key={option.value === null ? "all" : option.value}>
                  <label className="cb-container">
                    <input
                      type="checkbox"
                      checked={currentFilters.days_left === option.value}
                      onChange={() => handleDaysLeftChange(option.value)}
                    />
                    <span className="text-small">{option.label}</span>
                    <span className="checkmark" />
                  </label>
                  <span className="number-item">{option.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipFilters;
