import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fact-checking text:', text.substring(0, 100) + '...');

    // Use Lovable AI to analyze the content
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert fact-checker. Analyze the given text and identify distinct factual claims. 
For each claim, determine its truthfulness based on general knowledge and provide evidence.

Respond ONLY with valid JSON in this exact format:
{
  "overallVerdict": "TRUE" | "FALSE" | "MIXED" | "UNCERTAIN",
  "overallConfidence": 0-100,
  "overallSummary": "Brief summary of the overall analysis",
  "claims": [
    {
      "text": "The specific claim extracted from the text",
      "verdict": "TRUE" | "FALSE" | "UNCERTAIN",
      "confidence": 0-100,
      "explanation": "Detailed explanation of why this claim is true/false/uncertain",
      "sources": [
        {
          "title": "Source name or publication",
          "url": "URL if available, or 'General Knowledge' if not",
          "excerpt": "Relevant quote or fact from source"
        }
      ]
    }
  ]
}`
          },
          {
            role: 'user',
            content: `Analyze this text and extract all factual claims:\n\n${text}`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your Lovable workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI Response:', aiResponse);

    // Parse the JSON response
    let analysisResult;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisResult = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw response:', aiResponse);
      
      // Return a fallback response
      analysisResult = {
        overallVerdict: 'UNCERTAIN',
        overallConfidence: 50,
        overallSummary: 'Unable to analyze the content properly. Please try again.',
        claims: [{
          text: text.substring(0, 200) + '...',
          verdict: 'UNCERTAIN',
          confidence: 50,
          explanation: 'Analysis could not be completed. Please try with clearer content.',
          sources: []
        }]
      };
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in fact-check function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
