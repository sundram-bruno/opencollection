import React from 'react';
import { getMethodColorVar } from '../../../theme/methodColors';
import { StyledWrapper } from './StyledWrapper';

/** Compact chip labels for the longer method names; others show the method as-is. */
const CHIP_LABELS: Record<string, string> = { DELETE: 'DEL', OPTIONS: 'OPT' };

interface MethodChipsProps {
  /** Canonical methods present in the collection, in display order. */
  methods: string[];
  /** Canonical methods currently active (e.g. {'GET','DELETE'}). */
  active: ReadonlySet<string>;
  /** Toggle a canonical method on/off. */
  onToggle: (method: string) => void;
  testId?: string;
}

/** Method filter toggles for the search palette, one chip per method present in
 * the collection. Local to the palette, never written to the shared search
 * slice. Overflows to a horizontal scroll when the chips exceed the row. */
export const MethodChips: React.FC<MethodChipsProps> = ({
  methods,
  active,
  onToggle,
  testId = 'search-method-chips',
}) => (
  <StyledWrapper data-testid={testId}>
    {methods.map((method) => (
      <button
        key={method}
        type="button"
        className="method-chip"
        aria-pressed={active.has(method)}
        style={{ ['--chip-color' as string]: getMethodColorVar(method) }}
        onClick={() => onToggle(method)}
      >
        {CHIP_LABELS[method] ?? method}
      </button>
    ))}
  </StyledWrapper>
);

export default MethodChips;
