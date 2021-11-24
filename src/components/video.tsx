import {Socket, io} from 'socket.io-client';
import Peer from "peerjs";
import {FC, useEffect, useRef, useState} from "react";
import {UserVideoStream} from "./user-video-stream";

interface VideoProps {
    roomId: string;
}

const Video: FC<VideoProps> = props => {
    const socketRef = useRef<Socket | null>(null)
    const myPeerRef = useRef<Peer | null>(null);
    const [userVideos, setUserVideos] = useState<{stream: MediaStream, id: string;}[]>([]);

    const connectStream = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        if (!socketRef.current || !myPeerRef.current) {
            alert("no sockets")
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
    }

    useEffect(() => {
        socketRef.current = io("/", {path: '/api/socketio'});
        myPeerRef.current = new Peer();
        // myPeerRef.current = new Peer(undefined, {
        //     host: 'localhost',
        //     port: 9000,
        //     path: '/myapp',
        // })

        myPeerRef.current?.on('open', id => {
            socketRef.current?.emit('join-room', {roomId: props.roomId, userId: id})
        })

        connectStream();

    }, [])
    return (
        <div>{userVideos.map(item => (<UserVideoStream stream={item.stream} key={item.id} muted={item.id === "0"} />))}</div>
    )
}

export default Video;
