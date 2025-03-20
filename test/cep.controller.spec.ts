import { Test, TestingModule } from '@nestjs/testing';
import { CepController } from '../src/cep/cep.controller';
import { CepService } from '../src/cep/cep.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('CepController', () => {
  let controller: CepController;
  let service: CepService;

  // Mocks para teste
  const VALID_CEP = '01001000';
  const INVALID_CEP = 'invalid';
  const MOCK_ADDRESS_RESPONSE = {
    message: 'Seu CEP indica que você mora no bairro Centro, na cidade de São Paulo, no estado de SP.',
    nearestBar: {
      recado: 'encontramos um bar pertinho de você!',
      nome: 'Bar do Zé',
      status: '🟢 Aberto e pronto para sua sede!'
    }
  };

  const MOCK_NO_BAR_RESPONSE = {
    message: 'Seu CEP indica que você mora no bairro Centro, na cidade de São Paulo, no estado de SP.',
    nearestBar: {
      message: 'Nao foi possivel encontrar bares proximos de você, que pena!'
    }
  };

  const mockCepService = {
    findAddressByCep: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CepController],
      providers: [
        {
          provide: CepService,
          useValue: mockCepService
        }
      ],
    }).compile();

    controller = module.get<CepController>(CepController);
    service = module.get<CepService>(CepService);
    jest.clearAllMocks();
  });

  describe('findAddressByCep', () => {
    describe('Cenários de sucesso', () => {
      it('deve retornar endereço e informações do bar mais próximo', async () => {
       
        mockCepService.findAddressByCep.mockResolvedValue(MOCK_ADDRESS_RESPONSE);

        
        const result = await controller.findAddressByCep({ cep: VALID_CEP });

        expect(result).toEqual(MOCK_ADDRESS_RESPONSE);
        expect(mockCepService.findAddressByCep).toHaveBeenCalledWith(VALID_CEP);
        expect(mockCepService.findAddressByCep).toHaveBeenCalledTimes(1);
      });

      it('deve retornar endereço mesmo quando não encontrar bar próximo', async () => {
       
        mockCepService.findAddressByCep.mockResolvedValue(MOCK_NO_BAR_RESPONSE);

        
        const result = await controller.findAddressByCep({ cep: VALID_CEP });

        expect(result).toEqual(MOCK_NO_BAR_RESPONSE);
        expect(mockCepService.findAddressByCep).toHaveBeenCalledWith(VALID_CEP);
        expect(mockCepService.findAddressByCep).toHaveBeenCalledTimes(1);
      });
    });

    describe('Cenários de erro', () => {
      it('deve rejeitar CEP com formato inválido', async () => {
       
        const expectedError = new HttpException(
          'Erro ao consultar o CEP',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
        mockCepService.findAddressByCep.mockRejectedValue(expectedError);

        
        await expect(controller.findAddressByCep({ cep: INVALID_CEP }))
          .rejects
          .toThrow(expectedError);
        expect(mockCepService.findAddressByCep).toHaveBeenCalledWith(INVALID_CEP);
      });

      it('deve lidar com CEP não encontrado', async () => {
       
        const expectedError = new HttpException(
          'Erro ao buscar CEP',
          HttpStatus.NOT_FOUND
        );
        mockCepService.findAddressByCep.mockRejectedValue(expectedError);

        
        await expect(controller.findAddressByCep({ cep: '00000000' }))
          .rejects
          .toThrow(expectedError);
      });
    });
  });
});