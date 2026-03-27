import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from './ai.service';
import { BreakdownDto } from './dto/breakdown.dto';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('breakdown')
  breakdown(@Body() dto: BreakdownDto): Promise<string[]> {
    return this.aiService.breakdown(dto.taskTitle);
  }
}
