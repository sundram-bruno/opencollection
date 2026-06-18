import React from 'react';
import { getMethodColorVar } from '../../../theme/methodColors';
import { ChipRow } from './StyledWrapper';

/** The methods offered as filter chips. `label` is the chip text, `method` the
 * canonical value matched against a request's method (DEL → DELETE). */
const CHIPS: Array<{ label: string; method: string }> = [
  { label: 'GET', method: 'GET' },
  { label: 'POST', method: 'POST' },
  { label: 'PUT', method: 'PUT' },
  { label: 'DEL', method: 'DELETE' },
];

export interface MethodChipsProps {
  /** Canonical methods currently active (e.g. {'GET','DELETE'}). */
  active: ReadonlySet<string>;
  /** Toggle a canonical method on/off. */
  onToggle: (method: string) => void;
}

/** Method filter toggles for the search palette. Local to the modal — never
 * written to the shared search slice. */
export const MethodChips: React.FC<MethodChipsProps> = ({ active, onToggle }) => (
  <ChipRow>
    {CHIPS.map(({ label, method }) => (
      <button
        key={method}
        type="button"
        className="oc-method-chip"
        aria-pressed={active.has(method)}
        style={{ ['--chip-color' as string]: getMethodColorVar(method) }}
        onClick={() => onToggle(method)}
      >
        {label}
      </button>
    ))}
  </ChipRow>
);

export default MethodChips;
