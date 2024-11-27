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