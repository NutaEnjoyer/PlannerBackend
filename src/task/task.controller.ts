import { Controller, Get, Post, Put, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common';
import { TaskService } from './task.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { TaskDto } from './dto/task.dto';
import { Optional } from '@prisma/client/runtime/library';

@Controller('user/tasks')
export class TaskController {
  constructor(private readonly TaskService: TaskService) {}

  @Get()
  @Auth()
  async getAll(@CurrentUser('id') userId: string) { 
    return this.TaskService.getAll(userId)
  }
  
  @UsePipes(new ValidationPipe())
  @Post()
  @Auth()
  @HttpCode(200)
  async create(@Body() dto: TaskDto, @CurrentUser('id') userId: string) { 
    return this.TaskService.create(dto, userId)
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @Auth()
  @HttpCode(200)
  async update(
    @Body() dto: Optional<TaskDto>,
    @CurrentUser('id') userId: string,
    @Param('id') id: string
  ) {
      return this.TaskService.update(dto, id, userId)
  }

  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async delete(@Param('id') taskId: string) {
    return this.TaskService.delete(taskId)
  }
}
