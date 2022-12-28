import { createStore } from 'redux';
import { teamReducer } from './reducers'

const store = createStore(teamReducer);

export default store;