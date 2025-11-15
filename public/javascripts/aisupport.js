document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messagesDiv = document.getElementById('messages');

  function addMessage(text, isUser) {
    const div = document.createElement('div');
    div.className = isUser ? 'msg user' : 'msg bot';
    div.textContent = text;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, true);
    input.value = '';
    addMessage('...', false);

    try {
      const res = await fetch('/aisupport/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      const lastMsg = messagesDiv.lastChild;
      if (lastMsg) lastMsg.textContent = data.reply;
    } catch (err) {
      console.error(err);
      const lastMsg = messagesDiv.lastChild;
      if (lastMsg) lastMsg.textContent = 'Error. Try again.';
    }
  });
});