import { Usuario } from "./usuario";

export interface Access {
    code: number;
    message: string;
    data: {
        accessToken?: string;
        apiKey?: string;
        usuario: Usuario;
    }
}
