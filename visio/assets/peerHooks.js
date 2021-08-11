import Peer from 'peerjs'
import { localvideo, remotevideo } from './component/Video';
import { eventsHub } from './events'
import { sendPeerId } from './hooks';
import { removeAllVideosSrc } from './component/Video'
// ------------------------------------- GetUserMedia Polyfill ------------------------------------- \\

// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
}

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {

        // First get ahold of the legacy getUserMedia, if present
        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
        });
    }
}

// ------------------------------------------ END POLYFILL ------------------------------------------ \\


let sender
let front = true;
let videoTrack

/**
 * Init Peerjs connection
 */
export const peer = new Peer({
    key: 'peerjs',
    host: 'CHANGEME!', // Change with your heroku url app (eg. mypeerjs.herokuapp.com)
    port: 443,
    path: '/',
    secure: true,
})

/**
 * Dispatch to mercure current user Peerid / send PeerId to mercure hub connected users
 */
peer.on('open', id => {
    sendPeerId(id)
    eventsHub(id)
})

let localstream
/**
 * Make Peerjs call
 * @param {String} targetPeerId Target call peerId
 */
export const peerCall = targetPeerId => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true })
        .then((stream) => {
            const call = peer.call(targetPeerId, stream)
            sender = call.peerConnection
            let r = []
            let id
            call.on('stream', (remoteStream) => {
                videoTrack = stream.getVideoTracks()[0]
                if (id !== remoteStream.id) {
                    r.push(remoteStream)
                    id = remoteStream.id
                    remotevideo(r, targetPeerId)
                }
            })
            if (localstream !== stream) {
                localstream = stream
                localvideo(stream)
            }
        }).catch((err) => {
            console.error(err)
        })
}

/**
 * Answer to a peer call
 */
peer.on('call', (call) => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true })
        .then((stream) => {
            videoTrack = stream.getVideoTracks()[0]
            call.answer(stream)
            sender = call.peerConnection
            let r = []
            let id
            call.on('stream', (remoteStream) => {
                if (id !== remoteStream.id) {
                    id = remoteStream.id
                    r.push(remoteStream)
                    remotevideo(r, peer.id)
                }
            });
            if (localstream !== stream) {
                localstream = stream
                localvideo(stream)
            }
        }).catch((err) => {
            console.error(err)
        })
});

/**
 * Disconnect to PeerJs
 */
export const closeConnection = () => {
    peer.disconnect()
    removeAllVideosSrc()
}

/**
 * On current user close call remove all videos element + reconnect
 */
peer.on('disconnected', () => {
    if (localstream) {
        localstream.getTracks().forEach(function (track) { track.stop() })
        peer.reconnect()
    }
})

export const flipBtn = () => {
    front = !front
    let constraints = { facingMode: front ? 'user' : "environment" }
    videoTrack.stop()
    navigator.mediaDevices.getUserMedia({ video: constraints })
        .then((stream) => {
            let newVideoTracks = stream.getVideoTracks()[0]
            let senders = sender.getSenders().find(function (s) {
                return s.track.kind == newVideoTracks.kind;
            });
            console.log(peer.id);
            videoTrack = newVideoTracks
            localstream.addTrack(newVideoTracks)
            senders.replaceTrack(newVideoTracks)
        }).catch(function (err) {
            console.error('Error happens:', err);
        });
}
