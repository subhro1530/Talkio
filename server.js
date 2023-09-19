const nanoid = require("nanoid");

// Create a map to store active meetings with their codes
const activeMeetings = new Map();

// Function to generate a unique 10-digit meeting code
const generateMeetingCode = () => {
  return nanoid(10);
};

io.on("connection", (socket) => {
  // Handle WebSocket events here

  // Create a new meeting with a unique code
  socket.on("createMeeting", () => {
    const meetingCode = generateMeetingCode();
    activeMeetings.set(meetingCode, socket.id);
    socket.emit("meetingCreated", meetingCode);
  });

  // Join a meeting using a meeting code
  socket.on("joinMeeting", (meetingCode) => {
    const hostSocketId = activeMeetings.get(meetingCode);
    if (hostSocketId) {
      // Notify the host that someone is joining
      io.to(hostSocketId).emit("participantJoined", socket.id);
    } else {
      socket.emit("meetingNotFound");
    }
  });

  // ... Other WebSocket event handlers
});
