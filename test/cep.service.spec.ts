import { Test, TestingModule } from '@nestjs/testing';
import { CepService } from '../src/cep/cep.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CepService', () => {
  let service: CepService;

  //Mocks para teste
  const MOCK_CEP = '01001000';
  const MOCK_ADDRESS = {
    cep: MOCK_CEP,
    bairro: 'Sé',
    localidade: 'São Paulo',
    uf: 'SP',
    logradouro: 'Praça da Sé',
    erro: false
  };

  const MOCK_BAR = {
    displayName: { text: 'Bar do Zé' },
    opening_hours: { open_now: true }
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('fake-api-key')
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CepService,
        {
          provide: ConfigService,
          useValue: mockConfigService
        }
      ],
    }).compile();

    service = module.get<CepService>(CepService);
    jest.clearAllMocks();
  });

  describe('findAddressByCep', () => {
    describe('Cenários de sucesso', () => {
      it('deve retornar endereço e bar mais próximo quando ambas as APIs funcionam', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: MOCK_ADDRESS });
        mockedAxios.post.mockResolvedValueOnce({
          data: { places: [MOCK_BAR] }
        });

        const result = await service.findAddressByCep(MOCK_CEP);

        expect(result).toEqual({
          message: `Seu CEP indica que você mora no bairro ${MOCK_ADDRESS.bairro}, na cidade de ${MOCK_ADDRESS.localidade}, no estado de ${MOCK_ADDRESS.uf}.`,
          nearestBar: {
            recado: 'encontramos um bar pertinho de você!',
            nome: MOCK_BAR.displayName.text,
            status: '🟢 Aberto e pronto para sua sede!'
          }
        });
      });

      it('deve retornar endereço e mensagem quando não encontra bares', async () => {

        mockedAxios.get.mockResolvedValueOnce({ data: MOCK_ADDRESS });
        mockedAxios.post.mockResolvedValueOnce({ data: { places: [] } });

        const result = await service.findAddressByCep(MOCK_CEP);

        expect(result).toEqual({
          message: `Seu CEP indica que você mora no bairro ${MOCK_ADDRESS.bairro}, na cidade de ${MOCK_ADDRESS.localidade}, no estado de ${MOCK_ADDRESS.uf}.`,
          nearestBar: 'Nao foi possivel encontrar bares proximos de você, que pena!'
        });
      });
    });

    describe('Cenários de erro', () => {
      it('deve lançar HttpException quando a API ViaCEP falha', async () => {

        mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

        await expect(service.findAddressByCep(MOCK_CEP))
          .rejects
          .toThrow(new HttpException('Erro ao consultar o CEP', HttpStatus.INTERNAL_SERVER_ERROR));
      });

      it('deve lançar HttpException quando a API do Google Places falha', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: MOCK_ADDRESS });
        mockedAxios.post.mockRejectedValueOnce(new Error('Google API Error'));

        await expect(service.findAddressByCep(MOCK_CEP))
          .rejects
          .toThrow(HttpException);
      });
    });
  });
});