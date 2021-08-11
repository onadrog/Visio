import { combineReducers } from 'redux'
import usersConnectReducer from './usersReducer'

/**
 * Redux combine reducers
 */
export default combineReducers({
    connectedUsers: usersConnectReducer,
})