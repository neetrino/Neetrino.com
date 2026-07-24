'use client';

import { ComingSoonPanel } from './coming-soon-panel';
import { useHomeI18n } from './home-i18n-provider';
import { NeetrinoPageShell } from './neetrino-page-shell';
import './team.css';

export function TeamPage(): React.JSX.Element {
  const { teamCopy } = useHomeI18n();
  const label = `${teamCopy.comingSoon.line1} ${teamCopy.comingSoon.line2}`;

  return (
    <NeetrinoPageShell mainId="team-top" srOnlyTitle={teamCopy.srOnlyTitle}>
      <section className="team-page" aria-label={label}>
        <div className="team-page-inner">
          <ComingSoonPanel label={teamCopy.comingSoon} />
        </div>
      </section>
    </NeetrinoPageShell>
  );
}
