import {Socket, io} from 'socket.io-client';
import Peer from "peerjs";
import {useEffect, useRef} from "react";
import {v4} from "uuid";
const ROOM_ID = 1;

function connectToNewUser(videoGrid, myPeer, userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        console.log('connectToNewUser stream')
        addVideoStream(videoGrid, video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })
}

function addVideoStream(videoGrid, video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
        video.muted = true;
    })
    videoGrid.append(video)
}

const Video = () => {
    const socketRef = useRef<Socket | null>(null)
    const myPeerRef = useRef<Peer | null>(null);

    useEffect(() => {
        socketRef.current = io("/", {path: '/api/socketio'});

        myPeerRef.current = new Peer();
            // myPeerRef.current = new Peer(undefined, {
            //     host: '/',
            //     port: 3000,
            //     path: '/api/socketio',
            // })
            const myVideo = document.createElement('video')
            myVideo.muted = true

            const videoGrid = document.getElementById('video-grid')

            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then(stream => {
                addVideoStream(videoGrid, myVideo, stream)

                myPeerRef.current?.on('call', call => {
                    call.answer(stream)
                    const video = document.createElement('video')
                    call.on('stream', userVideoStream => {
                        addVideoStream(videoGrid, video, userVideoStream)
                    })
                })

                socketRef.current?.on('user-connected', userId => {
                    connectToNewUser(videoGrid, myPeerRef.current, userId, stream)
                })
            })

        myPeerRef.current?.on('open', id => {
            socketRef.current?.emit('join-room', {roomId: ROOM_ID, userId: id})
        })

    }, [])
    return (
            <div id="video-grid"/>
    )
}

export default Video;
