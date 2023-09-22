import { environment } from '../../environments/environment';
import { Upload } from './upload.model';
import * as moment from 'moment';

const base_url = environment.base_url;

export class Profesor {

    public nombre : String
    public apellidos : String
    public id : Number

    constructor(
        public universidad: string,
    ) {}   
}
