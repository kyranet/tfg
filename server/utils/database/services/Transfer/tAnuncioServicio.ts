import tAreaServicioAnuncio from "./tAreaServicioAnuncio";
interface TAnuncioServicio {
    id: number;
    titulo: string;
    descripcion: string;
    imagen: string;
    created_at: Date;
    updated_at: Date;
    area_servicio:tAreaServicioAnuncio[];
    dummy: any;
}

export default TAnuncioServicio;
