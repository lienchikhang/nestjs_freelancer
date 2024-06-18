import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpCode } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from 'src/libs/dto';
import { Auth } from 'src/libs/decorators/common.decorator';
import { RoleAuth } from 'src/libs/guards/role.guard';
import { ROLE } from 'src/libs/enum';
import { User } from 'src/libs/decorators/user.decorator';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Get('get/:jobId')
  @HttpCode(200)
  findAll(
    @Param('jobId') jobId: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.commentService.findAll(+jobId, page && +page, pageSize && +pageSize);
  }

  @Post('add/:jobId')
  @UseGuards(new RoleAuth([ROLE.USER, ROLE.SELLER]))
  @Auth()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @User() user,
    @Param('jobId') jobId: string,
  ) {
    return this.commentService.create(+jobId, user.userId, createCommentDto);
  }


}
