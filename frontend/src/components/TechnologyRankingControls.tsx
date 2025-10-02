import React from 'react';

interface TechnologyRankingControlsProps {
  technologies: string[];
  selected: string;
  onChange: (technology: string) => void;
}

export const TechnologyRankingControls: React.FC<TechnologyRankingControlsProps> = ({
  technologies,
  selected,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  const isDisabled = technologies.length === 0;
  const selectId = 'technology-select';

  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
        Selecciona tecnología
      </label>
      <select
        id={selectId}
        name="technology"
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-100"
        value={selected}
        onChange={handleChange}
        disabled={isDisabled}
        aria-disabled={isDisabled}
      >
        {technologies.map((technology) => (
          <option key={technology} value={technology}>
            {technology}
          </option>
        ))}
      </select>
    </div>
  );
};
