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
    <div className="mb-6 flex flex-col gap-2 rounded-2xl border border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-surface))] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <label htmlFor={selectId} className="text-sm font-medium text-[rgb(var(--text-primary))]">
        Selecciona tecnología
      </label>
      <select
        id={selectId}
        name="technology"
        className="focus-ring rounded-lg border border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-surface))] px-3 py-2 text-sm text-[rgb(var(--text-primary))] shadow-sm transition hover:border-sky-300 disabled:cursor-not-allowed disabled:bg-[rgb(var(--bg-subtle))]"
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
