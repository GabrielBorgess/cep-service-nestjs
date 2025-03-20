import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CepModule } from './cep/cep.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Isso torna o ConfigModule global
      envFilePath: '.env', // Especifica o caminho do arquivo .env
    }),
    CepModule,
  ],
})
export class AppModule {}