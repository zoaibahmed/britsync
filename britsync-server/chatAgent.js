// /**
//  * BritSync AI Chat Agent
//  * Powered by Groq (Llama 3.3 70B) with knowledge from website databases
//  */

// const Groq = require('groq-sdk');
// const { buildKnowledgeContext, formatContextForPrompt } = require('./knowledgeBase');
// const {
//     isInAppointmentFlow,
//     processAppointmentStep,
//     startAppointmentFlow,
//     shouldStartAppointment,
//     cancelAppointmentFlow,
//     getCurrentStepQuestion
// } = require('./appointmentBooking');

// // Session memory storage (in production, use Redis)
// const sessionMemory = new Map();
// const MAX_HISTORY = 10;

// // Initialize Groq
// let groq = null;

// function initGroq() {
//     if (!groq && process.env.GROQ_API_KEY) {
//         groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
//     }
//     return groq;
// }

// /**
//  * System prompt for the BritSync AI assistant
//  */
// const SYSTEM_PROMPT = `You are Assistant, the friendly AI assistant for BritSync - a premium digital agency specializing in Web Development, AI Automation, Mobile Apps, and Digital Marketing.

// ## Your Personality:
// - Friendly, professional, and helpful
// - Enthusiastic about technology and innovation
// - Use emojis sparingly but effectively (1-2 per response)
// - Keep responses concise but informative (2-4 sentences typically)
// - Be conversational, not robotic

// ## Your Capabilities:
// 1. Answer questions about BritSync services, pricing, and process
// 2. Discuss our portfolio and past projects
// 3. Share latest news and articles from our website
// 4. Help visitors book discovery calls or get quotes
// 5. Collect contact information for follow-up

// ## Guidelines:
// - Always be helpful and steer conversations towards how BritSync can help
// - If asked about pricing, provide general ranges and encourage booking a call for exact quotes
// - For complex technical questions, offer to connect them with our team
// - If you don't know something specific, be honest and offer to have a team member follow up
// - When discussing articles/news, summarize briefly and offer to share more details
// - When users want to book calls/appointments, tell them you can help book right now

// ## Contact Actions:
// - To book a call: Offer to start the booking process right in the chat
// - For quotes: Encourage discovery call booking
// - Emergency contact: britsyncuk@gmail.com

// ## Current Knowledge Context:
// {KNOWLEDGE_CONTEXT}

// Remember: You represent BritSync. Be professional, helpful, and guide visitors towards taking action (booking calls, getting quotes, learning more about services).`;

// /**
//  * Get or create session history
//  */
// function getSessionHistory(sessionId) {
//     if (!sessionMemory.has(sessionId)) {
//         sessionMemory.set(sessionId, []);
//     }
//     return sessionMemory.get(sessionId);
// }

// /**
//  * Add message to session history
//  */
// function addToHistory(sessionId, role, content) {
//     const history = getSessionHistory(sessionId);
//     history.push({ role, content });

//     // Keep only last N messages
//     if (history.length > MAX_HISTORY * 2) {
//         history.splice(0, 2);
//     }
// }

// /**
//  * Generate chat response using Groq
//  */
// async function generateChatResponse(userMessage, sessionId) {
//     // Check if user is in appointment flow
//     if (isInAppointmentFlow(sessionId)) {
//         // Check for cancel keywords
//         if (userMessage.toLowerCase().includes('cancel') || userMessage.toLowerCase().includes('stop')) {
//             cancelAppointmentFlow(sessionId);
//             const cancelResult = {
//                 aiPrompt: 'User cancelled the booking. Acknowledge warmly and offer to help with anything else. One short sentence.',
//                 fallback: "No problem! Booking cancelled. How else can I help? 😊"
//             };
//             return { success: true, response: await generateAIBookingResponse(cancelResult) };
//         }

//         // Detect off-topic / question messages — answer with AI then re-ask booking step
//         const isQuestion = userMessage.includes('?') ||
//             /^(why|what|how|who|when|where|is|are|can|do|does|tell|explain|help)/i.test(userMessage.trim());

//         if (isQuestion) {
//             const currentStepQ = getCurrentStepQuestion(sessionId);
//             const aiReply = await getGroqResponse(userMessage, sessionId);
//             const reminder = currentStepQ
//                 ? `\n\n---\n*To continue your booking: ${currentStepQ}*`
//                 : '';
//             return { success: true, response: aiReply + reminder };
//         }

//         // Process the booking step — returns {state, aiPrompt, fallback}
//         const flowResult = await processAppointmentStep(sessionId, userMessage);
//         if (flowResult !== null && flowResult !== undefined) {
//             const response = await generateAIBookingResponse(flowResult);
//             return { success: true, response, isAppointment: true };
//         }
//     }

//     // Check if user wants to start appointment booking
//     if (shouldStartAppointment(userMessage)) {
//         const flowResult = startAppointmentFlow(sessionId, userMessage);
//         const response = await generateAIBookingResponse(flowResult);
//         return { success: true, response, isAppointment: true };
//     }

//     const aiResponse = await getGroqResponse(userMessage, sessionId);
//     return { success: true, response: aiResponse };
// }

// /**
//  * Generate a natural AI response for booking flow steps
//  * Uses Groq with the aiPrompt from appointmentBooking.js
//  */
// async function generateAIBookingResponse(flowResult) {
//     const client = initGroq();
//     if (!client || !flowResult.aiPrompt) return flowResult.fallback;

