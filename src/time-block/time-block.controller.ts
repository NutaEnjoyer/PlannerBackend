import { Controller, Get, Post, Put, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common';
import { TimeBlockService } from './time-block.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { TimeBlockDto } from './dto/time-block.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('user/time-blocks')
export class TimeBlockController {
  constructor(private readonly timeBlockService: TimeBlockService) {}

  @Get()
  @Auth()
  async getAll(@CurrentUser('id') userId: string) { 
    return this.timeBlockService.getAll(userId)
  }
  
  @UsePipes(new ValidationPipe())
  @Post()
  @Auth()
  @HttpCode(200)
  async create(@Body() dto: TimeBlockDto, @CurrentUser('id') userId: string) { 
    return this.timeBlockService.create(dto, userId)
  }

  @UsePipes(new ValidationPipe())
  @Put('update-order')
  @Auth()
  @HttpCode(200)
  async updateOrder(
    @Body() ids: string[]
  ) {
      return this.timeBlockService.updateOrder(ids)
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @Auth()
  @HttpCode(200)
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') timeBlockId: string,
    @Body() dto: TimeBlockDto,
  ){
    return this.timeBlockService.update(dto, timeBlockId, userId)
  }


  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async delete(@CurrentUser('id') userId: string, @Param('id') taskId: string) {
    return this.timeBlockService.delete(taskId, userId)
  }
}
