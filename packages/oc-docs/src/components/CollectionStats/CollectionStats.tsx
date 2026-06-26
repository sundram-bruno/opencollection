import React from 'react';
import { Stat } from './Stat/Stat';
import type { StatItem } from './Stat/Stat';
import { StyledWrapper } from './StyledWrapper';

interface CollectionStatsProps {
  stats: StatItem[];
}

export const CollectionStats: React.FC<CollectionStatsProps> = ({ stats }) => (
  <StyledWrapper className="collection-stats">
    {stats.map((stat, index) => (
      <Stat key={`${stat.label}-${index}`} label={stat.label} value={stat.value} testId="collection-stats-stat" />
    ))}
  </StyledWrapper>
);

export default CollectionStats;
