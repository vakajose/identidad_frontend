export interface DocumentData {
    encryptedData:string // Datos cifrados del token
    tokenType: number    // Tipo de token
    uniqueId: string     // Identificador único del token
    isCurrent: boolean       // Indica si es la versión vigente
    createdAt: number    // Fecha de creación (timestamp)
    updatedAt: number    // Fecha de última actualización (timestamp)
}

export interface AddressTokenIds {
    _address: string
    tokenIds: string[]
    tokenIdsObject: any[]
    addressTokenIds: any[]
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
    tokenType: number    // Tipo de token
    uniqueId: string     // Identificador único del token
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