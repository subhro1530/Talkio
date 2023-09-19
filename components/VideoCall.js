import React, { useRef, useState, useEffect } from "react";
import styles from "/styles/VideoCall.module.css";
import socketIOClient from "socket.io-client";
import io from "socket.io-client";
import Peer from "simple-peer";

const VideoCall = () => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [cameraStream, setCameraStream] = useState(null);

  const [meetingCode, setMeetingCode] = useState("");
  const [socket, setSocket] = useState(null);

  /*
  OPTIONAL
  */

  /*END*/

  useEffect(() => {
    const socket = socketIOClient("/"); // Replace with your Socket.IO server URL
    setSocket(socket);

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const generateRandomMeetingCode = () => {
    const randomMeetingCode = Math.random().toString(36).substring(2, 12);
    setMeetingCode(randomMeetingCode);
  };
  const joinMeeting = () => {
    if (meetingCode && socket) {
      // Send the meeting code to the server
      socket.emit("joinMeeting", meetingCode);
    }
  };

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
        <button onClick={toggleMute}>
          {isMuted ? "Mute" : "Unmute"} Microphone
        </button>
        <button onClick={toggleVideo}>
          {isVideoOn ? "Turn Off Video" : "Turn On Video"}
        </button>
      </div>
      <div className={styles.optionsContainer}>
          <p>You are in a meeting with code: {meetingCode}</p>
          <>
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
      </div>
    </div>
  );
};

export default VideoCall;
