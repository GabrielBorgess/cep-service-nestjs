import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';


//Serviço para buscar endereço por CEP
@Injectable()
export class CepService {
  private readonly baseUrl = 'https://viacep.com.br/ws';

  async findAddressByCep(cep: string) {
    try {
      const formattedCep = cep.replace(/\D/g, '');

      //Consumir API via CEP
      const response = await axios.get(`${this.baseUrl}/${formattedCep}/json`);

      //Erro na resposta da API
      if (response.data.erro) {
        throw new HttpException('Erro ao buscar CEP', HttpStatus.NOT_FOUND);
      }

      const city = response.data.localidade;
      const neighborhood = response.data.bairro;
      const state = response.data.uf;

      //Filtrar e transformar os dados recebidos da API
      return {
        message: `Seu CEP indica que você mora no bairro ${neighborhood}, na cidade de ${city}, no estado de ${state}. Essa mensagem foi modificada pela API!`
      };

    } catch (error) {
      throw new HttpException(
        'Erro ao consultar o CEP',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}