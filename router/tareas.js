import { Router } from 'express'
import { TareaController } from '../controllers/tareas.js'

export const createTareaRouter = ({ tareaModel }) =>{
    const tareaRouter = Router()

    const tareaController =  new TareaController({ tareaModel })

    tareaRouter.get('/kanban/:projectId', tareaController.getKanbanByProject)

    tareaRouter.get('/todo', tareaController.getTodoList)

    tareaRouter.get('/day', tareaController.getDailyView)

    tareaRouter.post('/', tareaController.createTarea)
    
    tareaRouter.patch('/:id', tareaController.updateTarea)

    tareaRouter.delete('/:id', tareaController.deleteTarea)

   return tareaRouter
}