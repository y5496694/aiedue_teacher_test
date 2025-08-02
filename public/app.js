// public/app.js
document.getElementById('sendBtn').addEventListener('click', async () => {
  const prompt = document.getElementById('prompt').value;
  if (!prompt) return alert('프롬프트를 입력하세요.');

  try {
    const res = await fetch('/generateGemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error('응답 실패');
    const { text } = await res.json();
    document.getElementById('result').textContent = text;
  } catch (e) {
    console.error(e);
    alert('에러 발생: ' + e.message);
  }
});
