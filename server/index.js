import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000']
}));
app.use(express.json({ limit: '50mb' }));

app.post('/api/parse-timetable', async (req, res) => {
  try {
    const { imageBase64, mediaType } = req.body;
    console.log('Received request with mediaType:', mediaType);

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mediaType};base64,${imageBase64}`
              }
            },
            {
              type: 'text',
              text: 'Extract the timetable from this image and return ONLY a valid JSON array of arrays. Format: [["subject1","subject2",...],[...]] with 6 rows (Mon-Sat) and 8 columns (9AM-4PM). Use "" for empty cells and "Lunch" for lunch breaks. Return ONLY the JSON array, no markdown, no explanation.'
            }
          ]
        }
      ]
    });

    const responseText = response.choices[0].message.content;
    console.log("OpenAI response:", responseText);
    res.json({ content: responseText });

  } catch (error) {
    console.error("Full error:", error);
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