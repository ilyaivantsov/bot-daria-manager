import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbService } from './db.service';
import { DbSubscriber } from './db.subscriber';
import { User } from './entity/user.entity';
import { DbController } from './db.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [DbService, DbSubscriber],
  exports: [DbService],
  controllers: [DbController]
})
export class DbModule { }
