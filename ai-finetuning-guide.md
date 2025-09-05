# Home Services LLM Fine-Tuning Guide

## 🎯 **Approach 1: Prompt Engineering (Immediate Results)**

### Enhanced System Prompts
Your AI assistant now has domain-specific expertise in:
- 12 major home service categories
- Technical terminology and industry knowledge
- Structured conversation flow
- Expert-level questioning techniques

### Test the Enhanced Prompts
```bash
# Test with your current setup
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama2:7b",
    "prompt": "You are an expert AI assistant for Dwello home services. A user says: My kitchen faucet is leaking. Ask me 3 technical questions to understand the problem better.",
    "stream": false
  }'
```

## 🎯 **Approach 2: Few-Shot Learning (Quick Improvement)**

### Create Training Examples
Create a dataset of conversation examples:

```json
{
  "examples": [
    {
      "user": "My kitchen faucet is leaking",
      "ai": "I can help you with that faucet leak! To give you the most accurate estimate and find the right plumber, I need to understand the situation better. Can you tell me: 1) Is the leak coming from the base of the faucet, the spout, or around the handles? 2) How long has this been happening? 3) Have you noticed any water damage under the sink?",
      "service_type": "plumbing",
      "follow_up_questions": ["leak_location", "duration", "water_damage"]
    },
    {
      "user": "I need my living room painted",
      "ai": "Great! A fresh coat of paint can really transform a space. To create the perfect job posting for painters, I need some details: 1) What's the approximate square footage of the room? 2) Are you looking for interior or exterior painting? 3) Do you have a specific color scheme in mind, or would you like color consultation included?",
      "service_type": "painting",
      "follow_up_questions": ["square_footage", "interior_exterior", "color_preferences"]
    }
  ]
}
```

## 🎯 **Approach 3: RAG (Retrieval-Augmented Generation)**

### Create Knowledge Base
Build a database of home service knowledge:

```javascript
// knowledge-base.js
const homeServicesKnowledge = {
  plumbing: {
    common_issues: ["leaky faucets", "clogged drains", "running toilets", "low water pressure"],
    questions: [
      "What type of faucet do you have? (single-handle, double-handle, touchless)",
      "Is the leak constant or only when the faucet is in use?",
      "Have you tried tightening any connections?",
      "Is there any water damage visible?"
    ],
    budget_ranges: {
      "faucet_repair": "$75-$200",
      "faucet_replacement": "$150-$400",
      "drain_cleaning": "$100-$300"
    }
  },
  electrical: {
    common_issues: ["outlet not working", "flickering lights", "circuit breaker trips", "old wiring"],
    safety_questions: [
      "Are you experiencing any electrical shocks or sparks?",
      "Is this a new issue or ongoing problem?",
      "Do you have an older home (pre-1980s) with potential wiring issues?",
      "Are there any burning smells or unusual sounds?"
    ],
    budget_ranges: {
      "outlet_repair": "$100-$250",
      "outlet_replacement": "$150-$300",
      "circuit_breaker_repair": "$200-$500"
    }
  }
  // ... more categories
};
```

## 🎯 **Approach 4: Fine-Tuning with Custom Data**

### 1. Create Training Dataset

```python
# create_training_data.py
import json

# Home services conversation examples
training_data = [
    {
        "instruction": "You are a home services expert. Help users create detailed job postings by asking relevant technical questions.",
        "input": "My bathroom sink is draining slowly",
        "output": "I can help you with that slow-draining sink! This is a common plumbing issue. To find the right solution and get accurate quotes, I need to understand: 1) How long has this been happening? 2) Is it just one sink or multiple drains? 3) Have you tried any DIY solutions like drain cleaner? 4) Do you notice any unusual smells or gurgling sounds? This information will help determine if it's a simple clog or a more complex drainage issue."
    },
    {
        "instruction": "You are a home services expert. Help users create detailed job postings by asking relevant technical questions.",
        "input": "I want to install recessed lighting in my living room",
        "output": "Excellent choice! Recessed lighting can really enhance your living space. To create the perfect job posting for an electrician, I need some details: 1) What's the ceiling height and room dimensions? 2) Do you have existing electrical in the ceiling, or will new wiring be needed? 3) How many lights are you thinking, and what's your preferred spacing? 4) Do you want dimmable lights and smart controls? 5) What's your timeline for this project?"
    }
    # Add 100+ more examples
]

# Save as JSONL format for fine-tuning
with open('home_services_training.jsonl', 'w') as f:
    for item in training_data:
        f.write(json.dumps(item) + '\n')
```

