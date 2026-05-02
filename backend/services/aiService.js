const OpenAI = require('openai');

let openai = null;

const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.AI_BASE_URL;

if (!apiKey || apiKey === 'sk-your-openai-api-key-here') {
  throw new Error('AI API Key is missing. Please set OPENAI_API_KEY in .env');
}

openai = new OpenAI({ 
  apiKey,
  baseURL: baseURL || undefined
});

const AI_MODEL = baseURL?.includes('nvidia') ? 'meta/llama-3.1-8b-instruct' : 'gpt-3.5-turbo';

// ─── AI Image Prompt Generator ──────────────────────────────────
async function generateImagePrompts(topic, style) {
  try {
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{
        role: 'system',
        content: `You are an expert AI art prompt engineer. Generate 3 high-quality image prompts for Instagram content based on a topic and style. Return JSON: { "prompts": [ { "title": "...", "prompt": "...", "description": "..." } ] }`
      }, {
        role: 'user',
        content: `Topic: ${topic}, Style: ${style}`
      }],
      temperature: 0.8,
    });

    return JSON.parse(response.choices[0].message.content);
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
        content: `You are a social media growth expert. Generate a highly engaging Instagram caption for the given topic and tone. Return JSON: { "caption": "...", "hashtags": ["...", "..."] }`
      }, {
        role: 'user',
        content: `Topic: ${topic}, Tone: ${tone}`
      }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    try {
      return JSON.parse(content);
    } catch {
      // Fallback if AI returns non-JSON
      return { caption: content, hashtags: [] };
    }
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
        content: `You are a viral content strategist. Generate 4 post ideas and 4 reel ideas for a specific niche. Return JSON: { "postIdeas": [ { "title": "...", "description": "...", "format": "..." } ], "reelIdeas": [ { "title": "...", "description": "...", "duration": "..." } ] }`
      }, {
        role: 'user',
        content: `Niche: ${niche}`
      }],
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    try {
      return JSON.parse(content);
    } catch {
      throw new Error('Invalid AI response format');
    }
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
        content: `You are an Instagram algorithm expert. Analyze the caption for viral potential (0-100). Return JSON: { "score": 85, "breakdown": { "emojiUsage": 80, "hashtagQuality": 70, "captionLength": 90, "callToAction": 85, "hookStrength": 95 }, "suggestions": ["...", "..."], "improvedCaption": "..." }`
      }, {
        role: 'user',
        content: `Caption: ${caption}`
      }],
      temperature: 0.7,
    });

    return JSON.parse(response.choices[0].message.content);
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
        content: `You are a branding expert. Optimize the Instagram bio for better conversion. Return JSON: { "improvedBios": ["...", "..."], "usernameSuggestions": ["...", "..."], "tips": ["...", "..."] }`
      }, {
        role: 'user',
        content: `Bio: ${bio}`
      }],
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    try {
      return JSON.parse(content);
    } catch {
      throw new Error('Invalid AI response format');
    }
  } catch (error) {
    throw new Error('Failed to optimize profile: ' + error.message);
  }
}

// ─── AI Image Generator (NVIDIA NIM) ───────────────────────────
async function generateImage(prompt) {
  try {
    const response = await openai.images.generate({
      model: 'stabilityai/sdxl-turbo',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json'
    });

    return { 
      url: `data:image/png;base64,${response.data[0].b64_json}`,
      revised_prompt: response.data[0].revised_prompt 
    };
  } catch (error) {
    throw new Error('Failed to generate image: ' + error.message);
  }
}

module.exports = {
  generateCaption,
  generateIdeas,
  predictViralScore,
  optimizeProfile,
  generateImagePrompts,
  generateImage
};
