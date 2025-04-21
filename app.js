import dotenv from 'dotenv'

import { inquirerMenu, leerInput, listarLugares, pausa } from './helpers/inquirer.js'
import { Busquedas } from './models/busquedas.js';

dotenv.config()

const main = async () => {

    const busquedas = new Busquedas()
    let opt

    do {

        opt = await inquirerMenu()

        switch (opt) {

            case 1:

                // Mostrar Mensaje
                const terminoBusqueda = await leerInput('Ciudad:')

                // Buscar Lugares
                const lugares = await busquedas.ciudad(terminoBusqueda)

                // Seleccionar Lugar
                const idSelec = await listarLugares(lugares)
                if( idSelec === '0' ) continue 

                const lugarSelec = lugares.find(lug => lug.id === idSelec)

                // Guardar en BD
                busquedas.agregarHistorial( lugarSelec.nombre )

                // Clima
                const latitud = lugarSelec.latitud
                const longitud = lugarSelec.longitud

                const clima = await busquedas.climaLugar(latitud, longitud)

                // Mostrar Resultados

                console.clear()

                console.log('\n*** Información ***\n'.green);
                console.log(`Ciudad: ${lugarSelec.nombre}`);
                console.log(`Longitud: ${lugarSelec.longitud}`);
                console.log(`Latitud: ${lugarSelec.latitud}`);
                console.log(`Descripcion del Clima: ${clima.desc}`);
                console.log(`T° Actual: ${clima.temp}`);
                console.log(`T° Min: ${clima.min}`);
                console.log(`T° Max: ${clima.max}`);
                console.log()

                break

            case 2:

                busquedas.HistorialCapitalizado.forEach( (lugar, i) => {

                    const index = `${ i +1 }.`.green

                    console.log(`${index} ${lugar} `)

                })

                break
        }


        await pausa()


    } while (opt !== 0);



}

main()