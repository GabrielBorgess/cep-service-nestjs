import { Controller, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { CepService } from './cep.service';
import { CepDto } from './dto/cep.dto';

//Controller para lidar com as requisições no endpoint /cep
@Controller('cep')
export class CepController {
  constructor(private readonly cepService: CepService) {}

  //novo endpoint GET /cep/:cep
  @Get(':cep')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAddressByCep(@Param() params: CepDto) {
    return this.cepService.findAddressByCep(params.cep);
  }
}