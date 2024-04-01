/*
  Using the OpenAI Node.js library in a browser environment is not recommended for security reasons.
  This is why we rely on a standard REST call to the OpenAI API.
*/
// #region presentation
const openaiKey = process.env.REACT_APP_OPENAI_API_KEY;

export function isConfigured() {
  return typeof openaiKey !== 'undefined';
}

export function generateImage(prompt) {
  return fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({
      prompt: prompt
    })
  })
    .then(res => res.json())
    .then(res => res.data[0].url)
    .catch(err => console.error(err));
}
// #endregion presentation
