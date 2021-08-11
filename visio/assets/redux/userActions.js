import { CONNECTED_USERS, UPDATE_CONNECTED_USERS, USER_IN_ROOM } from "./usersReducer"

const usr = document.querySelector('#root').getAttribute('data-user')
const connected = JSON.parse(usr)

/**
 * Dispacth users to redux + get client user
 * @param {Object} users Users in Db
 * @param {String} id PeerId
 */
export const getUserAction = (users, id) => async (dispatch) => {
        await dispatch({
            type: CONNECTED_USERS,
            payload: users.map(u =>
            ({
                username: u.username,
                id: u.id,
                online: u.id === connected.id ? true : false,
                peerId: u.id === connected.id ? id : null,
                me: u.id === connected.id ? true : false,
                inRoom: false
            }))
        })
}

/**
 * Dispatch users when one is connected
 * @param {Object} users 
 */
export const updateConnection = users => (dispatch) => {
    dispatch({
        type: UPDATE_CONNECTED_USERS,
        payload: users
    })
}

/**
 * Dispatch users in room
 * @param {Object} users 
 */
export const dispatchUserInroom = users => (dispatch)  => {
    dispatch({
        type: USER_IN_ROOM,
        payload: users
    })
}