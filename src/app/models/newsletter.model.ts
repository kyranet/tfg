import { Usuario } from './usuario.model';
import * as moment from 'moment';

export class Newsletter {
    constructor(
        public mail_to: string,
        public usuario: Usuario,
        public createdAt: string,
    ) {}


    get parsedCreatedAt() {
        return moment(this.createdAt).format('YYYY-MM-DD HH:mm');
    }

}


