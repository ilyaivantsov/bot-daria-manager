import { Module } from '@nestjs/common';
import { GsController } from './gs.controller';
import { GsService } from './gs.service';

@Module({
  controllers: [GsController],
  providers: [GsService],
  exports: [GsService]
})
export class GsModule { }
