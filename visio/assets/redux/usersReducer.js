const initialState = []

export const CONNECTED_USERS = 'CONNECTED_USERS'
export const UPDATE_CONNECTED_USERS = 'UPDATE_CONNECTED_USERS'
export const DISCONNECTED_USERS = 'DISCONNECTED_USERS'
export const USER_IN_ROOM = 'USER_IN_ROOM'


/**
 * Redux reducer for users
 * @param {Object} state 
 * @param {*} action 
 */
export default function usersConnectReducer(state = initialState, action) {
    switch (action.type) {
        case CONNECTED_USERS:
            return action.payload
        case UPDATE_CONNECTED_USERS:
            return state.map(users => {
                if (users.id === action.payload.id) {
                    return {...users, ...action.payload}
                }
                else {
                    return users
                }
            })
        case DISCONNECTED_USERS:
            return state.map(users => {
                if (users.id === action.payload.id) {
                    return { ...users, ...action.payload }
                } else {
                    return users
                }
            })
        case USER_IN_ROOM:
            return state.map(users => {
                if (users.id === action.payload.id) {
                    return {...users, ...action.payload}
                } else {
                    return users
                }
            })
        default:
            return state
    }
}