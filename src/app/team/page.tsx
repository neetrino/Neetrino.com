import type { Metadata } from 'next';
import { TeamPage } from '../_components/team-page';
import { teamMessages } from '../_components/team-messages';

export const metadata: Metadata = {
  title: teamMessages.meta.pageTitle,
  description: teamMessages.meta.description,
};

export const revalidate = 300;

export default function Team(): React.JSX.Element {
  return <TeamPage />;
}
