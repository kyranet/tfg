import TEstudiante from './tEstudiante';

interface TEstudianteExterno extends TEstudiante {
  correo: string;
  nombre: string;
  apellidos: string;
  password: string;
  titulacion: string;
  nombreUniversidad: string;
  telefono: string;
  rol: string; // Asumiendo que 'rol' es una propiedad de solo lectura
}

export default TEstudianteExterno;
