# AI Assistant Guide

## Overview
The AI Assistant is a powerful feature that helps homeowners create detailed job postings through intelligent conversation. It uses local LLM models (Ollama) to understand requirements and generate comprehensive job descriptions.

## Features

### 🤖 Intelligent Job Creation
- **Conversational Interface**: Natural language interaction
- **Requirement Extraction**: Asks relevant questions based on service type
- **Knowledge Base Integration**: Uses home services expertise
- **Job Description Generation**: Creates detailed, professional job postings

### 🧠 AI Models Supported
- **Llama 2.7B**: Fast, lightweight model for quick responses
- **Llama 3.1:8b**: Advanced model for complex reasoning
- **Mistral 7B**: Alternative model for different use cases

## How to Use

### 1. Starting a Conversation
1. Navigate to the home page
2. Click "AI Job Creator" button
3. The AI will greet you and ask about your service needs

### 2. Conversation Flow
The AI follows a structured approach:
1. **Service Type Identification**: Determines what type of service you need
2. **Requirement Gathering**: Asks specific questions about your project
3. **Detail Collection**: Gathers timeline, budget, and special requirements
4. **Job Generation**: Creates a comprehensive job description

### 3. Example Conversation
```
AI: "Hello! I'm here to help you create a detailed job posting. What type of home service do you need?"

User: "I need plumbing work done"

AI: "Great! I can help you create a plumbing job posting. What specific plumbing issue are you experiencing?"

User: "My kitchen faucet is leaking"

AI: "I understand you have a leaking kitchen faucet. Can you tell me more about the leak? Is it a slow drip or a steady stream?"
```

## Configuration

### Ollama Setup
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull required models
ollama pull llama2:7b
ollama pull llama3.1:8b
ollama pull mistral:7b

# Start Ollama service
ollama serve
```

### Environment Variables
```env
# AI Configuration
AI_BIDDING_ENABLED=true
AI_BIDDING_CONFIDENCE_THRESHOLD=0.8
AI_BIDDING_MAX_BIDS_PER_DAY=10
```

## Customization

### Knowledge Base
The AI uses a comprehensive knowledge base located in `src/services/HomeServicesKnowledge.ts`. You can customize:
- Service categories and subcategories
- Common questions for each service type
- Pricing guidelines and estimates
- Timeline recommendations

### Prompt Engineering
AI prompts are defined in `src/services/AIAssistant.ts`. You can modify:
- System prompts for different service types
- Conversation flow logic
- Response formatting
- Context management

## Troubleshooting

### Common Issues

#### AI Not Responding
- Check if Ollama is running: `ollama list`
- Verify model is loaded: `ollama pull llama2:7b`
- Check browser console for errors

#### Poor Response Quality
- Try different models (Llama 3.1:8b vs Llama 2.7B)
- Adjust confidence threshold in environment variables
- Review and update knowledge base

#### Slow Responses
- Use smaller models (Llama 2.7B instead of Llama 3.1:8b)
- Check system resources (CPU/RAM)
- Consider model quantization

## Advanced Features

### Fine-tuning
For better performance on home services, you can fine-tune the models:

1. **Prepare Training Data**: Collect home service Q&A pairs
2. **Create Training Dataset**: Format data for fine-tuning
3. **Fine-tune Model**: Use Ollama's fine-tuning capabilities
4. **Deploy Custom Model**: Load your custom model

### Integration with External APIs
The AI assistant can be extended to integrate with:
- Weather APIs for outdoor work scheduling
- Material cost APIs for pricing estimates
- Local service provider databases
- Permit and regulation databases

## Best Practices

### For Users
- Be specific about your needs
- Provide clear descriptions of problems
- Mention any special requirements or constraints
- Review the generated job description before posting

### For Developers
- Monitor AI response quality
- Update knowledge base regularly
- Test with different service types
- Implement proper error handling
- Consider rate limiting for AI requests

## API Reference

### AI Assistant Endpoints
```javascript
// Start conversation
POST /api/ai/start-conversation
{
  "serviceType": "plumbing",
  "userId": "user123"
}

// Send message
POST /api/ai/message
{
  "conversationId": "conv123",
  "message": "My faucet is leaking",
  "userId": "user123"
}

// Generate job description
POST /api/ai/generate-job
{
  "conversationId": "conv123",
  "userId": "user123"
}
```

### Response Format
```javascript
{
  "success": true,
  "data": {
    "message": "AI response text",
    "conversationId": "conv123",
    "suggestedQuestions": ["Question 1", "Question 2"],
    "jobReady": false
  }
}
```

## Future Enhancements

- **Voice Integration**: Speech-to-text and text-to-speech
- **Image Analysis**: Upload photos for AI analysis
- **Multi-language Support**: Support for different languages
- **Advanced Reasoning**: More sophisticated requirement analysis
- **Integration with IoT**: Smart home device integration
