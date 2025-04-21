import inquirer from 'inquirer'
import 'colors'

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: '1. Buscar Ciudad'
            },
            {
                value: 2,
                name: '2. Historial'
            },
            {
                value: 0,
                name: '0. Salir'
            },
        ]
    }
]

export const inquirerMenu = async () => {

    console.clear()
    console.log('======================='.green)
    console.log(' Seleccione Una Opción '.green)
    console.log('=======================\n'.green)

    // Opcion corresponde al name del array
    const { opcion } = await inquirer.prompt(preguntas)

    return opcion

}

export const pausa = async () => {

    const question = [
        {
            type: 'input',
            message: 'Presione ENTER para continuar'
        }
    ] 

    await inquirer.prompt(question)

}

export const leerInput = async (message) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value) {
                if (value.length === 0) {
                    return 'Ingresa un Valor...'
                }

                return true
            }
        }
    ]

    const { desc } = await inquirer.prompt(question)
    return desc

}

export const listarLugares = async( lugares = [] ) => {

    const opciones = lugares.map( (lugar, i) => {

        const index = `${ i + 1 }.`.green

        return {
            value: lugar.id,
            name: `${ index } ${lugar.nombre}`
        }

    })

    opciones.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    })

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccionar',
            choices: opciones
        }
    ]

    const { id } = await inquirer.prompt(preguntas)

    return id

}

export const confirmar = async( mensaje ) => {

    const pregunta = [
        {
            type: 'confirm',
            name: 'ok',
            message: mensaje
        }
    ]

    const { ok } = await inquirer.prompt(pregunta)

    return ok

} 

export const mostrarListadoChecklist = async( tareas = [] ) => {

    const opciones = tareas.map( (tarea, i) => {

        const index = `${ i + 1 }.`.green

        return {
            value: tarea.id,
            name: `${ index } ${tarea.desc}`,
            checked: ( tarea.completadoEn ) ? true : false
        }

    })

    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices: opciones
        }
    ]

    const { ids } = await inquirer.prompt(pregunta)

    return ids

}
