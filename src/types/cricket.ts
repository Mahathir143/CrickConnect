export type MatchStatus = 
  | 'SCHEDULED' 
  | 'TOSS_DONE' 
  | 'INNINGS_1' 
  | 'INNINGS_BREAK' 
  | 'INNINGS_2' 
  | 'SUPER_OVER' 
  | 'CONCLUDED';

export type ExtraType = 'NONE' | 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE' | 'PENALTY';

export type DismissalType = 
  | 'BOWLED' 
  | 'CAUGHT' 
  | 'LBW' 
  | 'RUN_OUT' 
  | 'STUMPED' 
  | 'HIT_WICKET' 
  | 'OBSTRUCTING_FIELD' 
  | 'RETIRED_HURT' 
  | 'RETIRED_OUT' 
  | 'TIMED_OUT' 
  | 'DOUBLE_HIT';

export interface Player {
  id: string;
  name: string;
  jerseyNumber: number;
  role: 'BATTER' | 'BOWLER' | 'ALL_ROUNDER' | 'WICKET_KEEPER';
  battingStyle: 'RIGHT_HAND' | 'LEFT_HAND';
  bowlingStyle?: 'RIGHT_ARM_FAST' | 'LEFT_ARM_FAST' | 'RIGHT_ARM_SPIN' | 'LEFT_ARM_SPIN';
  photoUrl?: string;
}

export interface Team {
  id: string;
  name: string;
  shortCode: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  registrationSource: 'MANAGEMENT' | 'PUBLIC_LINK';
  squad: Player[];
}

export interface BatterStats {
  id: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  dismissalInfo?: string;
}

export interface BowlerStats {
  id: string;
  name: string;
  legalBalls: number; // total legal balls bowled
  maidens: number;
  runsConceded: number;
  wickets: number;
  extrasConceded: number;
}

export interface MatchBallEvent {
  id: string;
  matchId: string;
  inningsNo: 1 | 2;
  overIndex: number;
  ballInOver: number;
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
  batsmanRuns: number;
  extraType: ExtraType;
  extraRuns: number;
  isLegalDelivery: boolean;
  isFreeHit: boolean;
  isWicket: boolean;
  dismissal?: {
    type: DismissalType;
    dismissedPlayerId: string;
    fielderId?: string;
    runsCompletedBeforeOut: number;
  };
  displayBadge: string;
  commentary: string;
  timestamp: number;
}

export interface LiveMatchSnapshot {
  matchId: string;
  tournamentName: string;
  status: MatchStatus;
  currentInnings: 1 | 2;
  totalOvers: number;
  maxOversPerBowler: number;
  battingTeam: {
    id: string;
    name: string;
    shortCode: string;
    logoUrl: string;
    primaryColor: string;
    score: number;
    wickets: number;
    oversCompleted: number;
    ballsThisOver: number;
  };
  bowlingTeam: {
    id: string;
    name: string;
    shortCode: string;
    logoUrl: string;
  };
  striker: BatterStats;
  nonStriker: BatterStats;
  currentBowler: BowlerStats;
  previousBowlerId?: string;
  isFreeHit: boolean;
  target?: number;
  ballsRemaining?: number;
  runsNeeded?: number;
  crr: number;
  rrr?: number;
  currentOverDeliveries: Array<{
    badge: string;
    isWicket: boolean;
    isBoundary: boolean;
    isExtra: boolean;
  }>;
  partnershipRuns: number;
  partnershipBalls: number;
  overlayState: OverlayState;
}

export type OverlayTheme = 'neon' | 'sky' | 'retro';

export interface OverlayState {
  isLowerThirdVisible: boolean;
  activeCard: 'NONE' | 'BATTER' | 'BOWLER' | 'PARTNERSHIP' | 'FULL_SCORECARD';
  activeAlert: 'NONE' | 'FOUR' | 'SIX' | 'WICKET' | 'FREE_HIT' | 'FIFTY' | 'CENTURY';
  reviewBanner: 'NONE' | 'IN_PROGRESS' | 'OUT' | 'NOT_OUT';
  sponsorBugVisible: boolean;
  theme: OverlayTheme;
  token?: string;
}

export interface TournamentStanding {
  teamId: string;
  teamName: string;
  shortCode: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  points: number;
  runsScored: number;
  oversFaced: number;
  runsConceded: number;
  oversBowled: number;
  nrr: number;
}
