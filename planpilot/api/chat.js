import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// PlanPilot serverless AI endpoint.
// Prefer AI Gateway when configured; otherwise use the project's existing OpenAI key.
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const origin = req.headers.origin || '';
  if (origin === 'https://moswebgr.github.io') {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Use POST for chat requests.' });
  }

  const useGateway = Boolean(process.env.AI_GATEWAY_API_KEY);
  const useOpenAI = Boolean(process.env.OPENAI_API_KEY);
  if (!useGateway && !useOpenAI) {
    return res.status(503).json({
      error: 'AI is not configured. Add AI_GATEWAY_API_KEY or OPENAI_API_KEY in Vercel.'
    });
  }

  try {
    const body = req.body || {};
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (!prompt) return res.status(400).json({ error: 'Please enter a message.' });
    if (prompt.length > 4000) {
      return res.status(413).json({ error: 'Message is too long (maximum 4000 characters).' });
    }

    const tasks = Array.isArray(body.tasks) ? body.tasks.slice(0, 100).map(t => ({
      title: String(t.title || '').slice(0, 180),
      due: String(t.due || ''),
      priority: ['High', 'Normal', 'Low'].includes(t.priority) ? t.priority : 'Normal',
      done: Boolean(t.done)
    })) : [];

    const model = useGateway
      ? 'moonshotai/kimi-k3'
      : createOpenAI({ apiKey: process.env.OPENAI_API_KEY })('gpt-4o-mini');

    const { text } = await generateText({
      model,
      system: 'You are PlanPilot, a helpful productivity and planning assistant inside MosSuite. Answer in the same language as the user. Use the provided task list to make practical suggestions. Be concise, structured, and honest. You may suggest tasks but do not claim to have changed the task list; the website handles task creation separately. Do not claim to be Microsoft Copilot.',
      prompt: 'User task list (JSON):\n' + JSON.stringify(tasks) + '\n\nUser request:\n' + prompt,
      maxOutputTokens: 700
    });

    if (!text || !text.trim()) {
      return res.status(502).json({ error: 'The AI returned an empty response. Please try again.' });
    }
    return res.status(200).json({ answer: text.trim() });
  } catch (error) {
    console.error('PlanPilot AI provider error:', error);
    const message = String(error?.message || '');
    if (/unauthorized|invalid api key|authentication/i.test(message)) {
      return res.status(502).json({ error: 'AI authentication failed. Check the configured API key in Vercel.' });
    }
    if (/quota|credit|billing|rate.?limit|too many requests/i.test(message)) {
      return res.status(429).json({ error: 'AI quota or rate limit reached. Check the provider usage and billing.' });
    }
    return res.status(502).json({ error: 'Could not generate an AI response. Check the Vercel function logs for details.' });
  }
}
