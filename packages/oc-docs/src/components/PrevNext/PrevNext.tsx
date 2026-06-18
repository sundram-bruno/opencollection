import React from 'react';
import { Link } from 'react-router-dom';
import type { SeqNeighbor } from '../../routing/types';
import { getMethodColorVar } from '../../theme/methodColors';
import { PrevNextWrapper } from './StyledWrapper';

const toPath = (slug: string) => `/${slug}`;

const MethodTag: React.FC<{ method?: string }> = ({ method }) =>
  method ? (
    <span className="oc-prevnext__method" style={{ color: getMethodColorVar(method) }}>
      {method.toUpperCase()}
    </span>
  ) : null;

/**
 * Prev/Next pagination (BRU-3188). Walks the collection hierarchy + seq order
 * (sequence built in navModel). Both cards share anatomy; only alignment flips,
 * and the method badge mirrors (before the name on Previous, after on Next).
 */
const Card: React.FC<{ dir: 'prev' | 'next'; neighbor: SeqNeighbor }> = ({ dir, neighbor }) => (
  <Link
    to={toPath(neighbor.slug)}
    className={`oc-prevnext__card${dir === 'next' ? ' oc-prevnext__card--next' : ''}`}
    data-testid={`${dir}-link`}
  >
    <span className="oc-prevnext__label">{dir === 'prev' ? '‹ Previous' : 'Next ›'}</span>
    <span className="oc-prevnext__name">
      {dir === 'prev' ? (
        <>
          <MethodTag method={neighbor.method} />
          {neighbor.name}
        </>
      ) : (
        <>
          {neighbor.name}
          <MethodTag method={neighbor.method} />
        </>
      )}
    </span>
  </Link>
);

export interface PrevNextProps {
  prev?: SeqNeighbor;
  next?: SeqNeighbor;
}

const PrevNext: React.FC<PrevNextProps> = ({ prev, next }) => {
  if (!prev && !next) return null;
  return (
    <PrevNextWrapper className="oc-prevnext" aria-label="Pagination" data-testid="prevnext">
      <div className="oc-prevnext__half">{prev && <Card dir="prev" neighbor={prev} />}</div>
      <div className="oc-prevnext__half oc-prevnext__half--next">
        {next && <Card dir="next" neighbor={next} />}
      </div>
    </PrevNextWrapper>
  );
};

export default PrevNext;
