import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'O título deve ter no máximo 100 caracteres.' })
  titulo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(280, { message: 'A descrição deve ter no máximo 280 caracteres.' })
  descricao?: string;
}