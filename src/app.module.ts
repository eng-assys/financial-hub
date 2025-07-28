import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entity/user.entity';
import configuration from './config/configuration';
import databaseConfiguration from './config/database-configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, databaseConfiguration],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 100,
      },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: databaseConfiguration().database.host,
      port: databaseConfiguration().database.port,
      username: databaseConfiguration().database.username,
      password: databaseConfiguration().database.password,
      database: databaseConfiguration().database.databaseName,
      entities: [UserEntity],
      autoLoadEntities: true, // permite detectar entidades automaticamente
      synchronize:
        databaseConfiguration().database.databaseName == 'production'
          ? false
          : true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [AppService],
})
export class AppModule {}
