import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({ description: 'The user\'s email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The user\'s password', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
