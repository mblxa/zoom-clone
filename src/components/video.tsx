import {Socket, io} from 'socket.io-client';
import Peer from "peerjs";
import {useEffect, useRef, useState} from "react";
import {UserVideoStream} from "./user-video-stream";
const ROOM_ID = 1;

const Video = () => {
    const socketRef = useRef<Socket | null>(null)
    const myPeerRef = useRef<Peer | null>(null);
    const [userVideos, setUserVideos] = useState<{stream: MediaStream, id: string;}[]>([]);
    console.log(userVideos)

    useEffect(() => {
        socketRef.current = io("/", {path: '/api/socketio'});

        myPeerRef.current = new Peer();
        // myPeerRef.current = new Peer(undefined, {
        //     host: '/',
        //     port: 3000,
        //     path: '/api/socketio',
        // })
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            if (!socketRef.current || !myPeerRef.current) {
                return;
            }

            setUserVideos([{stream, id: "0"}])
            myPeerRef.current.on('call', call => {
                call.answer(stream)
                call.on('stream', userVideoStream => {
                    setUserVideos(state => ([
                        ...state.filter(item => item.id !== call.peer),
                    {stream: userVideoStream, id: call.peer}
                    ]))
                })
            })

            socketRef.current.on('user-connected', userId => {
                if (!myPeerRef.current) {
                    return;
                }
                const call = myPeerRef.current.call(userId, stream);
                call.on('stream', userVideoStream => {
                    setUserVideos(state => ([
                        ...state.filter(item => item.id !== userId),
                        {stream: userVideoStream, id: userId}
                    ]));
                })
            })

            socketRef.current.on("user-disconnected", userId => {
                setUserVideos(state => state.filter(video => video.id !== userId))
            })
        })

        myPeerRef.current?.on('open', id => {
            socketRef.current?.emit('join-room', {roomId: ROOM_ID, userId: id})
        })

    }, [])
    return (
        <div>{userVideos.map(item => (<UserVideoStream stream={item.stream} key={item.id} />))}</div>
    )
}

export default Video;
