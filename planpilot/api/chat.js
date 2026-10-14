// Vercel serverless endpoint for PlanPilot.
// Set OPENAI_API_KEY in Vercel Project Settings > Environment Variables.
// Optional: set OPENAI_MODEL (defaults to gpt-4.1-mini).
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
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ error: 'AI is not configured yet. Add OPENAI_API_KEY to the Vercel environment variables.' });
  }
  try {
    const body = req.body || {};
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (!prompt) return res.status(400).json({ error: 'Please enter a message.' });
    if (prompt.length > 4000) return res.status(413).json({ error: 'Message is too long (maximum 4000 characters).' });
    const tasks = Array.isArray(body.tasks) ? body.tasks.slice(0, 100).map(t => ({
      title: String(t.title || '').slice(0, 180),
      due: String(t.due || ''),
      priority: ['High', 'Normal', 'Low'].includes(t.priority) ? t.priority : 'Normal',
      done: Boolean(t.done)
    })) : [];
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        instructions: 'You are PlanPilot, a helpful productivity and planning assistant inside MosSuite. Answer in the same language as the user. Use the provided task list to make practical suggestions. Be concise, structured, and honest. You may suggest tasks but do not claim to have changed the task list; the website handles task creation separately. Do not claim to be Microsoft Copilot.',
        input: 'User task list (JSON):\n' + JSON.stringify(tasks) + '\n\nUser request:\n' + prompt,
        max_output_tokens: 700
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data?.error?.message || 'The AI provider returned an error.';
      return res.status(response.status === 429 ? 429 : 502).json({ error: message });
    }
    const answer = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === 'output_text')
      .map(item => item.text)
      .join('\n').trim();
    if (!answer) return res.status(502).json({ error: 'The AI returned an empty response. Please try again.' });
    return res.status(200).json({ answer });
  } catch (error) {
    console.error('PlanPilot AI error:', error);
    return res.status(500).json({ error: 'Could not contact the AI service. Please try again.' });
  }
}
