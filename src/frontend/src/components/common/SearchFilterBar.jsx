import { useId, useState } from "react";
import { Filter, Search } from "lucide-react";
import "./SearchFilterBar.css";

export default function SearchFilterBar({
  value,
  onChange,
  placeholder,
  searchLabel,
  toggleText = "",
  ToggleIcon = Filter,
  onClear,
  children,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersId = useId();

  return (
    <div className="search-filter-bar">
      <form className="search-filter-bar__search" onSubmit={(event) => event.preventDefault()}>
        <Search size={18} aria-hidden="true" />
        <input
          aria-label={searchLabel}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {value && (
          <button
            className="search-filter-bar__clear"
            type="button"
            aria-label="Xóa nội dung tìm kiếm"
            onClick={() => (onClear ? onClear() : onChange(""))}
          >
            
          </button>
        )}
        <button
          className={`search-filter-bar__toggle${filtersOpen ? " is-open" : ""}`}
          type="button"
          aria-label={toggleText || "Lọc"}
          aria-expanded={filtersOpen}
          aria-controls={filtersId}
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <ToggleIcon
            className="search-filter-bar__toggle-icon"
            size={17}
            strokeWidth={2.8}
            aria-hidden="true"
          />
          {toggleText && <span>{toggleText}</span>}
        </button>
      </form>
      {filtersOpen && (
        <div className="search-filter-bar__filters" id={filtersId}>
          <span className="search-filter-bar__divider" aria-hidden="true" />
          {children}
        </div>
      )}
    </div>
  );
}
