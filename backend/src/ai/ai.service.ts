import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private config: ConfigService) {
    this.openai = new OpenAI({
      apiKey: config.get<string>('OPENAI_API_KEY'),
    });
  }

  async breakdown(taskTitle: string): Promise<string[]> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a software planning assistant. Break down the given development task into 3-6 concrete subtasks. Respond with ONLY a JSON array of strings, no explanation.',
        },
        { role: 'user', content: taskTitle },
      ],
      temperature: 0.3,
    });

    const raw = response.choices[0].message.content ?? '[]';
    const content = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
    try {
      return JSON.parse(content);
    } catch {
      return content
        .split('\n')
        .filter(Boolean)
        .map((s) => s.replace(/^[-•\d.)]\s*/, '').trim())
        .filter(Boolean);
    }
  }
}
