import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty({message: 'O título não pode ser vazio.'})
    @MaxLength(100, {message: 'O título deve ter no máximo 100 caracteres.'})
    titulo: string;

    @IsString()
    @IsNotEmpty({message: 'A descrição não pode ser vazia.'})
    @MaxLength(280, {message: 'A descrição deve ter no máximo 280 caracteres.'})
    descricao: string;
}