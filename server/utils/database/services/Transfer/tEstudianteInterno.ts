import TEstudiante from './tEstudiante';

interface TEstudianteInterno extends TEstudiante {
  correo: string;
  nombre: string;
  apellidos: string;
  password: string;
  titulacion_local: string;
  telefono: string;
  rol: string; 
}

export default TEstudianteInterno;
