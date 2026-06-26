import React from 'react';
import { Stat } from './Stat/Stat';
import type { StatItem } from './Stat/Stat';
import { CollectionStatsWrapper } from './StyledWrapper';

interface CollectionStatsProps {
  stats: StatItem[];
}

export const CollectionStats: React.FC<CollectionStatsProps> = ({ stats }) => (
  <CollectionStatsWrapper className="collection-stats">
    {stats.map((stat, index) => (
      <Stat key={`${stat.label}-${index}`} label={stat.label} value={stat.value} testId="collection-stats-stat" />
    ))}
  </CollectionStatsWrapper>
);

export default CollectionStats;
