
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { csvData } = await req.json();
    
    // Log the received data for debugging
    console.log("Received CSV data for ML processing");
    
    // Create a system prompt that instructs the ML model how to process financial data
    const systemPrompt = `
      You are a highly accurate financial data processing AI with 99.9999% accuracy.
      Your task is to analyze CSV financial data and extract the following:
      1. Income amounts
      2. Deductions under various sections (80C, 80D, 80G, etc.)
      3. HRA and LTA benefits
      4. Any other relevant financial information

      For each field, return the exact numeric value without any currency symbols.
      Return the data in a structured JSON format that can be easily parsed.
      
      Ensure maximum accuracy in your parsing - round to 2 decimal places when necessary.
      If you detect any anomalies or potential errors in the data, flag them.
    `;
    
    // Process the CSV data with OpenAI's GPT model
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Process this financial CSV data with maximum accuracy: ${csvData}` }
        ],
        temperature: 0.1, // Low temperature for more deterministic results
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }
    
    // Extract the processed data from the OpenAI response
    const processedContent = data.choices[0].message.content;
    
    // Parse the content to extract structured data
    let structuredData;
    try {
      // First try to extract JSON from the response if it's wrapped in text
      const jsonMatch = processedContent.match(/```json\n([\s\S]*)\n```/) || 
                        processedContent.match(/```\n([\s\S]*)\n```/) ||
                        processedContent.match(/{[\s\S]*}/);
                        
      const jsonString = jsonMatch ? jsonMatch[0] : processedContent;
      structuredData = JSON.parse(jsonString.replace(/```json\n|```\n|```/g, ''));
    } catch (e) {
      console.error('Error parsing structured data:', e);
      // If parsing fails, return the raw processed content
      structuredData = { rawResponse: processedContent, parsingError: true };
    }
    
    console.log("ML processing complete, returning structured data");
    
    return new Response(JSON.stringify({ 
      success: true, 
      data: structuredData,
      rawResponse: processedContent
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in process-csv-ml function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
