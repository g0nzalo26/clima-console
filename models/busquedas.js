import fs from 'fs'

import axios from "axios"

export class Busquedas {

    historial = []
    dbPath = './db/database.json'


    constructor() {
        this.leerDB()
    }

    get HistorialCapitalizado(){

        return this.historial.map( lugar => {

            // Separa el string por espacios, generando un array de palabras
            // Ejemplo: "santiago de chile" => ["santiago", "de", "chile"]
            let palabras = lugar.split(' ')

            // Capitaliza la primera letra de cada palabra
            // ["santiago", "de", "chile"] => ["Santiago", "De", "Chile"]
            palabras = palabras.map( palabra => palabra[0].toUpperCase() + palabra.substring(1) )

            // Une las palabras nuevamente en un solo string
            // ["Santiago", "De", "Chile"] => "Santiago De Chile"
            return palabras.join(' ')

        })

    }

    async ciudad(lugar = '') {

        // Peticion HTTP

        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/search/geocode/v6/forward`,
                params: {
                    'q': lugar,
                    'limit': 3,
                    'language': 'es',
                    'access_token': process.env.MAPBOX_KEY,
                }
            })

            const resp = await instance.get()

            // .map es solo para arrays!!!
            return resp.data.features.map(lugar => ({

                id: lugar.id,
                nombre: lugar.properties.full_address,
                longitud: lugar.properties.coordinates.longitude,
                latitud: lugar.properties.coordinates.latitude,

            }))


        } catch (error) {
            return []
        }

    }

    async climaLugar(lat, lon) {

        try {

            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    lat,
                    lon,
                    'appid': process.env.OPENWEATHER_KEY,
                    'units': 'metric',
                    'lang': 'es'
                }
            })

            const resp = await instance.get()

            const { weather, main } = resp.data

            return {

                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp

            }

        } catch (error) {
            console.log(error)
        }

    }

    agregarHistorial( lugar = '' ) {

        //Prevenir duplicados
        if( this.historial.includes( lugar.toLocaleLowerCase() ) ){
            return
        }

        this.historial.unshift( lugar.toLocaleLowerCase() )

        // Grabar en DB

        this.guardarDB()

    }

    guardarDB() {

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) )

    }

    leerDB() {

        const info = fs.readFileSync( this.dbPath, {encoding: 'utf-8'} )

        const data = JSON.parse( info )

        this.historial = data.historial

    }



}

