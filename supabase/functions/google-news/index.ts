
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const NEWS_API_KEY = '4959dcb5fd4243f59f783317890a2b94';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body if it exists
    const { query = 'tax india' } = req.method === 'POST' 
      ? await req.json() 
      : { query: new URL(req.url).searchParams.get('query') || 'tax india' };
    
    console.log('Fetching news for query:', query);
    
    // Fetch news from News API
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('News API error:', response.status, errorText);
      throw new Error(`News API responded with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`Successfully fetched ${data.articles?.length || 0} articles`);
    
    // Return the news data with CORS headers
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
