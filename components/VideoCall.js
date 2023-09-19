import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styles from "/styles/VideoCall.module.css"; // Import the CSS module

const VideoCall = () => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const socket = io("/");

  const [isMuted, setIsMuted] = useState(false);
  const [cameraStream, setCameraStream] = useState(null); // State for the camera stream
  const [meetingCode, setMeetingCode] = useState("");
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false); // State to track video on/off
  let peer = null;

  const toggleMute = () => {
    setIsMuted(!isMuted);
    const videoElement = localVideoRef.current;

    if (videoElement) {
      videoElement.srcObject.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });

      if (isMuted) {
        videoElement.muted = true;
      } else {
        videoElement.muted = false;
      }
    }
  };

  const toggleVideo = () => {
    if (cameraStream) {
      // If the camera stream is available, turn it off
      cameraStream.getVideoTracks().forEach((track) => {
        track.stop();
      });
      setCameraStream(null); // Set camera stream to null to turn off video
      setIsVideoOn(false); // Update video state
    } else {
      // If the camera stream is null, turn it on
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setCameraStream(stream); // Set the camera stream to the new stream
          localVideoRef.current.srcObject = stream;
          setIsVideoOn(true); // Update video state
        })
        .catch((error) => console.error(error));
    }
  };

  const createMeeting = () => {
    const generatedMeetingCode = Math.random().toString(36).substring(2, 12);
    socket.emit("createMeeting", generatedMeetingCode);
    setIsInMeeting(true);
    setMeetingCode(generatedMeetingCode);
  };

  const joinMeeting = () => {
    socket.emit("joinMeeting", meetingCode);
    setIsInMeeting(true);
  };

  useEffect(() => {
    if (cameraStream) {
      // Initialize the video stream if available
      peer = new Peer({
        initiator: true,
        trickle: false,
        stream: cameraStream,
      });

      peer.on("signal", (data) => {
        socket.emit("offer", data);
      });

      socket.on("offer", (data) => {
        peer.signal(data);
      });

      peer.on("stream", (stream) => {
        remoteVideoRef.current.srcObject = stream;
      });
    }

    return () => {
      if (peer) {
        peer.destroy();
      }
    };
  }, [socket, cameraStream]);

  return (
    <div className={styles.container}>
      <div className={styles.videoContainer}>
        {isVideoOn ? (
          <video
            ref={localVideoRef}
            autoPlay
            muted={!cameraStream}
            className={styles.video}
          />
        ) : (
          <div className={styles.blackScreen}></div>
        )}
        <video ref={remoteVideoRef} autoPlay className={styles.video} />
      </div>
      <div className={styles.controls}>
        <button onClick={toggleMute}>
          {isMuted ? "Unmute" : "Mute"} Microphone
        </button>
        <button onClick={toggleVideo}>
          {isVideoOn ? "Turn Off Video" : "Turn On Video"}
        </button>
      </div>
      <div className={styles.optionsContainer}>
        {isInMeeting ? (
          <p>You are in a meeting with code: {meetingCode}</p>
        ) : (
          <>
            <button onClick={createMeeting} className={styles.button}>
              Create Meeting
            </button>
            <input
              type="text"
              placeholder="Enter Meeting Code"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              className={styles.input}
            />
            <button onClick={joinMeeting} className={styles.button}>
              Join Meeting
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
