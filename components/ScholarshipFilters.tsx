"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export type FilterState = {
  search: string;
  type: string[];
  education_level: string[];
  organization: string[];
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
  const [organizations, setOrganizations] = useState<Array<{ value: string; label: string; count: number }>>([]);
  const [scholarshipTypes, setScholarshipTypes] = useState<Array<{ value: string; label: string; count: number }>>([
    { value: "akademik", label: "Akademik", count: 0 },
    { value: "engelli", label: "Engelli", count: 0 },
    { value: "ihtiyaç", label: "İhtiyaç", count: 0 },
  ]);
  const [educationLevels, setEducationLevels] = useState<Array<{ value: string; label: string; count: number }>>([
    { value: "lise", label: "Lise", count: 0 },
    { value: "lisans", label: "Lisans", count: 0 },
    { value: "yükseklisans", label: "Yüksek Lisans", count: 0 },
  ]);
  const [daysOptions, setDaysOptions] = useState<Array<{ value: number | null; label: string; count: number }>>([
    { value: null, label: "Tümü", count: 0 },
    { value: 30, label: "30 Gün İçinde", count: 0 },
    { value: 60, label: "60 Gün İçinde", count: 0 },
    { value: 90, label: "90 Gün İçinde", count: 0 },
  ]);

  // Sync localSearch with currentFilters.search when it changes externally
  useEffect(() => {
    setLocalSearch(currentFilters.search);
  }, [currentFilters.search]);

  // Debounce search input and update filters
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== currentFilters.search) {
        onFilterChange({
          ...currentFilters,
          search: localSearch,
        });
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  // Fetch organizations and filter options from API
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch all scholarships to get filter options
        const response = await fetch('/api/scholarships?page=1&limit=1000');
        if (!response.ok) return;
        
        const data = await response.json();
        const scholarships = data.data || [];

        // Extract unique organizations
        const orgMap = new Map<string, number>();
        scholarships.forEach((s: any) => {
          if (s.organization?.name) {
            const orgName = s.organization.name;
            orgMap.set(orgName, (orgMap.get(orgName) || 0) + 1);
          }
        });
        
        const orgs = Array.from(orgMap.entries())
          .map(([name, count]) => ({
            value: name,
            label: name,
            count: count
          }))
          .sort((a, b) => {
            // Türkçe karakterleri düzgün sıralamak için localeCompare kullan
            return a.label.localeCompare(b.label, 'tr', { sensitivity: 'base' });
          });
        
        setOrganizations(orgs);

        // Extract unique types
        const typeMap = new Map<string, number>();
        scholarships.forEach((s: any) => {
          if (s.type) {
            typeMap.set(s.type, (typeMap.get(s.type) || 0) + 1);
          }
        });
        
        const types = Array.from(typeMap.entries())
          .map(([value, count]) => ({
            value,
            label: value.charAt(0).toUpperCase() + value.slice(1),
            count
          }))
          .sort((a, b) => {
            // Alfabetik sıralama
            return a.label.localeCompare(b.label, 'tr', { sensitivity: 'base' });
          });
        
        setScholarshipTypes(types);

        // Extract unique education levels
        const levelMap = new Map<string, number>();
        scholarships.forEach((s: any) => {
          if (s.education_level) {
            levelMap.set(s.education_level, (levelMap.get(s.education_level) || 0) + 1);
          }
        });
        
        const levels = Array.from(levelMap.entries())
          .map(([value, count]) => ({
            value,
            label: value === 'yükseklisans' ? 'Yüksek Lisans' : value.charAt(0).toUpperCase() + value.slice(1),
            count
          }))
          .sort((a, b) => {
            // Eğitim seviyesine göre mantıksal sıralama: lise -> lisans -> yükseklisans -> doktora
            const order: { [key: string]: number } = {
              'lise': 1,
              'önlisans': 2,
              'lisans': 3,
              'yükseklisans': 4,
              'doktora': 5
            };
            const orderA = order[a.value.toLowerCase()] || 99;
            const orderB = order[b.value.toLowerCase()] || 99;
            return orderA - orderB;
          });
        
        setEducationLevels(levels);

        // Calculate days left counts
        const today = new Date();
        const counts = {
          all: scholarships.length,
          days30: 0,
          days60: 0,
          days90: 0,
        };

        scholarships.forEach((s: any) => {
          if (s.deadline) {
            const deadline = new Date(s.deadline);
            const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysLeft >= 0 && daysLeft <= 90) {
              counts.days90++;
              if (daysLeft <= 60) {
                counts.days60++;
                if (daysLeft <= 30) {
                  counts.days30++;
                }
              }
            }
          }
        });

        setDaysOptions([
          { value: null, label: "Tümü", count: counts.all },
          { value: 30, label: "30 Gün İçinde", count: counts.days30 },
          { value: 60, label: "60 Gün İçinde", count: counts.days60 },
          { value: 90, label: "90 Gün İçinde", count: counts.days90 },
        ]);

      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);

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

  const handleOrganizationChange = (org: string) => {
    const newOrgs = currentFilters.organization.includes(org)
      ? currentFilters.organization.filter((o) => o !== org)
      : [...currentFilters.organization, org];
    
    onFilterChange({
      ...currentFilters,
      organization: newOrgs,
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
      organization: [],
      min_amount: 0,
      max_amount: 25000,
      days_left: null,
    };
    setLocalSearch("");
    onFilterChange(clearedFilters);
  };

  return (
    <div className="card-grid-2 hover-up" style={{ padding: "30px", borderRadius: "16px" }}>
      <div className="sidebar-filters">
        {/* Header */}
        <div className="filter-block mb-30" style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: "20px" }}>
          <h5 className="font-lg" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 0 }}>
            <span style={{ fontWeight: "700", fontSize: "18px" }}>Gelişmiş Filtreler</span>
            <Link href="#" onClick={(e) => { e.preventDefault(); clearFilters(); }}>
              <span className="link-reset" style={{ fontSize: "14px", color: "#3b82f6" }}>Reset</span>
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
              style={{ 
                borderRadius: "12px",
                padding: "12px 16px 12px 45px",
                fontSize: "14px",
                border: "1px solid #e0e0e0"
              }}
            />
            <i className="fi-rr-marker" style={{ left: "16px" }} />
          </div>
        </div>

        {/* Scholarship Type Checkboxes */}
        <div className="filter-block mb-30">
          <h5 className="medium-heading mb-20" style={{ fontWeight: "700", fontSize: "16px" }}>Burs Türü</h5>
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
        <div className="filter-block mb-30">
          <h5 className="medium-heading mb-20" style={{ fontWeight: "700", fontSize: "16px" }}>Eğitim Seviyesi</h5>
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

        {/* Organization Checkboxes */}
        <div className="filter-block mb-30">
          <h5 className="medium-heading mb-20" style={{ fontWeight: "700", fontSize: "16px" }}>Kurum İsmi</h5>
          <div className="form-group">
            <ul className="list-checkbox">
              {organizations.map((org) => (
                <li key={org.value}>
                  <label className="cb-container">
                    <input
                      type="checkbox"
                      checked={currentFilters.organization.includes(org.value)}
                      onChange={() => handleOrganizationChange(org.value)}
                    />
                    <span className="text-small">{org.label}</span>
                    <span className="checkmark" />
                  </label>
                  <span className="number-item">{org.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Amount Range */}
        <div className="filter-block mb-30">
          <h5 className="medium-heading mb-20" style={{ fontWeight: "700", fontSize: "16px" }}>Burs Miktarı</h5>
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
          <h5 className="medium-heading mb-20" style={{ fontWeight: "700", fontSize: "16px" }}>Son Başvuru Tarihi</h5>
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
