// AI Assistant Service using Ollama
import { getServiceQuestions, getRelevantQuestions, getBudgetRange, getTimelineEstimate } from './HomeServicesKnowledge';

export interface ConversationContext {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  jobRequirements: {
    serviceType?: string;
    scope?: string;
    timeline?: string;
    budget?: string;
    location?: string;
    urgency?: string;
    specialRequirements?: string[];
  };
  conversationStage: 'greeting' | 'discovery' | 'requirements' | 'clarification' | 'job_preparation' | 'confirmation';
}

export interface JobDetails {
  title: string;
  description: string;
  serviceType: string;
  scope: string;
  timeline: string;
  budget: string;
  location: string;
  urgency: 'low' | 'medium' | 'high';
  specialRequirements: string[];
  estimatedDuration: string;
  skillsRequired: string[];
}

export class AIAssistant {
  private ollamaUrl = 'http://localhost:11434';
  private model = 'llama2:7b'; // Will upgrade to llama3.1:8b when available

  async generateResponse(userInput: string, context: ConversationContext): Promise<{
    response: string;
    updatedContext: ConversationContext;
    isJobReady: boolean;
    jobDetails?: JobDetails;
  }> {
    try {
      const prompt = this.buildPrompt(userInput, context);
      
      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 500
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response.trim();

      // Update conversation context
      const updatedContext = this.updateContext(userInput, aiResponse, context);

      // Check if AI is ready to create job posting
      const isJobReady = this.isJobReady(aiResponse, updatedContext);
      let jobDetails: JobDetails | undefined;

      if (isJobReady) {
        jobDetails = this.extractJobDetails(updatedContext);
      }

      return {
        response: aiResponse,
        updatedContext,
        isJobReady,
        jobDetails
      };

    } catch (error) {
      console.error('AI Assistant error:', error);
      return {
        response: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
        updatedContext: context,
        isJobReady: false
      };
    }
  }

  private buildPrompt(userInput: string, context: ConversationContext): string {
    const systemPrompt = `You are an expert AI assistant for BlueCollab.ai, a comprehensive home services platform. You specialize in home maintenance, repairs, renovations, and improvements.

EXPERTISE AREAS:
- Plumbing (leaks, fixtures, pipes, water heaters, drainage)
- Electrical (wiring, outlets, lighting, panels, safety)
- HVAC (heating, cooling, ventilation, ductwork)
- Painting & Decorating (interior/exterior, color selection, surface prep)
- Flooring (hardwood, tile, carpet, installation, repair)
- Roofing (repairs, replacement, gutters, insulation)
- Handyman Services (general repairs, assembly, maintenance)
- Cleaning Services (deep cleaning, maintenance, specialized)
- Landscaping & Gardening (lawn care, planting, hardscaping)
- Home Security (cameras, alarms, locks, smart home)
- Appliance Repair (kitchen, laundry, HVAC equipment)
- Renovation & Remodeling (kitchen, bathroom, basement, additions)

CONVERSATION FLOW:
1. GREETING: Welcome and identify service category
2. DISCOVERY: Ask about specific problem/need
3. ASSESSMENT: Gather technical details and scope
4. REQUIREMENTS: Timeline, budget, location, preferences
5. CLARIFICATION: Address any missing critical information
6. JOB CREATION: Structure comprehensive job posting

CURRENT STAGE: ${context.conversationStage}
GATHERED INFO: ${JSON.stringify(context.jobRequirements, null, 2)}

CONVERSATION HISTORY:
${context.messages.slice(-4).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

USER INPUT: ${userInput}

EXPERT GUIDELINES:
- Ask technical questions relevant to the service type
- Identify potential complications or special requirements
- Suggest appropriate timeline based on project complexity
- Help estimate realistic budget ranges
- Ask about permits, insurance, or safety requirements
- Consider seasonal factors and weather dependencies
- Identify if multiple trades might be needed
- Ask about existing warranties or previous work

RESPONSE STYLE:
- Professional but approachable
- Use industry terminology appropriately
- Ask one focused question at a time
- Provide helpful context for your questions
- Be specific about what information you need
- Show expertise without overwhelming the user

When you have sufficient information to create a detailed job posting, indicate readiness and summarize the key details.`;

    return systemPrompt;
  }

