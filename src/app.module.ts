import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { GsModule } from './gs/gs.module';
import { User } from './db/entity/user.entity';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: `./data/data.sqlite`,
      entities: [User],
      synchronize: true,
    }),
    GsModule,
    DbModule,
    AuthModule,
    QueueModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
