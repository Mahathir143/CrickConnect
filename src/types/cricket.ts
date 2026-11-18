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
  | 'RUN_OUT_STRIKER' 
  | 'RUN_OUT_NON_STRIKER' 
  | 'STUMPED' 
  | 'HIT_WICKET' 
  | 'MANKAD' 
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
  legalBalls: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  extrasConceded: number;
}

export interface FallOfWicket {
  wicketNumber: number;
  score: number;
  over: string;
  playerOut: string;
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

export type OverlayPopupType = 
  | 'NONE'
  | 'B1'
  | 'B2'
  | 'BOWLER'
  | 'TARGET'
  | 'SUMMARY'
  | 'PARTNERSHIP'
  | 'FOW'
  | 'TEAMS_PLAYERS'
  | 'CUSTOM_TEXT'
  | 'MOM'
  | 'TOUR_NAME'
  | 'POINTS_TABLE'
  | 'TOP_BATTERS'
  | 'TOP_BOWLERS'
  | 'MINI_SCORE'
  | 'POWERPLAY'
  | 'I1BAT'
  | 'I1BALL'
  | 'I2BAT'
  | 'I2BALL';

export type OverlayTheme = 'neon' | 'sky' | 'retro';

export interface OverlayState {
  isBottomScorebarEnabled: boolean; // Controls whether bottom scoreboard is shown or removed
  isLowerThirdVisible?: boolean;     // Backward compatibility alias
  activePopup: OverlayPopupType;    // Mutually exclusive: only one popup shows at a time!
  activeCard?: string;              // Backward compatibility alias
  activeAlert: 'NONE' | 'FOUR' | 'SIX' | 'WICKET' | 'FREE_HIT' | 'FIFTY' | 'CENTURY' | 'HAT_TRICK';
  reviewBanner: 'NONE' | 'IN_PROGRESS' | 'OUT' | 'NOT_OUT';
  sponsorBugVisible: boolean;
  theme: OverlayTheme;
  token?: string;
  customBannerText?: string;
  tvLogo: {
    enabled: boolean;
    text: string;
    subText?: string;
    imageUrl?: string;
  };
  autoAnimationEnabled: boolean;
  isPowerplayActive: boolean;
}

export interface LiveMatchSnapshot {
  matchId: string;
  tournamentName: string;
  status: MatchStatus;
  currentInnings: 1 | 2;
  totalOvers: number;
  maxOversPerBowler: number;
  tossDetails?: string;
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
    totalFours: number;
    totalSixes: number;
  };
  bowlingTeam: {
    id: string;
    name: string;
    shortCode: string;
    logoUrl: string;
    primaryColor?: string;
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
  fallOfWickets: FallOfWicket[];
  momPlayer?: string;
  overlayState: OverlayState;
  innings1Total?: {
    score: number;
    wickets: number;
    legalBalls: number;
  };
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
