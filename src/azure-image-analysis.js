import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

const visionKey = process.env.REACT_APP_VISION_KEY;
const visionEndpoint = process.env.REACT_APP_VISION_ENDPOINT;

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': visionKey } }),
  visionEndpoint
);

export function isConfigured() {
  return (typeof visionKey !== 'undefined') && (typeof visionEndpoint !== 'undefined');
}

export function analyzeImage(imageURL) {
  return computerVisionClient.analyzeImage(imageURL, { visualFeatures: ['Tags', 'Description', 'Objects'] })
    .then(response => response)
    .catch(error => {
      console.error(error);
    });
}