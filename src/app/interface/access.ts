import { Usuario } from "./usuario";

export interface Access {
    accessToken:string,
    message?: string;
    data:{
        usuario:Usuario
    }
}
