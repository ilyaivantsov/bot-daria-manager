import { Controller, Get, Query } from '@nestjs/common';
import { GsService } from './gs.service';

@Controller('gs')
export class GsController {

    constructor(private readonly gsServices: GsService) { }

    @Get('getclients')
    async getClients(@Query() query: any) {
        let data = await this.gsServices.getClients(query.title);
        return data;
    }

    @Get('info')
    async getInfo() {
        return await this.gsServices.getInfo();
    }
}
