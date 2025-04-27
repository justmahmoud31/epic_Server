import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    // Signup function (creates user and hashes password)
    async signup(signupDto: SignupDto) {
        const { email, password } = signupDto;

        // Check if user already exists
        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new UnauthorizedException('Email already registered');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const user = this.usersRepository.create({
            email,
            password: hashedPassword,
            role: 'user', // Default role
            isVerified: false, // Default verification status
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await this.usersRepository.save(user);

        return {
            message: 'User created successfully',
             user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        };
    }

    // Login function (validates user and generates JWT)
    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        // Find the user by email
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate JWT
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload);

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            access_token: accessToken,
        };
    }
}
