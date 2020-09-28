import { Injectable, OnModuleInit } from '@nestjs/common';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { HeadRow } from './enum/gs.enums';
import { IClient, IDataSheet } from './interface/gs.interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GsService implements OnModuleInit {

    constructor(private configService: ConfigService) { }

    public table = new GoogleSpreadsheet(this.configService.get<string>('GOOGLE_SHEETS_ID'));
    private serviceAccount = {
        client_email: this.configService.get<string>('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
        private_key: this.configService.get<string>('GOOGLE_PRIVATE_KEY'),
    };

    async createNewTab(data: IDataSheet): Promise<void> {
        const sheet = await this.table.addSheet();
        await sheet.updateProperties({ title: data.title });
        await sheet.setHeaderRow(data.headerRow);
        await sheet.addRows(data.data);
    }

    async getClients(title: string = 'МСК'): Promise<IClient[]> {
        await this.table.loadInfo();
        const sh = this.table.sheetsByTitle[title];
        if (typeof sh == 'undefined')
            return [];
        let data = await sh.getRows();
        let clients = this.prepareClients(data);
        return clients;
    }

    async getInfo() {
        await this.table.loadInfo();
        return Object.keys(this.table.sheetsByTitle);
    }

    private prepareClients(data: Array<any>): IClient[] {
        let clients: IClient[] = data.map(client => {
            let [d_after, m_after, y_after] = client[HeadRow.DATE_AFTER].split('.'),
                [d_before, m_before, y_before] = client[HeadRow.DATE_BEFORE].split('.');
            return {
                login: client[HeadRow.LOGIN].trim(),
                password: client[HeadRow.PASSWORD].trim(),
                importance: +client[HeadRow.IMPORTANCE],
                status: client[HeadRow.STATUS],
                members: !+client[HeadRow.PEOPLE] ? 1 : +client[HeadRow.PEOPLE],
                afterDate: new Date(y_after, m_after - 1, d_after).getTime(),
                beforeDate: new Date(y_before, m_before - 1, d_before).getTime()
            }
        });
        return clients;
    }

    onModuleInit() {
        this.table.useServiceAccountAuth(this.serviceAccount)
            .then(() => console.log('Auth to GS OK'))
            .catch(err => console.log(err));
    }
}
