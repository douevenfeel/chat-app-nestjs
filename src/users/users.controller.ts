import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './users.model';
import { UsersService } from './users.service';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @ApiOperation({ summary: 'Получить всех пользователей' })
    @ApiResponse({ status: 200, type: [User] })
    @Get()
    getAll() {
        return this.usersService.getAllUsers();
    }

    @ApiOperation({ summary: 'Найти пользователя по id' })
    @ApiResponse({ status: 200, type: User })
    @Get(':id')
    getById(@Param('id') id: number) {
        console.log(id);
        return this.usersService.getUserById(id);
    }
}
