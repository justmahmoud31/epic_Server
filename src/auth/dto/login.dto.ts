import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'The user\'s email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The user\'s password' })
  @IsString()
  password: string;
}
