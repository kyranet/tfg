import TUsuario from './tUsuario';

interface TSocioComunitario extends TUsuario {
    correo: string;
    nombre: string;
    apellidos: string;
    password: string;
    sector: string;
    nombre_socioComunitario: string;
    telefono: string;
    url: string;
    mision: string;
}

export default TSocioComunitario;
