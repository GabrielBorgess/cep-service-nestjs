import { IsString, Length } from 'class-validator';

// DTO para validação do CEP
export class CepDto {
  @IsString({ message: 'O CEP deve ser uma string' })
  @Length(8, 8, { message: 'O CEP deve ter exatamente 8 caracteres'})
  cep!: string;
}