import { createSelector } from 'reselect'

/**
 * Default Selector for all users
 * @param {Object} state.connectedUsers
 */
export const userSelector = ({ connectedUsers }) => connectedUsers

/**
 * Select  online users AND NOT in a room via filter
 */
export const onlineUserSelector = createSelector(
    userSelector,
     connectedUsers => connectedUsers.filter(u => u.online && !u.inRoom)
)

/**
 * Select offline users via filter
 */
export const OfflineUserSelector = createSelector(
    userSelector,
    connectedUsers => connectedUsers.filter(u => !u.online)
)

/**
 * Select current user
 */
export const currentUserSelector = createSelector(
    userSelector,
    connectedUsers => connectedUsers.filter(u => u.me)
)

/**
 * Select all users in room
 */
export const inRoomUserSelector = createSelector(
    userSelector,
    connectedUsers => connectedUsers.filter(u => u.inRoom)
)

/**
 * Select current user in room
 */
export const inRoomCurrentUserSelector = createSelector(
    userSelector,
    connectedUsers => connectedUsers.filter(u => u.inRoom && u.me)
)
