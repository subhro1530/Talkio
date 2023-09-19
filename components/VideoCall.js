import React, { useRef, useState, useEffect } from "react";
import styles from "/styles/VideoCall.module.css";

const VideoCall = () => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    localVideoRef.current.muted = isMuted;
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOn;
      });
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.videoContainer}>
        {isVideoOn ? (
          <video ref={localVideoRef} autoPlay muted className={styles.video} />
        ) : null}
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
