import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000']
}));
app.use(express.json({ limit: '50mb' }));

app.post('/api/parse-timetable', async (req, res) => {
  try {
    const { imageBase64, mediaType } = req.body;

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2000,
      system: 'You are a timetable parser. Extract the timetable from this image and return ONLY a valid JSON array of arrays (6 rows for Monday-Saturday, 8 columns for time slots 9AM-4PM). Use empty string "" for empty cells. Use short subject names. Return only the raw JSON array, no markdown, no backticks, no explanation.',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: imageBase64
              }
            },
            {
              type: 'text',
              text: 'Parse this timetable. Return ONLY the JSON array [[...],[...]] with no other text.'
            }
          ]
        }
      ]
    });

    const responseText = message.content[0].text;
    console.log("Claude raw response:", responseText);
    res.json({ content: responseText });

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});