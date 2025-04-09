import { Controller, Get, Post, Put, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common';
import { PomodoroService } from './pomodoro.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { PomodoroRoundDto, PomodoroSessionDto } from './dto/pomodoro.dto';

@Controller('user/timer')
export class PomodoroController {
  constructor(private readonly pomodoroService: PomodoroService) {}

  @Get('today')
  @Auth()
  async getTodaySession(@CurrentUser('id') userId: string) { 
    return this.pomodoroService.getTodaySession(userId)
  }
  
  @Post()
  @Auth()
  @HttpCode(200)
  async create(@CurrentUser('id') userId: string) { 
    return this.pomodoroService.create(userId)
  }

  @UsePipes(new ValidationPipe())
  @Put('/round/:id')
  @Auth()
  @HttpCode(200)
  async updateRound(
    @Body() dto: PomodoroRoundDto,
    @Param('id') id: string
  ) {
      return this.pomodoroService.updateRound(dto, id)
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @Auth()
  @HttpCode(200)
  async update(
    @Body() dto: Partial<PomodoroSessionDto>,
    @Param('id') id: string,
    @CurrentUser('id') userId: string
  ) {
      return this.pomodoroService.update(dto, id, userId)
  }



  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async delete(@Param('id') sessionId: string, @CurrentUser('id') userId: string) {
    return this.pomodoroService.deleteSession(sessionId, userId)
  }
}
