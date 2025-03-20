import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Client, Language } from '@googlemaps/google-maps-services-js';

//Serviço para buscar endereço por CEP
@Injectable()
export class CepService {
  private readonly baseUrl = 'https://viacep.com.br/ws';
  private readonly googleMapsApiKey: string;

  constructor(private configService: ConfigService) {
    this.googleMapsApiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY') || ''
  }


  async findAddressByCep(cep: string) {

    console.log(`A CHAVE DA API: ${this.googleMapsApiKey}`)
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
      const street = response.data.logradouro;

      const nearestBar = await this.findNearestBar(street);

      //Filtrar e transformar os dados recebidos da API
      return {
        message: `Seu CEP indica que você mora no bairro ${neighborhood}, na cidade de ${city}, no estado de ${state}.`,
        nearestBar: nearestBar.message,
      };

    } catch (error) {
      throw new HttpException(
        'Erro ao consultar o CEP',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
//Busca o bar mais proxímo da rua do usuário
  private async findNearestBar(street: string) {
    try{
      const placesResponse = await axios.post(
        'https://places.googleapis.com/v1/places:searchText',
        {
          textQuery: `Bar na rua ${street}`
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': this.googleMapsApiKey,
            'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.priceLevel'
          }
        }
      );

      if (!placesResponse.data.places.length) {
        return{
          messsage: 'Nao foi possivel encontrar bares proximos de você, que pena!'
        };
      }

      const bar = placesResponse.data.places[0];

      return{
        message: {
          recado: 'encontramos um bar pertinho de você!',
          nome: bar.displayName.text,
          status: bar.opening_hours?.open_now ? "🟢 Aberto e pronto para sua sede!" : "🔴 Fechado (que tristeza!)"
        }
      }
    }
    catch(error){
      console.error('Erro ao buscar bar:', error);
      throw new Error('Não foi possível encontrar bares próximos');
    }
  }
}