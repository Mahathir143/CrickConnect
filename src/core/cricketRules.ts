import { LiveMatchSnapshot, MatchBallEvent, DismissalType, ExtraType, FallOfWicket } from '../types/cricket';

export function calculateCRR(totalRuns: number, legalBalls: number): number {
  if (legalBalls === 0) return 0;
  const overs = legalBalls / 6;
  return Number((totalRuns / overs).toFixed(2));
}

export function calculateRRR(runsNeeded: number, ballsRemaining: number): number {
  if (ballsRemaining <= 0) return 0;
  const overs = ballsRemaining / 6;
  return Number((runsNeeded / overs).toFixed(2));
}

export function formatOvers(legalBalls: number): string {
  const overs = Math.floor(legalBalls / 6);
  const balls = legalBalls % 6;
  return `${overs}.${balls}`;
}

export function computeNRR(
  runsScored: number,
  oversFaced: number,
  runsConceded: number,
  oversBowled: number
): number {
  const battingRate = oversFaced > 0 ? runsScored / oversFaced : 0;
  const bowlingRate = oversBowled > 0 ? runsConceded / oversBowled : 0;
  return Number((battingRate - bowlingRate).toFixed(3));
}

export function createInitialSnapshot(): LiveMatchSnapshot {
  return {
    matchId: 'mt_2026_csk_vs_mi',
    tournamentName: 'Pvs Cricket Trophy 2026',
    status: 'INNINGS_1',
    currentInnings: 1,
    totalOvers: 14,
    maxOversPerBowler: 3,
    tossDetails: 'Team A • Bat',
    battingTeam: {
      id: 'tm_csk',
      name: 'Super Kings',
      shortCode: 'CSK',
      logoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=128&auto=format&fit=crop&q=80',
      primaryColor: '#f59e0b',
      score: 112,
      wickets: 3,
      oversCompleted: 12,
      ballsThisOver: 4,
      totalFours: 9,
      totalSixes: 4,
    },
    bowlingTeam: {
      id: 'tm_mi',
      name: 'Mumbai Champions',
      shortCode: 'MI',
      logoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=128&auto=format&fit=crop&q=80',
      primaryColor: '#3b82f6',
    },
    striker: {
      id: 'pl_01',
      name: 'R. Sharma',
      runs: 48,
      balls: 28,
      fours: 4,
      sixes: 3,
      isOut: false,
    },
    nonStriker: {
      id: 'pl_02',
      name: 'V. Kohli',
      runs: 34,
      balls: 22,
      fours: 3,
      sixes: 1,
      isOut: false,
    },
    currentBowler: {
      id: 'bw_01',
      name: 'M. Shami',
      legalBalls: 16, // 2.4 overs
      maidens: 0,
      runsConceded: 22,
      wickets: 2,
      extrasConceded: 1,
    },
    previousBowlerId: 'bw_02',
    isFreeHit: false,
    target: 113,
    runsNeeded: 1,
    ballsRemaining: 8,
    crr: 8.84,
    rrr: 0.75,
    currentOverDeliveries: [
      { badge: '1', isWicket: false, isBoundary: false, isExtra: false },
      { badge: '4', isWicket: false, isBoundary: true, isExtra: false },
      { badge: 'W', isWicket: true, isBoundary: false, isExtra: false },
      { badge: '0', isWicket: false, isBoundary: false, isExtra: false },
    ],
    partnershipRuns: 28,
    partnershipBalls: 16,
    fallOfWickets: [
      { wicketNumber: 1, score: 32, over: '3.2', playerOut: 'D. Conway' },
      { wicketNumber: 2, score: 68, over: '7.4', playerOut: 'S. Dube' },
      { wicketNumber: 3, score: 84, over: '10.1', playerOut: 'A. Rahane' },
    ],
    momPlayer: 'R. Sharma',
    overlayState: {
      isBottomScorebarEnabled: true,
      isLowerThirdVisible: true,
      activePopup: 'NONE',
      activeCard: 'NONE',
      activeAlert: 'NONE',
      reviewBanner: 'NONE',
      sponsorBugVisible: false,
      theme: 'neon',
      customBannerText: '',
      tvLogo: {
        enabled: true,
        text: 'CRICKCONNECT',
        subText: 'LIVE HD',
      },
      autoAnimationEnabled: true,
      isPowerplayActive: false,
    },
    innings1Total: {
      score: 112,
      wickets: 10,
      legalBalls: 84, // 14 overs
    },
  };
}

export interface BallInputParams {
  batsmanRuns: number;
  extraType: ExtraType;
  extraRuns: number;
  isWicket: boolean;
  dismissalType?: DismissalType;
  dismissedPlayerId?: string;
  fielderName?: string;
  newBatterName?: string;
}

/**
 * Pure state reducer applying ICC rules to produce the next match snapshot
 */
