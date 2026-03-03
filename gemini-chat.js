/**
 * Gemini Chat Integration
 * Provides AI-powered chat using Google's Generative AI (free tier)
 * 
 * To use: Add your Gemini API key to the config below
 * Get API key from: https://ai.google.dev/
 */

class GeminiChat {
    constructor(apiKey = null) {
        // determine API key from multiple sources:
        // 1. passed as argument
        // 2. saved in localStorage
        // 3. global variable (e.g. injected from a build-generated config file)
        // 4. null if nothing found (UI will prompt or error)
        this.apiKey = "AIzaSyCN96dpz_ZIHnY0sRec5kzu51uYQkV_Dsg" || localStorage.getItem('geminiApiKey') || (typeof GEMINI_API_KEY !== 'undefined' ? GEMINI_API_KEY : null);
        this.conversationHistory = [];
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
        this.isLoading = false;
        this.portfolioContext = this.getPortfolioContext();
    }

    // Portfolio context to make the AI aware of the website
    getPortfolioContext() {
        return `You are an AI assistant for a professional portfolio website. You have knowledge about the portfolio owner:

PROFILE:
- Name: Sr. DevSecOps & Full-Stack Engineer
- MTech Software Engineering from BITS Pilani
- Specialization: Database Automation and AI-Native Systems
- Expert in: Oracle SQL, Flyway, Liquibase, Jenkins, SonarQube
- AI Tools: Google Gemini, Claude, GitHub Copilot
- Cloud: AWS (EC2, Load Balancers), Render
- Languages & Tools: Python, Django, Docker, Ansible, PostgreSQL
- Notable Projects:
  1. AI HRMS Platform - Built with GitHub Copilot and v0, deployed on Render Cloud
  2. NotebookLM Prototype - Django AI document system certified by BITS University
  3. Process Accelerator - Optimized legacy process from 45 mins to 10 mins via containerization

WEBSITE PAGES:
- Home (index.html): Portfolio landing page with tech stack and featured projects
- Projects (projects.html): Complete archive of mission logs/projects
- Experience (experience.html): Detailed credentials and work experience
- Contact (contact.html): Contact information and connection methods

You are knowledgeable about all aspects of this portfolio and can answer questions about the professional's skills, projects, experience, and how to get in touch. Be professional but approachable. Always encourage relevant actions like viewing projects or contacting the owner when appropriate.`;
    }

    setApiKey(apiKey) {
        // manual API key setter (stores in localStorage)
        this.apiKey = apiKey;
        localStorage.setItem('geminiApiKey', apiKey);
    }

    async sendMessage(userMessage) {
        if (!this.apiKey) {
            return {
                error: true,
                message: 'API Key not set. Please configure your Gemini API key.',
                isApiKeyMissing: true
            };
        }

        this.isLoading = true;
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        try {
            // Prepare messages for the API (Google's format)
            const messages = this.conversationHistory.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }));

            // Add portfolio context to the first message if it's the start of conversation
            if (this.conversationHistory.length === 1) {
                messages[0].parts.unshift({ text: this.portfolioContext });
            }

            const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: messages,
                    generationConfig: {
                        temperature: 0.7,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    },
                    safetySettings: [
                        {
                            category: 'HARM_CATEGORY_HARASSMENT',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                        },
                        {
                            category: 'HARM_CATEGORY_HATE_SPEECH',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 401 || response.status === 403) {
                    return {
                        error: true,
                        message: 'Invalid API Key. Please check your Gemini API configuration.',
                        isApiKeyMissing: true
                    };
                }
                throw new Error(errorData.error?.message || `API Error: ${response.status}`);
            }

            const data = await response.json();

            if (!data.candidates || !data.candidates[0]) {
                throw new Error('Unexpected API response format: No candidates found');
            }

            // 2. Change how you extract the text
            const assistantMessage = data.candidates[0].content.parts[0].text;

            this.conversationHistory.push({
                role: 'assistant',
                content: assistantMessage
            });

            this.isLoading = false;
            return {
                error: false,
                message: assistantMessage
            };

        } catch (error) {
            this.isLoading = false;
            console.error('Gemini API Error:', error);
            return {
                error: true,
                message: `Error: ${error.message}. Please try again or check your API key.`
            };
        }
    }

    clearHistory() {
        this.conversationHistory = [];
    }

    getHistory() {
        return this.conversationHistory;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeminiChat;
}