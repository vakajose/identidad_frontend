export class CedulaImageRequest{
    anverso: string
    reverso: string
    prueba: string

    constructor(anverso: string, reverso: string){
        this.anverso = anverso
        this.reverso = reverso
        this.prueba = 'prueba'
    }
}

export class EmailContactRequest{
    nombre:string
    email:string
    mensaje:string

    constructor(nombre:string, email:string, mensaje:string){
        this.email = email
        this.mensaje = mensaje
        this.nombre = nombre
    }
}