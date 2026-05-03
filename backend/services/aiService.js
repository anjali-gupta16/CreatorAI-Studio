const OpenAI = require('openai');

let openai = null;

const apiKey = process.env.OPENAI_API_KEY;
const imageApiKey = process.env.IMAGE_API_KEY || apiKey;
const baseURL = process.env.AI_BASE_URL;

if (!apiKey || apiKey === 'sk-your-openai-api-key-here') {
  throw new Error('AI API Key is missing. Please set OPENAI_API_KEY in .env');
}

openai = new OpenAI({ 
  apiKey,
  baseURL: baseURL || undefined
});

const AI_MODEL = baseURL?.includes('nvidia') 
  ? 'meta/llama-3.1-8b-instruct' 
  : baseURL?.includes('openrouter')
    ? 'meta-llama/llama-3.1-8b-instruct'
    : 'gpt-3.5-turbo';

// ─── Helper: Clean and Parse AI JSON ───────────────────────────
function parseAIResponse(content) {
  try {
    // Remove markdown code blocks (```json or ```)
    const cleaned = content.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed to parse AI response:', content);
    // Return a structured fallback if parsing fails entirely
    if (content.includes('{')) {
      // Attempt a looser extraction if it's not perfect JSON
      try {
        const start = content.indexOf('{');
        const end = content.lastIndexOf('}') + 1;
        return JSON.parse(content.substring(start, end));
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}

// ─── AI Image Prompt Generator ──────────────────────────────────
async function generateImagePrompts(topic, style) {
  try {
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{
        role: 'system',
        content: `You are an expert AI art prompt engineer. Generate 3 high-quality image prompts for Instagram content based on a topic and style. ONLY return raw JSON without any markdown formatting or backticks. JSON: { "prompts": [ { "title": "...", "prompt": "...", "description": "..." } ] }`
      }, {
        role: 'user',
        content: `Topic: ${topic}, Style: ${style}`
      }],
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    const parsed = parseAIResponse(content);
    if (!parsed) throw new Error('Invalid AI response format');
    return parsed;
  } catch (error) {
    throw new Error('Failed to generate image prompts: ' + error.message);
  }
}

// ─── AI Caption Generator ───────────────────────────────────────
async function generateCaption(topic, tone) {
  try {
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{
        role: 'system',
        content: `You are a social media growth expert. Generate a highly engaging Instagram caption with relevant emojis for the given topic and tone. ONLY return raw JSON without any markdown formatting or backticks. JSON format: { "caption": "...", "hashtags": ["...", "..."] }`
      }, {
        role: 'user',
        content: `Topic: ${topic}, Tone: ${tone}`
      }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    const parsed = parseAIResponse(content);
    
    if (parsed) return parsed;
    
    // Final fallback: Treat as raw text if parsing still fails
    return { 
      caption: content.replace(/```json|```/g, '').trim(), 
      hashtags: [] 
    };
  } catch (error) {
    throw new Error('Failed to generate caption: ' + error.message);
  }
}

// ─── AI Ideas Generator ─────────────────────────────────────────
async function generateIdeas(niche) {
  try {
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{
        role: 'system',
        content: `You are a viral content strategist. Generate 4 post ideas and 4 reel ideas for a specific niche. ONLY return raw JSON without any markdown formatting or backticks. JSON: { "postIdeas": [ { "title": "...", "description": "...", "format": "..." } ], "reelIdeas": [ { "title": "...", "description": "...", "duration": "..." } ] }`
      }, {
        role: 'user',
        content: `Niche: ${niche}`
      }],
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    const parsed = parseAIResponse(content);
    if (!parsed) throw new Error('Invalid AI response format');
    return parsed;
  } catch (error) {
    throw new Error('Failed to generate ideas: ' + error.message);
  }
}

// ─── Viral Score Predictor ──────────────────────────────────────
async function predictViralScore(caption) {
  try {
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{
        role: 'system',
        content: `You are an Instagram algorithm expert. Analyze the caption for viral potential (0-100). ONLY return raw JSON without any markdown formatting or backticks. JSON: { "score": 85, "breakdown": { "emojiUsage": 80, "hashtagQuality": 70, "captionLength": 90, "callToAction": 85, "hookStrength": 95 }, "suggestions": ["...", "..."], "improvedCaption": "..." }`
      }, {
        role: 'user',
        content: `Caption: ${caption}`
      }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    const parsed = parseAIResponse(content);
    if (!parsed) throw new Error('Invalid AI response format');
    return parsed;
  } catch (error) {
    throw new Error('Failed to predict viral score: ' + error.message);
  }
}

// ─── Profile Optimizer ──────────────────────────────────────────
async function optimizeProfile(bio) {
  try {
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{
        role: 'system',
        content: `You are a branding expert. Optimize the Instagram bio for better conversion, including relevant emojis. ONLY return raw JSON without any markdown formatting or backticks. JSON: { "improvedBios": ["...", "..."], "usernameSuggestions": ["...", "..."], "tips": ["...", "..."] }`
      }, {
        role: 'user',
        content: `Bio: ${bio}`
      }],
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    const parsed = parseAIResponse(content);
    if (!parsed) throw new Error('Invalid AI response format');
    return parsed;
  } catch (error) {
    throw new Error('Failed to optimize profile: ' + error.message);
  }
}

