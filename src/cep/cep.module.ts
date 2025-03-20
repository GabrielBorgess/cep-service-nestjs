import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CepController } from './cep.controller';
import { CepService } from './cep.service';

@Module({
  imports: [ConfigModule],
  controllers: [CepController],
  providers: [CepService],
})
export class CepModule {}