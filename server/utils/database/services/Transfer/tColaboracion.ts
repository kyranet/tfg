interface TColaboracion {
    id: number;
    titulo: string;
    descripcion: string;
    admite_externos: boolean;
    responsable: string;
    profesores: string[];
}

export default TColaboracion;
