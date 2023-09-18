// components/VideoCall.js
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const VideoCall = () => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const socket = io("/");

  const [isMuted, setIsMuted] = useState(false);
  const [meetingCode, setMeetingCode] = useState("");
  const [isInMeeting, setIsInMeeting] = useState(false);

  // Toggle mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    localVideoRef.current.srcObject.getAudioTracks().forEach((track) => {
      track.enabled = !isMuted;
    });
  };

  // Create a meeting
  const createMeeting = () => {
    const generatedMeetingCode = "ABC123"; // Generate a unique code (you can use a library for this)
    socket.emit("createMeeting", generatedMeetingCode);
    setIsInMeeting(true);
    setMeetingCode(generatedMeetingCode);
  };

  // Join a meeting
  const joinMeeting = () => {
    socket.emit("joinMeeting", meetingCode);
    setIsInMeeting(true);
  };

  useEffect(() => {
    // Get user media (camera and microphone)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;

        const peer = new Peer({ initiator: true, trickle: false, stream });

        // Signal offer to the server
        peer.on("signal", (data) => {
          socket.emit("offer", data);
        });

        // Handle incoming offer from other user
        socket.on("offer", (data) => {
          peer.signal(data);
        });

        // Handle remote video stream
        peer.on("stream", (stream) => {
          remoteVideoRef.current.srcObject = stream;
        });
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h1>Video Call Page</h1>
      <div>
        <button onClick={toggleMute}>
          {isMuted ? "Unmute" : "Mute"} Microphone
        </button>
      </div>
      <div>
        {isInMeeting ? (
          <p>You are in a meeting with code: {meetingCode}</p>
        ) : (
          <>
            <button onClick={createMeeting}>Create Meeting</button>
            <input
              type="text"
              placeholder="Enter Meeting Code"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
            />
            <button onClick={joinMeeting}>Join Meeting</button>
          </>
        )}
      </div>
      <video ref={localVideoRef} autoPlay muted />
      <video ref={remoteVideoRef} autoPlay />
    </div>
  );
};

export default VideoCall;
