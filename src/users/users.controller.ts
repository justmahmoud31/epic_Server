import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/roles.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)  // Apply guards globally for all endpoints
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'List of all users', type: [User] })
    @ApiQuery({ name: 'email', required: false, description: 'Filter users by email' })
    @ApiQuery({ name: 'id', required: false, description: 'Filter users by ID' })
    @Roles(Role.ADMIN)  // Only admin can access
    @ApiBearerAuth('access-token')
    async getAllUsers(@Query() query: { email?: string; id?: number }): Promise<User[]> {
        return this.usersService.getAllUsers(query);
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update user by ID' })
    @ApiResponse({ status: 200, description: 'User updated', type: User })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiBearerAuth('access-token')
    @Roles(Role.ADMIN)  // Only admin can update users
    async updateUser(@Param('id') id: number, @Body() updateUserDto: SignupDto): Promise<User> {
        return this.usersService.updateUser(id, updateUserDto);
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Delete user by ID' })
    @ApiResponse({ status: 200, description: 'User deleted' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiBearerAuth('access-token')
    @Roles(Role.ADMIN)  // Only admin can delete users
    async deleteUser(@Param('id') id: number): Promise<void> {
        return this.usersService.deleteUser(id);
    }
}
