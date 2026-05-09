require('dotenv').config({ override: true }); // Forces override of existing system environment variables
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000; // Uses port from .env or defaults to 3000

app.use(cors()); // Enables Cross-Origin Resource Sharing for your frontend
app.use(express.json()); // Allows the server to parse JSON request bodies

// Initialize the Google Generative AI with the key from your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use the stable Gemini 2.5 Flash model identified in your API check
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Chat endpoint to process user messages
 */
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ text: "Please provide a message." });
        }

        // Generate content using the AI model
        const result = await model.generateContent(message);
        const response = await result.response;
        
        // Return the text response to the frontend
        res.json({ text: response.text() });
    } catch (error) {
        // Detailed error logging in the terminal for debugging
        console.error("Error:", error);
        res.status(500).json({ 
            text: "I'm having trouble thinking. Check the terminal for errors!" 
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});