import express, { json } from 'express'
import { createTareaRouter } from './router/tareas.js'
import { createProjectRouter } from './router/project.js'
import { corsMiddleware } from './middlewares/cors.js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

export const createApp = ({ tareaModel, projectModel })=>{

    const app = express()
    app.use(json())
    app.use(corsMiddleware())
    app.disable('x-powered-by')

    app.use('/tareas', createTareaRouter({ tareaModel }))

    app.use('/projects', createProjectRouter({ projectModel }))

    const PORT = process.env.PORT ?? 1234

    app.listen(PORT, ()=>{
        console.log(`Servidor escuchando en http://localhost:${PORT}`)
    })

    return app
}