import React, { useState, useRef, useEffect } from 'react';

const wrapperStyle = { position: 'relative' };
const inputStyle = {
  width: '100%', padding: '0.5rem 0.8rem', border: '1px solid #ddd', borderRadius: 8,
  fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box',
};
const dropdownStyle = {
  position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff',
  border: '1px solid #ddd', borderRadius: 8, maxHeight: 200, overflowY: 'auto',
  zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};
const itemStyle = (highlighted) => ({
  padding: '0.5rem 0.8rem', cursor: 'pointer', fontSize: '0.85rem',
  background: highlighted ? '#e8eaf6' : '#fff',
});

const SearchableSelect = ({ employees, value, onChange, placeholder }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const ref = useRef(null);

  const selected = employees.find((e) => e._id === value);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = employees.filter((e) =>
    `${e.firstName} ${e.lastName}`.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (emp) => {
    onChange(emp._id);
    setQuery(`${emp.firstName} ${emp.lastName}`);
    setOpen(false);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setOpen(true);
    setHighlightIdx(-1);
    if (!e.target.value) onChange('');
  };

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIdx((prev) => Math.min(prev + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIdx((prev) => Math.max(prev - 1, 0)); }
    if (e.key === 'Enter' && highlightIdx >= 0) { e.preventDefault(); handleSelect(filtered[highlightIdx]); }
    if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div ref={ref} style={wrapperStyle}>
      <input
        placeholder={placeholder || 'Type to search...'}
        value={selected && !open ? `${selected.firstName} ${selected.lastName}` : query}
        onChange={handleInputChange}
        onFocus={() => { setOpen(true); setQuery(''); }}
        style={inputStyle}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      {open && (
        <div style={dropdownStyle}>
          {filtered.length === 0 ? (
            <div style={{ padding: '0.5rem 0.8rem', color: '#888', fontSize: '0.85rem' }}>No matches</div>
          ) : (
            filtered.map((emp, i) => (
              <div key={emp._id} style={itemStyle(i === highlightIdx)} onClick={() => handleSelect(emp)}
                onMouseEnter={() => setHighlightIdx(i)}>
                {emp.firstName} {emp.lastName} <span style={{ color: '#888', fontSize: '0.75rem' }}>({emp.department})</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
