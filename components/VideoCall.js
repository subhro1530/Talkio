import React, { useRef, useState, useEffect } from "react";
import styles from "/styles/VideoCall.module.css";

const VideoCall = () => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [cameraStream, setCameraStream] = useState(null);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    localVideoRef.current.muted = isMuted;
  };

  const toggleVideo = async () => {
    if (cameraStream) {
      setIsVideoOn(!isVideoOn);

      const videoTracks = cameraStream.getVideoTracks();

      for (const track of videoTracks) {
        await track.stop();
        // Add a small delay before attempting to start the video again
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      if (isVideoOn) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            const newVideoStream = new MediaStream([
              ...stream.getTracks(),
              ...cameraStream.getAudioTracks(),
            ]);
            setCameraStream(newVideoStream);
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = newVideoStream;
            }
          })
          .catch((error) => console.error(error));
      }
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setCameraStream(stream);
        if (localVideoRef.current) {
          // Check if localVideoRef is available
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch((error) => console.error(error));

    // Cleanup the video stream when the component unmounts
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.videoContainer}>
        {isVideoOn ? (
          <video ref={localVideoRef} autoPlay muted className={styles.video} />
        ) : (
          <div className={styles.blackScreen}></div>
        )}
        <video ref={remoteVideoRef} autoPlay className={styles.video} />
      </div>
      <div className={styles.controls}>
        <button onClick={toggleMute} className={styles.button}>
          {isMuted ? "Mute" : "Unmute"} Microphone
        </button>
        <button onClick={toggleVideo} className={styles.button}>
          {isVideoOn ? "Turn Off Video" : "Turn On Video"}
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
