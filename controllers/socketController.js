// socketController.js
const Room = require("../models/roomModel");
const Chat = require('../models/chatModel');
// Store shared location data
const sharedLocations = {};


const handleConnection = (socket, io) => {
  console.log("Connected & Socket Id is ", socket.id);
  socket.emit("Data", "first emit");

  socket.on("Realtime", (data) => {
    console.log(data);
  });

  socket.on("ShareLocation", (data) => {
    try {
      console.log("Location data received:", data);

      // Store the shared location data
      sharedLocations[data.userId] = data;

      // Broadcast the location data to all connected clients
      io.emit("SharedLocation", data);
      console.log('Location data emitted to all connected clients.', data);

    } catch (error) {
      console.error('Error handling location data:', error.message);
    }
  });

  socket.on("TrackLocation", (userId) => {
    try {
      // Retrieve the shared location data for the specified user
      const locationData = sharedLocations[userId];

      if (locationData) {
        // Send the location data to the tracking client
        socket.emit("TrackedLocation", locationData);
        console.log('Tracked location data sent to the client.', locationData);
      } else {
        console.log('Location data not found for user:', userId);
      }

    } catch (error) {
      console.error('Error handling track location request:', error.message);
    }
  });
  //chat room
  socket.on('SendMessage', async (data) => {
    try {
      // Check if a chat document exists for the room, create one if not
      let chat = await Chat.findOne({ roomId: data.roomId });
      if (!chat) {
        chat = new Chat({ roomId: data.roomId, messages: [] });
      }

      // Push the new message to the messages array
      chat.messages.push({
        senderId: data.senderId,
        message: data.message,
      });

      // Save the chat document
      await chat.save();


      // Broadcast the message to all connected clients in the room
      io.to(data.roomId).emit('ReceivedMessage', data);
      console.log('Message emitted to all connected clients in the room.', data);
    } catch (error) {
      console.error('Error handling chat message:', error.message);
    }
  });

};

module.exports = {
  handleConnection,
};