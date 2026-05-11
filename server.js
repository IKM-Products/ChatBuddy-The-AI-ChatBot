require('dotenv').config({ override: true });
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ text: "Please provide a message." });
        }

        const result = await model.generateContent(message);
        const response = await result.response;
        
        res.json({ text: response.text() });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ 
            text: "I'm having trouble thinking. Check the terminal for errors!" 
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
