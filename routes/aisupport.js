const express = require('express');
const router = express.Router();

function simpleResponder(text) {
  if (!text) return "Sorry, I didn't get that. Can you rephrase?";
  const t = text.toLowerCase();
  if (/\b(hi|hello|hey)\b/.test(t)) return "Hello! How can I help you today?";
  if (/\b(logout|signout)\b/.test(t)) return "Click on 'My Account' and there you can log out of your account.";
  if (/\b(submit|submission|post|publish)\b/.test(t)) return "To submit a story go to 'Submit a Story'.";
  if (/\b(view submissions|my submissions|all submissions)\b/.test(t)) return "You can view all submissions at the 'All Submissions' page or go to 'My Account' page just to view your own submissions.";
  if (/\b(faq|help|support)\b/.test(t)) return "You can check /faq or ask me a specific question.";
  if (/\b(thanks|thank you|cheers)\b/.test(t)) return "You're welcome!";
  return "I can help with account, submissions, and site basics. Ask something like \"How do I submit a story?\"";
}

router.get('/', (req, res) => {
  res.render('aisupport', { title: 'AI Support' });
});

router.post('/message', express.json(), (req, res) => {
  const userMsg = req.body && req.body.message ? String(req.body.message).slice(0, 2000) : '';
  const reply = simpleResponder(userMsg);
  res.json({ reply });
});

module.exports = router;