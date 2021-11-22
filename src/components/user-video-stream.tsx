import React, {useEffect, useRef} from "react";

interface UserVideoStreamProps {
    stream: MediaStream;
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

    return (<video ref={videoRef} muted={true}/>)
}
