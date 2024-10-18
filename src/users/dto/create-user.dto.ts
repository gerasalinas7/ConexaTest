import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The name of the user', example: 'John Doe', minLength: 2, maxLength: 30 })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string;

  @ApiProperty({ description: 'The email of the user', example: 'user@example.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'The password of the user', example: 'strongpassword123', minLength: 6, maxLength: 20 })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  readonly password: string;
}
