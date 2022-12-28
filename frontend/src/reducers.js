import {
	SET_LEFT_TEAM,
  SET_RIGHT_TEAM,
  SET_LEFT_INPUT,
  SET_RIGHT_INPUT
} from "./actions";

const initialState = {
  'left_team': null,
  'right_team': null,
  'left_input': {
    'reason': 'clear',
    'value': null
  },
  'right_input': {
    'reason': 'clear',
    'value': null
  }
};

export const teamReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_LEFT_TEAM:
			return {...state, left_team: action.payload.item};
		case SET_RIGHT_TEAM:
			return {...state, right_team: action.payload.item};
        case SET_LEFT_INPUT:
			return {...state, left_input: action.payload.item};
        case SET_RIGHT_INPUT:
			return {...state, right_input: action.payload.item};
		default:
			return state;
	}
};