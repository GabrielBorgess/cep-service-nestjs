import { Test, TestingModule } from '@nestjs/testing';
import { CepController } from '../src/cep/cep.controller';
import { CepService } from '../src/cep/cep.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('CepController', () => {
  let controller: CepController;
  let service: CepService;

  //Simular serviço
  const mockCepService = {
    findAddressByCep: jest.fn()
  };

  // Configuração pre-teste
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

    //Caso de sucesso
    it('deve retornar mensagem formatada quando CEP é válido', async () => {
      const mockResponse = {
        message: 'Seu CEP indica que você mora na cidade de São Paulo, que fica no estado de SP. Esta mensagem foi personalizada pela API.'
      };

      mockCepService.findAddressByCep.mockResolvedValue(mockResponse);

      const result = await controller.findAddressByCep({ cep: '01001000' });

      expect(result).toEqual(mockResponse);
      expect(mockCepService.findAddressByCep).toHaveBeenCalledWith('01001000');
    });

    //Caso de cep não encontrado
    it('deve propagar erro quando service falha', async () => {
      mockCepService.findAddressByCep.mockRejectedValue(
        new HttpException('Erro ao consultar o CEP', HttpStatus.INTERNAL_SERVER_ERROR)
      );

      await expect(controller.findAddressByCep({ cep: '00000000' }))
        .rejects
        .toThrow(HttpException);
    });

    //Caso de CEP inválido
    it('deve validar formato do CEP', async () => {
      // Assumindo que você tem validação de CEP no controller
      await expect(controller.findAddressByCep({ cep: 'invalid' }))
        .rejects
        .toThrow();
    });
  });
});