export function applyBallEvent(
  prev: LiveMatchSnapshot,
  params: BallInputParams
): { nextSnapshot: LiveMatchSnapshot; event: MatchBallEvent; overCompleted: boolean } {
  // Mankad does not count as legal ball
  const isMankad = params.dismissalType === 'MANKAD';
  const isLegal = params.extraType !== 'WIDE' && params.extraType !== 'NO_BALL' && !isMankad;
  const totalRunsThisBall = params.batsmanRuns + params.extraRuns;
  
  // Clone state
  const next: LiveMatchSnapshot = JSON.parse(JSON.stringify(prev));

  // 1. Update team score
  next.battingTeam.score += totalRunsThisBall;

  // 2. Update legal deliveries count
  let overCompleted = false;
  if (isLegal) {
    if (next.battingTeam.ballsThisOver === 5) {
      next.battingTeam.oversCompleted += 1;
      next.battingTeam.ballsThisOver = 0;
      overCompleted = true;
    } else {
      next.battingTeam.ballsThisOver += 1;
    }
    next.currentBowler.legalBalls += 1;
  }

  // 3. Update Bowler Runs & Extras
  if (params.extraType !== 'BYE' && params.extraType !== 'LEG_BYE') {
    next.currentBowler.runsConceded += totalRunsThisBall;
  }
  if (params.extraType !== 'NONE') {
    next.currentBowler.extrasConceded += params.extraRuns;
  }

  // 4. Update Batter Stats
  if (params.extraType !== 'WIDE' && !isMankad) {
    next.striker.balls += 1;
  }
  next.striker.runs += params.batsmanRuns;
  if (params.batsmanRuns === 4) {
    next.striker.fours += 1;
    next.battingTeam.totalFours = (next.battingTeam.totalFours || 0) + 1;
  }
  if (params.batsmanRuns === 6) {
    next.striker.sixes += 1;
    next.battingTeam.totalSixes = (next.battingTeam.totalSixes || 0) + 1;
  }

  // 5. Update Partnership
  next.partnershipRuns += totalRunsThisBall;
  if (isLegal) next.partnershipBalls += 1;

  // 6. Handle Wickets & ICC 2022 Caught Rule
  if (params.isWicket) {
    next.battingTeam.wickets += 1;
    if (params.dismissalType !== 'RUN_OUT_STRIKER' && params.dismissalType !== 'RUN_OUT_NON_STRIKER' && !isMankad) {
      next.currentBowler.wickets += 1;
    }

    const currentOverStr = `${next.battingTeam.oversCompleted}.${next.battingTeam.ballsThisOver}`;
    const outPlayerName = params.dismissedPlayerId === next.nonStriker.id || params.dismissalType === 'RUN_OUT_NON_STRIKER' || isMankad
      ? next.nonStriker.name
      : next.striker.name;

    const newFow: FallOfWicket = {
      wicketNumber: next.battingTeam.wickets,
      score: next.battingTeam.score,
      over: currentOverStr,
      playerOut: outPlayerName,
    };
    next.fallOfWickets = [...(next.fallOfWickets || []), newFow];

    next.partnershipRuns = 0;
    next.partnershipBalls = 0;

    const incomingName = params.newBatterName || `Batter #${next.battingTeam.wickets + 2}`;

    if (params.dismissalType === 'CAUGHT') {
      // ICC Rule 18.11 (Oct 2022): Incoming batter ALWAYS assumes strike
      next.striker = {
        id: `pl_${Date.now()}`,
        name: incomingName,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false,
      };
    } else if (params.dismissedPlayerId === next.nonStriker.id || params.dismissalType === 'RUN_OUT_NON_STRIKER' || isMankad) {
      next.nonStriker = {
        id: `pl_${Date.now()}`,
        name: incomingName,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false,
      };
    } else {
      next.striker = {
        id: `pl_${Date.now()}`,
        name: incomingName,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false,
      };
    }
  }

  // 7. Free Hit State Engine
  if (params.extraType === 'NO_BALL') {
    next.isFreeHit = true;
  } else if (isLegal) {
    next.isFreeHit = false;
  }

  // 8. Strike Rotation
  if (params.batsmanRuns % 2 !== 0 && !params.isWicket) {
    const temp = next.striker;
    next.striker = next.nonStriker;
    next.nonStriker = temp;
  }

  // End of over: 6 legal balls rotates strike again
  if (overCompleted) {
    const temp = next.striker;
    next.striker = next.nonStriker;
    next.nonStriker = temp;
    next.previousBowlerId = next.currentBowler.id;
  }

  // 9. Delivery Badge Display
  let badge = `${params.batsmanRuns}`;
  if (params.isWicket) {
    badge = 'W';
  } else if (params.extraType === 'WIDE') {
    badge = params.extraRuns > 1 ? `Wd+${params.extraRuns - 1}` : 'Wd';
  } else if (params.extraType === 'NO_BALL') {
    badge = params.batsmanRuns > 0 ? `Nb+${params.batsmanRuns}` : 'Nb';
  } else if (params.extraType === 'BYE') {
    badge = `B${params.extraRuns}`;
  } else if (params.extraType === 'LEG_BYE') {
    badge = `Lb${params.extraRuns}`;
  } else if (params.batsmanRuns === 0) {
    badge = '•';
  }

  if (overCompleted && next.battingTeam.ballsThisOver === 0) {
    next.currentOverDeliveries = [];
  } else {
    next.currentOverDeliveries.push({
      badge,
      isWicket: params.isWicket,
      isBoundary: params.batsmanRuns === 4 || params.batsmanRuns === 6,
      isExtra: params.extraType !== 'NONE',
    });
  }

  // 10. Update Rates
  const totalLegalBalls = next.battingTeam.oversCompleted * 6 + next.battingTeam.ballsThisOver;
  next.crr = calculateCRR(next.battingTeam.score, totalLegalBalls);
  if (next.target) {
    next.runsNeeded = Math.max(0, next.target - next.battingTeam.score);
    next.ballsRemaining = Math.max(0, next.totalOvers * 6 - totalLegalBalls);
    next.rrr = calculateRRR(next.runsNeeded, next.ballsRemaining);
  }

  // Construct immutable event log
  const event: MatchBallEvent = {
    id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    matchId: next.matchId,
    inningsNo: next.currentInnings,
    overIndex: next.battingTeam.oversCompleted,
    ballInOver: next.battingTeam.ballsThisOver,
    strikerId: prev.striker.id,
    nonStrikerId: prev.nonStriker.id,
    bowlerId: prev.currentBowler.id,
    batsmanRuns: params.batsmanRuns,
    extraType: params.extraType,
    extraRuns: params.extraRuns,
    isLegalDelivery: isLegal,
    isFreeHit: prev.isFreeHit,
    isWicket: params.isWicket,
    displayBadge: badge,
    commentary: `${prev.currentBowler.name} to ${prev.striker.name}, ${badge}`,
    timestamp: Date.now(),
  };

  return { nextSnapshot: next, event, overCompleted };
}

