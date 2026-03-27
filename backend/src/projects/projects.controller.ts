import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.projectsService.findAll(req.user.id);
  }

  @Get('import')
  getAvailableRepos(@Request() req: any) {
    return this.projectsService.getAvailableRepos(req.user.id);
  }

  @Post()
  create(@Request() req: any, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(req.user.id, dto);
  }

  @Get(':id/tasks')
  getTasks(@Request() req: any, @Param('id') id: string) {
    return this.projectsService.getTasks(req.user.id, id);
  }
}
