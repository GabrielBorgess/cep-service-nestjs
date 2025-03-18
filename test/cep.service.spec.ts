import { Test, TestingModule } from '@nestjs/testing';
import { CepService } from '../src/cep/cep.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

// simular o axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CepService', () => {
  let service: CepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CepService],
    }).compile();

    service = module.get<CepService>(CepService);
    jest.clearAllMocks();
  });

  describe('findAddressByCep', () => {
    //Caso de sucesso
    it('deve retornar uma mensagem formatada quando o CEP é válido', async () => {
      //Resposta esperada da API
      mockedAxios.get.mockResolvedValue({
        data: {
          cep: '01001000',
          bairro: 'Sé',
          localidade: 'São Paulo',
          uf: 'SP',
          erro: false
        }
      });

      const result = await service.findAddressByCep('01001000');
      expect(result.message).toContain('São Paulo');
      expect(result.message).toContain('SP');
      expect(result.message).toContain('Sé');
    });

    //Caso de cep não encontrado
    it('deve lançar HttpException quando o CEP não é encontrado', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { erro: true }
      });

      await expect(service.findAddressByCep('00000000'))
        .rejects
        .toThrow(HttpException);
    });

    //Caso de falha na API
    it('deve lançar HttpException quando a API externa falha', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network Error'));

      await expect(service.findAddressByCep('01001000'))
        .rejects
        .toThrow(new HttpException('Erro ao consultar o CEP', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });
});