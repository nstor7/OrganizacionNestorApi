import { Router } from 'express'
import { projectController } from '../controllers/projects.js'

export const createProjectRouter =  ({ projectModel }) =>{
    const projectRouter = Router()

    const ProjectController =  new projectController({ projectModel })

    projectRouter.get('/', ProjectController.getProjects)
    projectRouter.post('/', ProjectController.createProject)
    projectRouter.patch('/:id', ProjectController.updateProject)
    projectRouter.delete('/:id', ProjectController.deleteProject)
    
   return projectRouter
}