/**
 * Emergency match adjustments directly updating score, wickets, or overs
 */
export function applyEmergencyAdjustment(
  snapshot: LiveMatchSnapshot,
  adjustments: {
    inning1Runs?: number;
    inning1Wickets?: number;
    inning1Balls?: number;
    inning2Runs?: number;
    inning2Wickets?: number;
    inning2Balls?: number;
  }
): LiveMatchSnapshot {
  const next: LiveMatchSnapshot = JSON.parse(JSON.stringify(snapshot));

  if (adjustments.inning1Runs !== undefined) {
    if (!next.innings1Total) {
      next.innings1Total = { score: adjustments.inning1Runs, wickets: 0, legalBalls: 0 };
    }
    next.innings1Total.score = adjustments.inning1Runs;
    // Target is Inning 1 runs + 1
    next.target = adjustments.inning1Runs + 1;
  }
  if (adjustments.inning1Wickets !== undefined && next.innings1Total) {
    next.innings1Total.wickets = adjustments.inning1Wickets;
  }
  if (adjustments.inning1Balls !== undefined && next.innings1Total) {
    next.innings1Total.legalBalls = adjustments.inning1Balls;
  }

  // If current innings is 1 and adjusting inning 1
  if (next.currentInnings === 1) {
    if (adjustments.inning1Runs !== undefined) next.battingTeam.score = adjustments.inning1Runs;
    if (adjustments.inning1Wickets !== undefined) next.battingTeam.wickets = adjustments.inning1Wickets;
    if (adjustments.inning1Balls !== undefined) {
      next.battingTeam.oversCompleted = Math.floor(adjustments.inning1Balls / 6);
      next.battingTeam.ballsThisOver = adjustments.inning1Balls % 6;
    }
  }

  // If adjusting inning 2
  if (next.currentInnings === 2) {
    if (adjustments.inning2Runs !== undefined) next.battingTeam.score = adjustments.inning2Runs;
    if (adjustments.inning2Wickets !== undefined) next.battingTeam.wickets = adjustments.inning2Wickets;
    if (adjustments.inning2Balls !== undefined) {
      next.battingTeam.oversCompleted = Math.floor(adjustments.inning2Balls / 6);
      next.battingTeam.ballsThisOver = adjustments.inning2Balls % 6;
    }
  }

  const totalLegalBalls = next.battingTeam.oversCompleted * 6 + next.battingTeam.ballsThisOver;
  next.crr = calculateCRR(next.battingTeam.score, totalLegalBalls);
  if (next.target) {
    next.runsNeeded = Math.max(0, next.target - next.battingTeam.score);
    next.ballsRemaining = Math.max(0, next.totalOvers * 6 - totalLegalBalls);
    next.rrr = calculateRRR(next.runsNeeded, next.ballsRemaining);
  }

  return next;
}
