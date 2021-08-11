import React, { lazy } from 'react'
import { connect } from 'react-redux'
import { useJoinRoom } from '../hooks'
import { closeConnection, flipBtn } from '../peerHooks'
import { inRoomCurrentUserSelector, currentUserSelector } from '../redux/userSelector'
const CallEndIcon = lazy(() => import('@material-ui/icons/CallEnd'))
const Fab = lazy(() => import('@material-ui/core/Fab'))
const FlipCameraIosIcon = lazy(() => import('@material-ui/icons/FlipCameraIos'))
const videolocal = React.createRef()

/**
 * Videos component
 */
const Video = ({ inRoomUser, currentUser }) => (
    <div className='container'>
        <video ref={videolocal} volume='0' muted id="videoLocal"></video>
        <div className="remoteVideos"></div>
        {inRoomUser.length > 0 && <Endcall user={currentUser.map(a => a)} />}
    </div>
)


/**
 * Call hook to disconnect PeerJs
 */
const closePeer = (user) => {

    closeConnection()
    useJoinRoom(JSON.stringify(user[0]))
}

/**
 * Display btn to stop call
 */
const Endcall = ({ user }) => (
    <div className="controlsBtn"> 
        <Fab color='secondary' onClick={() => closePeer(user)}>
            <CallEndIcon />
        </Fab>
        <Fab onClick={flipBtn}>
            <FlipCameraIosIcon />
        </Fab>
        </ div > 
)

/**
 * Create / append videos remotes streams
 * @param {MediaStream} src 
 */
const addRemoteVideo = (src, id) => {
    const video = document.createElement('video')
    video.srcObject = src
    video.volume = '0.5'
    video.muted = true
    video.id = id
    video.className = 'videoRemote'
    const div = document.querySelector('.remoteVideos')
    div.append(video)
    video.play()
}

/**
 * On current user close call remove videos elements
 */
export const removeAllVideosSrc = () => {
    Array.from(document.querySelectorAll('video')).map(v => v.remove())
}

/**
 * On user close call remove video element by id
 * @param {String} id PeerId 
 */
export const removeVideoSrc = id => {
    console.log('remove remote video id => ', id);
    const video = document.getElementById(id)
    video ? video.remove() : null
}

/**
 * Add source video for local stream
 * @param {MediaStream} stream 
 */
export const localvideo = async (stream) => {
    videolocal.current.srcObject = stream
    videolocal.current.play()
}

/**
 * Map remotes MediaStream 
 * @param {Array} remotestream
 * @param {String} id PeerId
 */
export const remotevideo = (remotestream, id) => {
    remotestream.map(r => addRemoteVideo(r, id))
}

const VideoConnectSelector = connect(
    (state) => ({
        inRoomUser: inRoomCurrentUserSelector(state),
        currentUser: currentUserSelector(state)
    })
)(Video)

export default VideoConnectSelector