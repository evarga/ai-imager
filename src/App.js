import React, { useState } from 'react';
import './App.css';
import { analyzeImage, isConfigured as isConfiguredAnalyzer } from './azure-image-analysis';
import { generateImage, isConfigured as isConfiguredGenerator } from './openai-image-generation';

function displayResults(results, shouldFormat = true) {
  if (shouldFormat)
    results = JSON.stringify(results, null, 2);
  document.getElementById("output").innerHTML = `<pre>${results}</pre>`;
}

function App() {
  const [cursorStyle, setCursorStyle] = useState('default');

  if (isConfiguredAnalyzer() === false || isConfiguredGenerator() === false) {
    return (<body>Key and/or endpoint not configured for cognitive services!</body>)
  }

  return (
    <div className="App" style={{ cursor: cursorStyle }}>
      <header className="App-header">
        <p>AI Image Analyzer and Generator</p>
      </header>
      <div>
        <p>Insert image URL or type prompt:</p>
        <input
          type="text"
          id="image-url-or-prompt"
          placeholder="Enter URL to analyze or textual prompt to generate an image"
        />
        <div className="button-container">
          <button
            id="analyze-button"
            onClick={() => {
              setCursorStyle('wait');
              const imageURL = document.getElementById("image-url-or-prompt").value;
              const image = document.getElementById('image');
              image.src = imageURL;
              analyzeImage(imageURL)
                .then(response => {
                  displayResults(response);
                  setCursorStyle('default');
                });
            }}
          >
            Analyze
          </button>
          <button
            id="generate-button"
            onClick={() => {
              setCursorStyle('wait');
              const prompt = document.getElementById("image-url-or-prompt").value;
              const image = document.getElementById('image');
              generateImage(prompt)
                .then(response => {
                  image.src = response;
                  displayResults("", false);
                  setCursorStyle('default');
                });
            }}
          >
            Generate</button>
        </div>
        <hr />
        <img id="image" alt=""/>
        <div id="output" />
      </div>
    </div>
  );
}

export default App;