import { atom } from "jotai";

// 타이머 설정 상태
export const workTimeAtom = atom(25); // 작업 시간(분)
export const breakTimeAtom = atom(5); // 휴식 시간(분)
export const totalCyclesAtom = atom(4); // 총 사이클 수

// 타이머 실행 상태
export const timeLeftAtom = atom(25 * 60); // 남은 시간(초)
export const isActiveAtom = atom(false); // 타이머 실행 중 여부
export const isWorkAtom = atom(true); // 작업 시간 vs 휴식 시간
export const cyclesAtom = atom(0); // 완료한 사이클 수
export const isCompletedAtom = atom(false); // 모든 사이클 완료 여부
export const appStateAtom = atom("setup"); // 'setup' 또는 'timer'

// 타이머 실행 시작 시간을 저장하기 위한 atom
export const timerStartTimeAtom = atom(null);

// 타이머 일시정지 시 남은 시간을 저장하는 atom
export const pausedTimeLeftAtom = atom(null);

// 마지막 업데이트 시간을 저장하기 위한 atom
export const lastUpdatedAtom = atom(Date.now());
