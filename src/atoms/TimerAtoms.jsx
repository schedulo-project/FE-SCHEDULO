import { atom } from "jotai";

// 타이머 설정 상태 (테스트를 위해 짧게 설정)
export const workTimeAtom = atom(5); // 작업 시간(분) - 테스트를 위해 1분으로 설정
export const breakTimeAtom = atom(5); // 휴식 시간(분) - 테스트를 위해 1분으로 설정
export const totalCyclesAtom = atom(3); // 총 사이클 수

// 타이머 실행 상태
export const timeLeftAtom = atom(1 * 60); // 남은 시간(초) - 테스트를 위해 1분으로 설정
export const isActiveAtom = atom(false); // 타이머 실행 중 여부
export const isWorkAtom = atom(true); // 작업 시간 vs 휴식 시간
export const cyclesAtom = atom(0); // 완료한 사이클 수 (작업 시간 + 휴식 시간 = 1 사이클)
export const completedWorkSessionsAtom = atom(0); // 완료한 작업 세션 수
export const isCompletedAtom = atom(false); // 모든 사이클 완료 여부
export const appStateAtom = atom("setup"); // 'setup' 또는 'timer'

// 마지막 업데이트 시간을 저장하기 위한 atom
export const lastUpdatedAtom = atom(Date.now());
