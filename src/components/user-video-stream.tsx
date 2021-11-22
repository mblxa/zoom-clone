import React, {useEffect, useRef} from "react";

interface UserVideoStreamProps {
    stream: MediaStream;
    muted: boolean;
}

export const UserVideoStream: React.FC<UserVideoStreamProps> = props => {
    const videoRef = useRef<HTMLVideoElement | null>(null)

    const playStream = () => {
        videoRef.current?.play();
    }

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = props.stream;
            videoRef.current.addEventListener('loadedmetadata', playStream)
        }

        return () => {
            videoRef.current?.removeEventListener('loadedmetadata', playStream)
        }
    }, [videoRef.current])

    return (<video style={{width: "500px", height:"350px"}} ref={videoRef} muted={props.muted}/>)
}
