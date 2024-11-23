export interface DocumentData {
    encryptedData:string // Datos cifrados del token
    isCurrent: boolean       // Indica si es la versión vigente
    createdAt: number    // Fecha de creación (timestamp)
    updatedAt: number    // Fecha de última actualización (timestamp)
}

export interface Cedula {
    nombre: string
    numero: string
    fechaNacimiento: Date
    lugarNacimiento: string
    estadoCivil: string
    profesion: string
    domicilio: string
    foto: string
    serie: string
    seccion: string
    fechaEmision: Date
    fechaExpiracion: Date
    codigoQr: string

    tokenId: string
    isCurrent: boolean       // Indica si es la versión vigente
    createdAt: Date    // Fecha de creación (timestamp)
    updatedAt: Date    // Fecha de última actualización (timestamp)
}

export interface Licencia {
    nombres: string
    apellidos: string
    numero: string
    sexo: string
    fechaNacimiento: string
    fechaEmision: string
    fechaExpiracion: string
    nacionalidad: string
    audifonos: string
    grupoSanguineo: string
    lentes: string
    categoria: string
    codigoQr: string
}