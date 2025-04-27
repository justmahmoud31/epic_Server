import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from '../auth/dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    // Get all users with filters
    async getAllUsers(query: { email?: string; id?: number }): Promise<User[]> {
        const { email, id } = query;
        const where = {};

        if (email) {
            where['email'] = email;
        }

        if (id) {
            where['id'] = id;
        }

        return this.usersRepository.find({ where });
    }

    // Fetch user by ID
    async getUserById(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    // Fetch user by email
    async getUserByEmail(email: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    // Create a new user
    async createUser(signupDto: SignupDto): Promise<User> {
        const { email, password } = signupDto;

        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = this.usersRepository.create({
            email,
            password: hashedPassword,
        });

        return this.usersRepository.save(newUser);
    }

    // Find a user by ID
    async findById(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    // Update user details
    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findById(id);

        if (updateUserDto.email) {
            user.email = updateUserDto.email;
        }

        if (updateUserDto.password) {
            user.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        return this.usersRepository.save(user);
    }

    // Delete a user
    async deleteUser(id: number): Promise<void> {
        const user = await this.findById(id);
        await this.usersRepository.remove(user);
    }
}