  private updateContext(userInput: string, aiResponse: string, context: ConversationContext): ConversationContext {
    const newMessages = [
      ...context.messages,
      { role: 'user' as const, content: userInput, timestamp: new Date() },
      { role: 'assistant' as const, content: aiResponse, timestamp: new Date() }
    ];

    // Extract information from the conversation
    const updatedRequirements = this.extractRequirementsFromConversation(newMessages);
    
    // Determine conversation stage
    const newStage = this.determineConversationStage(updatedRequirements, newMessages);

    return {
      messages: newMessages,
      jobRequirements: updatedRequirements,
      conversationStage: newStage
    };
  }

  private extractRequirementsFromConversation(messages: Array<{role: string; content: string; timestamp: Date}>): ConversationContext['jobRequirements'] {
    const requirements: ConversationContext['jobRequirements'] = {};
    const conversation = messages.map(m => m.content).join(' ').toLowerCase();

    // Enhanced service type detection
    if (conversation.includes('paint') || conversation.includes('painting') || conversation.includes('color')) {
      requirements.serviceType = 'Painting & Decorating';
    } else if (conversation.includes('plumb') || conversation.includes('plumbing') || conversation.includes('leak') || conversation.includes('drain') || conversation.includes('faucet')) {
      requirements.serviceType = 'Plumbing';
    } else if (conversation.includes('electric') || conversation.includes('electrical') || conversation.includes('outlet') || conversation.includes('wiring') || conversation.includes('lighting')) {
      requirements.serviceType = 'Electrical';
    } else if (conversation.includes('clean') || conversation.includes('cleaning')) {
      requirements.serviceType = 'Cleaning Services';
    } else if (conversation.includes('handyman') || conversation.includes('repair') || conversation.includes('fix')) {
      requirements.serviceType = 'Handyman Services';
    } else if (conversation.includes('hvac') || conversation.includes('heating') || conversation.includes('cooling') || conversation.includes('air conditioning')) {
      requirements.serviceType = 'HVAC Services';
    } else if (conversation.includes('floor') || conversation.includes('flooring') || conversation.includes('carpet') || conversation.includes('tile')) {
      requirements.serviceType = 'Flooring Services';
    } else if (conversation.includes('roof') || conversation.includes('roofing') || conversation.includes('gutter')) {
      requirements.serviceType = 'Roofing Services';
    }

    // Enhanced urgency detection
    if (conversation.includes('urgent') || conversation.includes('asap') || conversation.includes('immediately') || conversation.includes('emergency')) {
      requirements.urgency = 'high';
    } else if (conversation.includes('this week') || conversation.includes('soon') || conversation.includes('quickly')) {
      requirements.urgency = 'medium';
    } else {
      requirements.urgency = 'low';
    }

    // Enhanced budget extraction
    const budgetMatch = conversation.match(/\$(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    if (budgetMatch) {
      requirements.budget = budgetMatch[0];
    } else if (conversation.includes('budget') || conversation.includes('cost') || conversation.includes('price')) {
      // Try to extract budget ranges
      if (conversation.includes('under') || conversation.includes('less than')) {
        requirements.budget = 'Under $500';
      } else if (conversation.includes('around') || conversation.includes('approximately')) {
        requirements.budget = 'To be discussed';
      }
    }

    // Extract location
    const locationMatch = conversation.match(/(?:in|at|near)\s+([a-zA-Z\s]+?)(?:\s|$|,|\.)/);
    if (locationMatch) {
      requirements.location = locationMatch[1].trim();
    }

    return requirements;
  }

  private determineConversationStage(requirements: ConversationContext['jobRequirements'], messages: Array<{role: string; content: string; timestamp: Date}>): ConversationContext['conversationStage'] {
    const messageCount = messages.length;
    
    if (messageCount <= 2) return 'greeting';
    if (!requirements.serviceType) return 'discovery';
    if (!requirements.timeline || !requirements.budget) return 'requirements';
    if (messageCount < 6) return 'clarification';
    if (messageCount >= 6) return 'job_preparation';
    
    return 'clarification';
  }

  private isJobReady(aiResponse: string, context: ConversationContext): boolean {
    const response = aiResponse.toLowerCase();
    const requirements = context.jobRequirements;
    
    // Check if AI indicates job is ready
    if (response.includes('ready to create') || 
        response.includes('job posting') || 
        response.includes('post this job') ||
        response.includes('create the job')) {
      return true;
    }

    // Check if we have minimum required information
    return !!(requirements.serviceType && requirements.timeline && requirements.budget);
  }

  private extractJobDetails(context: ConversationContext): JobDetails {
    const req = context.jobRequirements;
    
    return {
      title: `${req.serviceType} - ${req.scope || 'General Service'}`,
      description: this.generateJobDescription(req),
      serviceType: req.serviceType || 'General Service',
      scope: req.scope || 'To be determined',
      timeline: req.timeline || 'Flexible',
      budget: req.budget || 'To be discussed',
      location: req.location || 'Location to be provided',
      urgency: req.urgency || 'medium',
      specialRequirements: req.specialRequirements || [],
      estimatedDuration: this.estimateDuration(req.serviceType),
      skillsRequired: this.getRequiredSkills(req.serviceType)
    };
  }

  private generateJobDescription(requirements: ConversationContext['jobRequirements']): string {
    let description = `Looking for a professional ${requirements.serviceType?.toLowerCase() || 'service provider'} to help with my project.`;
    
    if (requirements.scope) {
      description += ` Project scope: ${requirements.scope}.`;
    }
    
    if (requirements.timeline) {
      description += ` Timeline: ${requirements.timeline}.`;
    }
    
    if (requirements.budget) {
      description += ` Budget: ${requirements.budget}.`;
    }
    
    if (requirements.specialRequirements && requirements.specialRequirements.length > 0) {
      description += ` Special requirements: ${requirements.specialRequirements.join(', ')}.`;
    }
    
    return description;
  }

  private estimateDuration(serviceType?: string): string {
    const durations: Record<string, string> = {
      'Painting & Decorating': '2-5 days',
      'Plumbing': '1-3 days',
      'Electrical': '1-4 days',
      'Cleaning Services': '1-2 days',
      'Handyman Services': '1-3 days'
    };
    
    return durations[serviceType || ''] || '1-3 days';
  }

  private getRequiredSkills(serviceType?: string): string[] {
    const skills: Record<string, string[]> = {
      'Painting & Decorating': ['Painting', 'Color Matching', 'Surface Preparation', 'Interior/Exterior Work'],
      'Plumbing': ['Plumbing Repair', 'Pipe Installation', 'Leak Detection', 'Fixture Installation'],
      'Electrical': ['Electrical Wiring', 'Outlet Installation', 'Circuit Breaker Work', 'Safety Compliance'],
      'Cleaning Services': ['Deep Cleaning', 'Eco-friendly Products', 'Time Management', 'Attention to Detail'],
      'Handyman Services': ['General Repair', 'Tool Proficiency', 'Problem Solving', 'Multiple Trade Skills']
    };
    
    return skills[serviceType || ''] || ['Professional Service', 'Reliable', 'Licensed & Insured'];
  }

  // Method to reset conversation context
  resetContext(): ConversationContext {
    return {
      messages: [],
      jobRequirements: {},
      conversationStage: 'greeting'
    };
  }
}

export default new AIAssistant();
