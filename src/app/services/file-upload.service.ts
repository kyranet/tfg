import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UsuarioService } from './usuario.service';
import { Upload } from '../models/upload.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private usuarioService: UsuarioService) { }

  mapearUploads( uploads: any ): Upload[] {
    return uploads.map(
      upload => new Upload(upload._id, upload.almacenamiento, upload.campo, upload.tipo, upload.tipo_id, upload.path, upload.nombre, upload.client_name, upload.creador, upload.createdAt)
    );
  }

  async subirFichero(archivo: File, campo: string, tipo: string, tipo_id: string) {

    try {
      const url = `${ base_url}/upload/${campo}/${tipo}/${tipo_id}`;

      const formData = new FormData();
      formData.append('imagen', archivo);

      const resp = await fetch(url, {
        method: 'PUT',
        headers: { 'x-token': this.usuarioService.token },
        body: formData
      });

      const data = await resp.json();

      return { ok: data.ok, msg: data.msg, upload_id: data.ok ? data.upload._id : null };

    } catch (err) {
      console.log(err);

      let msg = [];
      if(err.error.errors) {
        Object.values(err.error.errors).forEach(error_entry => {
          msg.push(error_entry['msg']);
        });
      } else {
        msg.push(err.error.msg);
      }
      return { ok: false, msg: msg.join('<br>'), upload_id: null };
    }
  }


  async borrarFichero(upload_id: string) {

    try {
      const url = `${ base_url}/upload/${upload_id}`;

      const formData = new FormData();

      const resp = await fetch(url, {
        method: 'DELETE',
        headers: { 'x-token': this.usuarioService.token }
      });

      const data = await resp.json();

      return { ok: data.ok, msg: data.msg };

    } catch (err) {
      console.log(err);

      let msg = [];
      if(err.error.errors) {
        Object.values(err.error.errors).forEach(error_entry => {
          msg.push(error_entry['msg']);
        });
      } else {
        msg.push(err.error.msg);
      }
      return { ok: false, msg: msg.join('<br>') };
    }
  }

}
