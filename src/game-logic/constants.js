export const GAME_STATES = {
    IDLE: 'IDLE',
    CASTING: 'CASTING',
    WAITING: 'WAITING',
    HOOKED: 'HOOKED',
    REELING: 'REELING',
    CAUGHT: 'CAUGHT',
    LOST: 'LOST',
};

export const FISHING_CONFIG = {
    CAST_DURATION: 1000, // ms
    MIN_WAIT_TIME: 4000,
    MAX_WAIT_TIME: 8000,
    REEL_TENSION_LIMIT: 100,
    REEL_DEPLETION_RATE: 10,
    REEL_RECOVERY_RATE: 5,
    HOOK_TIMEOUT: 4000, // ms player has to click after hook
};
