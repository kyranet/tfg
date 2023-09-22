import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UsuarioService } from './usuario.service';

const base_url = environment.base_url;

@Injectable({
    providedIn: 'root',
})
export class UtilsService {
    constructor(
        private http: HttpClient,
        private usuarioService: UsuarioService
    ) {}

    computeTags(descrip: string) {
        return this.http
            .get<{ ok: boolean, tags: any }>(`${base_url}/tags/computeTags?descrip=${descrip}`, this.usuarioService.headers)
            .pipe(map((resp) => resp));
    } 

    computePossibleTags(text: string) {
        return this.http
            .get<{ ok: boolean, tags: any }>(`${base_url}/tags/computePossibleTags?text=${text}`, this.usuarioService.headers)
            .pipe(map((resp) => resp));
    }
}
