import { createContext, ReactNode, useContext } from 'react';
import type { TravelMember } from '../lib/travelMembers';

const TravelMemberContext = createContext<TravelMember | null>(null);

export function TravelMemberProvider({ member, children }: { member: TravelMember; children: ReactNode }) {
  return <TravelMemberContext.Provider value={member}>{children}</TravelMemberContext.Provider>;
}

export function useCurrentTravelMember() {
  const member = useContext(TravelMemberContext);
  if (!member) throw new Error('Travel member is not available outside AuthGate.');
  return member;
}

