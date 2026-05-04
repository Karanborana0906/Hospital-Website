/**
 * Service to handle communication with external AI providers
 */
export const fetchAIResponse = async (message) => {
  try {
    const response = await fetch('https://api.skilledu.in/api/ai_gateway.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        model: 'llama-3.1-8b-instant',
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    // Return the response text found in various possible fields
    return data.response || data.message || data.text || 'Sorry, I am unable to process your request at the moment.';
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
};