//     try {
//         const completion = await client.chat.completions.create({
//             model: 'llama-3.3-70b-versatile',
//             messages: [
//                 {
//                     role: 'system',
//                     content: `You are a friendly, warm booking assistant for BritSync, a premium digital agency.
// You are helping a visitor book a free 30-minute discovery call.
// Rules:
// - Be natural and human, NOT robotic
// - Keep responses SHORT (2-3 sentences max)
// - Do NOT use markdown headers or bullet points unless showing a list of slots/services
// - Use emojis sparingly (max 1)
// - Sound like a real person, not a template`
//                 },
//                 {
//                     role: 'user',
//                     content: flowResult.aiPrompt
//                 }
//             ],
//             temperature: 0.85,
//             max_tokens: 200,
//         });
//         return completion.choices[0]?.message?.content || flowResult.fallback;
//     } catch (err) {
//         console.error('AI booking response error:', err.message);
//         return flowResult.fallback;
//     }
// }

// /**
//  * Core Groq AI response function — used by both main flow and off-topic detection
//  */
// async function getGroqResponse(userMessage, sessionId) {
//     const client = initGroq();

//     if (!client) {
//         console.error('Groq not initialized - missing API key');
//         return getFallbackResponse(userMessage);
//     }

//     try {
//         // Build knowledge context with a 3-second timeout
//         let knowledge = { services: [], projects: [], faqs: [], team: [], articles: [], relevantInfo: [] };
//         let knowledgeText = '';

//         try {
//             const knowledgePromise = buildKnowledgeContext(userMessage);
//             const timeoutPromise = new Promise((_, reject) =>
//                 setTimeout(() => reject(new Error('Knowledge timeout')), 3000)
//             );
//             knowledge = await Promise.race([knowledgePromise, timeoutPromise]);
//             knowledgeText = formatContextForPrompt(knowledge);
//         } catch (knowledgeError) {
//             console.log('Knowledge context skipped:', knowledgeError.message);
//         }

//         const systemPrompt = SYSTEM_PROMPT.replace('{KNOWLEDGE_CONTEXT}', knowledgeText || 'No specific context loaded.');
//         const history = getSessionHistory(sessionId);

//         const messages = [
//             { role: 'system', content: systemPrompt },
//             ...history,
//             { role: 'user', content: userMessage }
//         ];

//         const completion = await client.chat.completions.create({
//             model: 'llama-3.3-70b-versatile',
//             messages: messages,
//             temperature: 0.7,
//             max_tokens: 500,
//             top_p: 0.9,
//         });

//         const response = completion.choices[0]?.message?.content || getFallbackResponse(userMessage);

//         addToHistory(sessionId, 'user', userMessage);
//         addToHistory(sessionId, 'assistant', response);

//         return response;

//     } catch (error) {
//         console.error('Groq API Error:', error?.message || error);
//         if (error?.status) console.error('Groq Status:', error.status);
//         if (error?.error) console.error('Groq Error Detail:', JSON.stringify(error.error));
//         return getFallbackResponse(userMessage);
//     }
// }

// /**
//  * Fallback responses when AI is unavailable
//  */
// function getFallbackResponse(userMessage) {
//     const lowerMsg = userMessage.toLowerCase();

//     if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('pricing')) {
//         return "Our pricing is tailored to each project's scope. For a custom quote, please share your requirements or book a free discovery call! 💰";
//     }

//     if (lowerMsg.includes('service') || lowerMsg.includes('what do you') || lowerMsg.includes('offer')) {
//         return "We offer Web Development, AI Automation, Mobile Apps, and Digital Marketing. Each solution is crafted for maximum impact! 🚀 Would you like to know more about any specific service?";
//     }

//     if (lowerMsg.includes('contact') || lowerMsg.includes('call') || lowerMsg.includes('meet') || lowerMsg.includes('book')) {
//         return "Great! You can book a discovery call through our Contact page, or I can help schedule one for you right here! 📞 Just share your preferred time.";
//     }

//     if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
//         return "Hello! 👋 Great to meet you! I'm your AI assistant at BritSync. How can I help you today?";
//     }

//     if (lowerMsg.includes('news') || lowerMsg.includes('article')) {
//         return "We publish articles on AI, Lifestyle, and World News. Visit our news section to explore the latest! 📰 Is there a specific topic you're interested in?";
//     }

//     if (lowerMsg.includes('human') || lowerMsg.includes('talk to') || lowerMsg.includes('real person')) {
//         return "Of course! 🙋‍♂️ Please share your name and email, and our team will reach out within 2-4 hours!";
//     }

//     return "Thanks for reaching out! I'm here to help with any questions about our services. What would you like to know? 🚀";
// }

// /**
//  * Clear session history
//  */
// function clearSession(sessionId) {
//     sessionMemory.delete(sessionId);
// }

// /**
//  * Get session info
//  */
// function getSessionInfo(sessionId) {
//     const history = getSessionHistory(sessionId);
//     return {
//         messageCount: history.length,
//         hasHistory: history.length > 0
//     };
// }

// module.exports = {
//     generateChatResponse,
//     clearSession,
//     getSessionInfo,
//     initGroq
// };