### 2. Fine-Tune with Ollama

```bash
# Create a custom model
ollama create home-services-llm -f Modelfile

# Modelfile content:
FROM llama2:7b
TEMPLATE """{{ if .System }}<|system|>
{{ .System }}<|end|>
{{ end }}{{ if .Prompt }}<|user|>
{{ .Prompt }}<|end|>
{{ end }}<|assistant|>
{{ .Response }}<|end|>"""
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER num_ctx 4096
```

### 3. Use Custom Model

```javascript
// Update AIAssistant.ts
private model = 'home-services-llm'; // Use your custom model
```

## 🎯 **Approach 5: Advanced Fine-Tuning with LoRA**

### 1. Install Dependencies

```bash
pip install transformers datasets accelerate peft
```

### 2. Create Training Script

```python
# fine_tune_lora.py
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer
from peft import LoraConfig, get_peft_model, TaskType
import json

# Load your training data
def load_training_data():
    data = []
    with open('home_services_training.jsonl', 'r') as f:
        for line in f:
            data.append(json.loads(line))
    return data

# Configure LoRA
lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,
    lora_alpha=32,
    lora_dropout=0.1,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"]
)

# Fine-tune the model
def fine_tune_model():
    model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-2-7b-hf")
    model = get_peft_model(model, lora_config)
    
    training_args = TrainingArguments(
        output_dir="./home-services-llm",
        per_device_train_batch_size=4,
        gradient_accumulation_steps=4,
        num_train_epochs=3,
        learning_rate=2e-4,
        fp16=True,
        logging_steps=10,
        save_steps=100
    )
    
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
    )
    
    trainer.train()
    trainer.save_model()

if __name__ == "__main__":
    fine_tune_model()
```

## 🎯 **Approach 6: Domain-Specific Knowledge Integration**

### Create Service-Specific Question Templates

```javascript
// service-templates.js
const serviceQuestionTemplates = {
  plumbing: {
    leak_repair: [
      "Where exactly is the leak located?",
      "Is it a constant drip or intermittent?",
      "Have you noticed any water damage?",
      "Is this a new issue or recurring problem?"
    ],
    drain_cleaning: [
      "Which drains are affected?",
      "How long has this been happening?",
      "Have you tried any DIY solutions?",
      "Are there any unusual smells or sounds?"
    ]
  },
  electrical: {
    outlet_issues: [
      "Is the outlet completely dead or intermittent?",
      "Are other outlets in the room affected?",
      "Do you have GFCI outlets that might have tripped?",
      "Is this in a kitchen, bathroom, or outdoor area?"
    ],
    lighting_installation: [
      "What type of lighting are you installing?",
      "Is there existing electrical in the ceiling?",
      "What's your ceiling height and room size?",
      "Do you want dimmable or smart controls?"
    ]
  }
  // ... more templates
};
```

## 🎯 **Immediate Implementation Steps**

### 1. Test Enhanced Prompts
```bash
# Test the improved AI assistant
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama2:7b",
    "prompt": "You are an expert AI assistant for Dwello home services. A user says: I need help with my bathroom renovation. Ask me 5 specific technical questions to understand their project requirements.",
    "stream": false
  }'
```

### 2. Create Knowledge Base
```javascript
// Add to your AIAssistant.ts
private getServiceSpecificQuestions(serviceType: string, issue: string): string[] {
  const questions = {
    'plumbing': {
      'leak': ['Where is the leak located?', 'Is it constant or intermittent?', 'Any water damage visible?'],
      'drain': ['Which drains are affected?', 'How long has this been happening?', 'Any unusual smells?']
    },
    'electrical': {
      'outlet': ['Is the outlet completely dead?', 'Are other outlets affected?', 'GFCI outlets present?'],
      'lighting': ['What type of lighting?', 'Existing electrical in ceiling?', 'Ceiling height and room size?']
    }
  };
  
  return questions[serviceType]?.[issue] || [];
}
```

### 3. Monitor and Iterate
- Track conversation quality
- Collect user feedback
- A/B test different prompts
- Continuously improve based on real usage

## 📊 **Expected Results**

After implementing these approaches:
- **More relevant questions** for each service type
- **Better technical understanding** of home maintenance
- **Improved job posting quality** with proper details
- **Higher conversion rates** from conversation to job posting
- **Better user experience** with expert-level guidance

Start with Approach 1 (enhanced prompts) for immediate results, then gradually implement the other approaches based on your needs and resources.
