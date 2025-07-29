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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Register a new User' })
  @ApiBody({ type: CreateUserDTO })
  @Post()
  async create(@Body() body: CreateUserDTO) {
    return await this.userService.create(body);
  }
  
  @ApiOperation({ summary: 'Get all Users' })
  @ApiBearerAuth()
  @Get()
  async list() {
    return await this.userService.list();
  }
  
  @ApiOperation({ summary: 'Get User by ID' })
  @ApiBearerAuth()
  @Get(':id')
  async show(@ParamId() id: number) {
    return await this.userService.show(id);
  }
  
  @ApiOperation({ summary: 'Update all user parameter by ID' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDTO })
  @Put(':id')
  async update(@Body() body: UpdateUserDTO, @Param('id', ParseIntPipe) id) {
    return await this.userService.update(id, body);
  }
  
  @ApiOperation({ summary: 'Update some user parameter by ID' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdatePatchUserDTO })
  @Patch(':id')
  async updatePartial(
    @Body() body: UpdatePatchUserDTO,
    @Param('id', ParseIntPipe) id,
  ) {
    return await this.userService.patch(id, body);
  }

  @ApiOperation({ summary: 'Delete an user by ID' })
  @ApiBearerAuth()
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id) {
    return await this.userService.delete(id);
  }
}
