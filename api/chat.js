import { generateText } from 'ai';

// PlanPilot serverless AI endpoint. On Vercel, AI SDK can authenticate with
// Vercel OIDC, so an exhausted unrelated OPENAI_API_KEY must not be used as fallback.

function localFallback(prompt, tasks) {
  const p = String(prompt || '').toLowerCase();
  const today = new Date();
  const day = today.toISOString().slice(0, 10);
  const open = tasks.filter(t => !t.done);
  const overdue = open.filter(t => t.due && t.due < day);
  const dueToday = open.filter(t => t.due === day);
  const high = open.filter(t => t.priority === 'High');
  if (/connection successful|test connection|exactly: planpilot/i.test(p)) {
    return 'PlanPilot connection successful. The built-in planning assistant is working. Cloud AI is currently unavailable because its provider quota is exhausted.';
  }
  if (/hello|\bhi\b|hey|help|what can you do|γειά|γεια|καλησπέρα|καλημέρα/i.test(p)) {
    return 'Γεια σου! Είμαι ο ενσωματωμένος βοηθός του PlanPilot. Μπορώ να σε βοηθήσω να οργανώσεις την ημέρα σου, να βρεις επείγουσες εργασίες, να κάνεις εβδομαδιαίο απολογισμό και να σπάσεις ένα project σε βήματα. Το Cloud AI είναι προσωρινά μη διαθέσιμο, οπότε χρησιμοποιώ τοπικούς κανόνες.';
  }
  if (/weekly|week|overview|summary|εβδομαδ|σύνοψ|απολογισ/i.test(p)) {
    return 'Περίληψη εργασιών:\n• Εκκρεμείς: ' + open.length + '\n• Υψηλής προτεραιότητας: ' + high.length + '\n• Εκπρόθεσμες: ' + overdue.length + '\n• Για σήμερα: ' + dueToday.length + '\n• Ολοκληρωμένες: ' + tasks.filter(t => t.done).length + '\n\n' + (overdue.length ? 'Ξεκίνα ελέγχοντας τις εκπρόθεσμες εργασίες.' : high.length ? 'Δώσε προτεραιότητα σε μία εργασία υψηλής προτεραιότητας.' : 'Διάλεξε την πιο σημαντική εργασία και προγραμμάτισε χρόνο για αυτήν.');
  }
  if (/urgent|overdue|priority|priorit|attention|important|επείγ|προτεραι|εκπρόθεσμ/i.test(p)) {
    const items = [...overdue, ...high.filter(t => !overdue.includes(t))];
    return items.length ? 'Εργασίες που χρειάζονται προσοχή:\n' + items.slice(0, 8).map((t, i) => (i + 1) + '. ' + t.title + (t.due ? ' — προθεσμία ' + t.due : '') + ' (' + t.priority + ')').join('\n') : 'Δεν φαίνεται κάποια επείγουσα εργασία. Έχεις ' + open.length + ' εκκρεμείς εργασίες. Πρόσθεσε προθεσμίες και υψηλή προτεραιότητα όπου χρειάζεται.';
  }
  if (/plan my day|today|daily|οργάνωσε.*ημέρα|πρόγραμμα.*σήμερα|σήμερα/i.test(p)) {
    const items = [...overdue, ...dueToday.filter(t => !overdue.includes(t)), ...high.filter(t => !overdue.includes(t) && !dueToday.includes(t))];
    return 'Πλάνο για σήμερα:\n' + (items.length ? items.slice(0, 5).map((t, i) => (i + 1) + '. ' + t.title + (t.due ? ' — ' + (t.due < day ? 'εκπρόθεσμη' : 'προθεσμία ' + t.due) : '') + ' (' + t.priority + ')').join('\n') : '1. Διάλεξε τη σημαντικότερη εργασία.\n2. Δούλεψε συγκεντρωμένα για 25 λεπτά.\n3. Κάνε διάλειμμα και ενημέρωσε τη λίστα.') + '\n\nΣύνολο εκκρεμών εργασιών: ' + open.length + '.';
  }
  if (/break down|steps|split|project into steps|βήματα|σπάσε.*project|σπάσε.*έργο/i.test(p)) {
    return 'Πρότειναμενα βήματα για το project σου:\n1. Όρισε το αποτέλεσμα και την προθεσμία.\n2. Κατέγραψε απαιτήσεις και διαθέσιμους πόρους.\n3. Χώρισέ το σε μικρά παραδοτέα.\n4. Ολοκλήρωσε πρώτα το μικρότερο ουσιαστικό βήμα.\n5. Έλεγξε την πρόοδο και προσαρμόσου.\n\nΜπορείς να προσθέσεις κάθε βήμα ως εργασία από τη φόρμα My tasks.';
  }
  if (/add task|create task|new task|πρόσθεσε εργασία/i.test(p)) {
    return 'Μπορώ να αναλύσω και να οργανώσω τις εργασίες που υπάρχουν ήδη, αλλά η προσθήκη νέας εργασίας γίνεται από τη φόρμα «My tasks» στη σελίδα. Το Cloud AI είναι προσωρινά μη διαθέσιμο λόγω ορίου χρήσης.';
  }
  return 'Το Cloud AI είναι προσωρινά μη διαθέσιμο επειδή ο πάροχος έχει εξαντλήσει το όριο χρήσης. Ο ενσωματωμένος βοηθός εξακολουθεί να λειτουργεί για πλάνο ημέρας, προτεραιότητες, εβδομαδιαία σύνοψη και διάσπαση project σε βήματα.\n\nΕκκρεμείς: ' + open.length + ' · Υψηλής προτεραιότητας: ' + high.length + ' · Εκπρόθεσμες: ' + overdue.length + ' · Για σήμερα: ' + dueToday.length + '.';
}

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

    const { text } = await generateText({
      model: 'moonshotai/kimi-k3',
      system: 'You are PlanPilot, a helpful productivity and planning assistant inside MosSuite. Answer in the same language as the user. Use the provided task list to make practical suggestions. Be concise, structured, and honest. You may suggest tasks but do not claim to have changed the task list; the website handles task creation separately. Do not claim to be Microsoft Copilot.',
      prompt: 'User task list (JSON):\n' + JSON.stringify(tasks) + '\n\nUser request:\n' + prompt,
      maxOutputTokens: 700
    });

    if (!text || !text.trim()) {
      return res.status(502).json({ error: 'The AI returned an empty response. Please try again.' });
    }
    return res.status(200).json({ answer: text.trim() });
  } catch (error) {
    console.error('PlanPilot AI Gateway error:', error);
    const message = String(error?.message || '');
    if (/unauthorized|invalid api key|authentication/i.test(message)) {
      return res.status(502).json({ error: 'Vercel AI Gateway authentication failed. Check AI Gateway availability and project access.' });
    }
    if (/quota|credit|billing|rate.?limit|too many requests/i.test(message)) {
      const fallbackBody = req.body || {};\n      const fallbackPrompt = typeof fallbackBody.prompt === 'string' ? fallbackBody.prompt.trim() : '';\n      const fallbackTasks = Array.isArray(fallbackBody.tasks) ? fallbackBody.tasks.slice(0, 100).map(t => ({ title: String(t.title || '').slice(0, 180), due: String(t.due || ''), priority: ['High', 'Normal', 'Low'].includes(t.priority) ? t.priority : 'Normal', done: Boolean(t.done) })) : [];\n      return res.status(200).json({ answer: localFallback(fallbackPrompt, fallbackTasks), mode: 'local-fallback', notice: 'Cloud AI quota is unavailable; using built-in planning rules.' });
    }
    return res.status(502).json({ error: 'Could not generate a response through Vercel AI Gateway. Check the Vercel function logs for details.' });
  }
}
