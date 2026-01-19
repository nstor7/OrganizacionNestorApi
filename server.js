import { createApp } from "./app.js"
import { projectModel } from "./model/projects.js"
import { tareaModel } from "./model/tareas.js"
    createApp({ tareaModel: tareaModel, projectModel: projectModel})