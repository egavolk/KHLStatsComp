export const SET_LEFT_TEAM = 'SET_LEFT_TEAM';
export const SET_RIGHT_TEAM = 'SET_RIGHT_TEAM';
export const SET_LEFT_INPUT = 'SET_LEFT_INPUT';
export const SET_RIGHT_INPUT = 'SET_RIGHT_INPUT';

export const setLeftTeam = item => ({
    type: SET_LEFT_TEAM,
    payload: { item }
});

export const setRightTeam = item => ({
    type: SET_RIGHT_TEAM,
    payload: { item }
});

export const setLeftInput = item => ({
    type: SET_LEFT_INPUT,
    payload: { item }
});

export const setRightInput = item => ({
    type: SET_RIGHT_INPUT,
    payload: { item }
});