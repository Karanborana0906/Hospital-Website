import Chat from '../models/chatModel.js';
import { fetchAIResponse } from '../services/aiService.js';

// @desc    Send a message to AI Chatbot
// @route   POST /api/chat
// @access  Private
export const sendMessage = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    // Call the external AI API via the Service Layer
    const responseText = await fetchAIResponse(message);

    // Save the chat history in MongoDB
    const newChat = await Chat.create({
      userId: req.user._id,
      message,
      response: responseText,
    });

    res.status(201).json({
      _id: newChat._id,
      message: newChat.message,
      response: newChat.response,
      createdAt: newChat.createdAt
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ message: 'Error processing chat request', error: error.message });
  }
};

// @desc    Get user's chat history
// @route   GET /api/chat
// @access  Private
export const getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
