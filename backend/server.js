// server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 5000;

// Initialize Gemini API with your API key
// Ensure GEMINI_API_KEY is set in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Middleware setup
app.use(cors()); // Enable CORS to allow frontend to make requests
app.use(express.json()); // Parse JSON request bodies

// --- Mock E-commerce Data for AI Training ---
// This data will be provided to the AI in the prompt to simulate a database.
const mockProducts = [
    { id: 'P001', name: 'Classic T-shirt', category: 'Tops', price: 19.99, stock: 150, sold: 500 },
    { id: 'P002', name: 'Denim Jeans', category: 'Bottoms', price: 49.99, stock: 80, sold: 320 },
    { id: 'P003', name: 'Hoodie', category: 'Outerwear', price: 35.00, stock: 120, sold: 450 },
    { id: 'P004', name: 'Summer Dress', category: 'Dresses', price: 29.99, stock: 200, sold: 610 },
    { id: 'P005', name: 'Running Shorts', category: 'Bottoms', price: 24.50, stock: 90, sold: 280 },
    { id: 'P006', name: 'Winter Coat', category: 'Outerwear', price: 89.99, stock: 30, sold: 100 },
];

const mockOrders = [
    { orderId: '12345', customer: 'Alice Smith', status: 'Shipped', items: [{ productId: 'P001', qty: 2 }], total: 39.98, shippingDate: '2025-07-20' },
    { orderId: '67890', customer: 'Bob Johnson', status: 'Processing', items: [{ productId: 'P003', qty: 1 }, { productId: 'P002', qty: 1 }], total: 84.99, orderDate: '2025-07-25' },
    { orderId: '11223', customer: 'Charlie Brown', status: 'Delivered', items: [{ productId: 'P004', qty: 1 }], total: 29.99, deliveryDate: '2025-07-22' },
];

// --- System Instruction for the AI ---
const systemInstruction = `
You are a helpful and friendly customer support chatbot for an e-commerce clothing site.
Your goal is to assist customers with their queries regarding products, orders, and general store information.

Here is the current product inventory data (in JSON format):
${JSON.stringify(mockProducts, null, 2)}

Here is the current order data (in JSON format):
${JSON.stringify(mockOrders, null, 2)}

Based on the provided data, answer the user's questions.
If a user asks for information not explicitly available in the provided data (e.g., "What are your return policies?"), provide a polite general answer, or state that you don't have that specific information and suggest checking the FAQ or contacting human support.
Be concise and directly answer the questions.
`;

// API Route for Chat
app.post('/api/chat', async (req, res) => {
    const { messages } = req.body; // Expect messages array from frontend

    // Basic validation for incoming messages
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required in the request body.' });
    }

    try {
        // Start chat history with the system instruction
        let chatHistory = [
            {
                role: 'user', // System instructions are typically sent as a user message that the model should understand as context
                parts: [{ text: systemInstruction }]
            },
            {
                role: 'model', // Acknowledge the system instruction
                parts: [{ text: "Hello! How can I assist you with your clothing order or product questions today?" }]
            }
        ];

        // Append actual user and AI messages from the conversation
        messages.forEach(msg => {
            if (msg && typeof msg.text === 'string' && msg.text.trim() !== '') {
                chatHistory.push({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text.trim() }]
                });
            }
        });

        // If no valid messages remain after filtering (should not happen if initial validation passes), return an error
        if (chatHistory.length === 0) {
            return res.status(400).json({ error: 'No valid messages found to send to the AI after filtering.' });
        }

        // Construct the payload for the Gemini API
        const payload = { contents: chatHistory };

        // Log the exact payload being sent to the Gemini API for debugging
        console.log("Payload sent to Gemini API:", JSON.stringify(payload, null, 2));

        // Make the call to the Gemini API
        const result = await model.generateContent(payload);
        const response = await result.response;
        const text = response.text(); // Extract the text response from the AI

        // Send the AI's response back to the frontend
        res.json({ response: text });

    } catch (error) {
        console.error('Error generating content from Gemini API:', error);

        // Provide more detailed error response based on the type of error
        if (error.status && error.statusText) {
            res.status(error.status).json({
                error: `AI API Error: ${error.statusText}`,
                details: error.message
            });
        } else {
            res.status(500).json({ error: 'Failed to get response from AI.', details: error.message });
        }
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
