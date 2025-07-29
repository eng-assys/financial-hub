import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { ParamId } from 'src/decorators/param-id.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // @SkipThrottle()
  // @Throttle(20,40)
  @Post('/')
  async create(@Body() body: CreateUserDTO) {
    return await this.userService.create(body);
  }
  @Get('/')
  async list() {
    return await this.userService.list();
  }
  @Get(':id')
  async show(@ParamId() id: number) {
    return await this.userService.show(id);
  }
  @Put(':id')
  async update(@Body() body: UpdateUserDTO, @Param('id', ParseIntPipe) id) {
    return await this.userService.update(id, body);
  }
  @Patch(':id')
  async updatePartial(
    @Body() body: UpdatePatchUserDTO,
    @Param('id', ParseIntPipe) id,
  ) {
    return await this.userService.patch(id, body);
  }
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id) {
    return await this.userService.delete(id);
  }
}
