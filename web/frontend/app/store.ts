import reducer from './reducer'
import { createStore as reduxCreateStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

export function createStore() {
	return reduxCreateStore(
		reducer,
		applyMiddleware(thunk) 
	)
}