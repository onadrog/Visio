import { useEffect, useCallback, useState } from 'react'
import store from './redux'
import { useDispatch } from 'react-redux'
import { getUserAction } from './redux/userActions'
import { UPDATE_CONNECTED_USERS, USER_IN_ROOM } from './redux/usersReducer'
import { peer } from './peerHooks'
import { currentUserSelector } from './redux/userSelector'

/**
 * Dispatch redux actions send object to connected users
 * @param {Object} usr data from user connecting
 * @param {string} peerId user peerId
 */
export const sendConnectUserHook = (usr, peerId) => {

    const isInRoom = currentUserSelector(store.getState()) // A REVOIR
    let users = {
        'username': usr.username,
        'id': usr.id,
        'online': usr.online,
        'peerId': usr.peerId
    }
    let data = {
        'topic': `https://aaa/user/${usr.id}`,
        'data': peerId,
        'type': 'update',
        'inRoom': isInRoom[0].inRoom
    }
    let formBody = []
    for (let property in data) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    fetch('/visio', {
        method: 'POST',
        body: formBody,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    })
    store.dispatch({
        type: UPDATE_CONNECTED_USERS,
        payload: users
    })
}

/**
 * Fetch users from db
 * @param {URL} url 
 */
export const useGetuserList = async (url) => {
    const dispatch = useDispatch()
    const fetchdata = useCallback(async () => {
        const response = await fetch(url)
        const data = await response.json()
        if (response.ok) {
            peer.on('open', id => {
                dispatch(getUserAction(data, id))
          })
        }
    })
    useEffect(() => {
        fetchdata()
        return () => {
            fetchdata()
        }
    }, [url])
}

/**
 * Dispatch to mercure joining room
 * @param {Object} user 
 */
export const useJoinRoom = user => {
    const userParse = JSON.parse(user)
    userParse.type = 'join'
    userParse.inRoom = !userParse.inRoom
    setUsersInRoom(userParse)
    userParse.me = false
    let data = {
        'topic': `https://aaa/join`,
        'data': JSON.stringify(userParse),
    }
    let formBody = []
    for (let property in data) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&")
    fetch('/chat', {
        method: 'POST',
        body: formBody,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    })
}

/**
 * Onload send user Peerid to all connected users via Mercure hub
 * @param {String} peerId 
 */
export const sendPeerId = peerId => {
    let data = {
        'topic': `https://aaa/user`,
        'data': peerId,
        'type': 'connection',
        'inRoom': false
    }
    let formBody = []
    for (let property in data) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    fetch('/visio', {
        method: 'POST',
        body: formBody,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
    })
}

/**
 * Dispatch to Redux users joining room
 * @param {Object} user 
 */
export const setUsersInRoom = user => {
    store.dispatch({
        type: USER_IN_ROOM,
        payload: user
    })
}

/**
 * Toggle visiblity On / Off
 * @param {boolean} initialState  default false
 */
export const useToggle = (initialState = false) => {
    const [visible, setVisible] = useState(initialState)

    const toggleVisibility = () => {
        setVisible(v => !v)
    }

    return [visible, toggleVisibility]
}