// ─── AI Image Generator (NVIDIA NIM) ───────────────────────────
async function generateImage(prompt) {
  const models = [
    { name: 'stabilityai/sdxl-turbo', url: 'https://ai.api.nvidia.com/v1' },
    { name: 'stability-ai/sdxl-turbo', url: 'https://ai.api.nvidia.com/v1' },
    { name: 'stabilityai/stable-diffusion-xl', url: 'https://ai.api.nvidia.com/v1' },
    { name: 'stability-ai/stable-diffusion-xl', url: 'https://ai.api.nvidia.com/v1' },
    { name: 'black-forest-labs/flux-1-schnell', url: 'https://ai.api.nvidia.com/v1' },
    { name: 'nvidia/sdxl-turbo', url: 'https://ai.api.nvidia.com/v1' },
    { name: 'stabilityai/sdxl-turbo', url: 'https://integrate.api.nvidia.com/v1' }
  ];

  for (const model of models) {
    try {
      console.log(`[AI] Attempting image generation with ${model.name} at ${model.url}...`);
      
      const imageClient = new OpenAI({
        apiKey: imageApiKey,
        baseURL: model.url
      });

      const response = await imageClient.images.generate({
        model: model.name,
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json'
      });

      console.log(`[AI] Success with ${model.name}`);
      return { 
        url: `data:image/png;base64,${response.data[0].b64_json}`,
        revised_prompt: prompt 
      };
    } catch (error) {
      console.warn(`[AI] Model ${model.name} failed:`, error.message);
      // Continue to next model if it's a 404 or permission error
    }
  }

  // Final fallback: Try the direct genai endpoint with a custom fetch
  try {
    console.log('[AI] Trying direct GENAI endpoint (hyphenated) as last resort...');
    const response = await fetch('https://ai.api.nvidia.com/v1/genai/stability-ai/sdxl-turbo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${imageApiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text_prompts: [{ text: prompt, weight: 1 }],
        seed: Math.floor(Math.random() * 1000000),
        sampler: "K_EULER_ANCESTRAL",
        steps: 4,
        cfg_scale: 5
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.artifacts && data.artifacts[0]) {
        return { 
          url: `data:image/png;base64,${data.artifacts[0].base64}`,
          revised_prompt: prompt 
        };
      }
    }
  } catch (e) {
    console.error('[AI] Direct endpoint also failed');
  }

  throw new Error('Image generation failed: All available NVIDIA NIM models (SDXL, SDXL-Turbo, FLUX) are either not found or not enabled for your account. Please check your NVIDIA NIM dashboard.');
}

// ─── AI Reel Script Generator ──────────────────────────────────
async function generateReelScript(topic) {
  try {
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{
        role: 'system',
        content: `You are a professional video producer. Generate a 30-60 second Instagram Reel script with emojis in the visual and audio descriptions. ONLY return raw JSON without any markdown formatting or backticks. JSON: { "scenes": [ { "scene": 1, "visual": "...", "audio": "...", "duration": "..." } ], "hook": "...", "cta": "..." }`
      }, {
        role: 'user',
        content: `Topic: ${topic}`
      }],
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    const parsed = parseAIResponse(content);
    if (!parsed) throw new Error('Invalid AI response format');
    return parsed;
  } catch (error) {
    throw new Error('Failed to generate reel script: ' + error.message);
  }
}

// ─── AI Hashtag Researcher ──────────────────────────────────────
async function researchHashtags(niche) {
  try {
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{
        role: 'system',
        content: `You are a social media SEO expert. Research high-performance hashtags for a niche. ONLY return raw JSON without any markdown formatting or backticks. JSON: { "categories": [ { "name": "Viral/Broad", "hashtags": ["...", "..."] }, { "name": "Targeted/Niche", "hashtags": ["...", "..."] }, { "name": "Low Competition", "hashtags": ["...", "..."] } ], "strategy": "..." }`
      }, {
        role: 'user',
        content: `Niche: ${niche}`
      }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    const parsed = parseAIResponse(content);
    if (!parsed) throw new Error('Invalid AI response format');
    return parsed;
  } catch (error) {
    throw new Error('Failed to research hashtags: ' + error.message);
  }
}

module.exports = {
  generateCaption,
  generateIdeas,
  predictViralScore,
  optimizeProfile,
  generateImagePrompts,
  generateImage,
  generateReelScript,
  researchHashtags
};
