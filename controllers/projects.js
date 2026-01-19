import { projectSchema } from "../schemas/projectSchema.js"

export class projectController {
    constructor({projectModel}){
        this.projectModel = projectModel
    }

    getProjects =  async (req, res)=>{
        try{
            const proyectos = await this.projectModel.getProjects()
            res.json(proyectos)
        }catch{
            res.status(500).json({error: "error al mostrar los proyectos"})
        }
            
        }
    createProject = async(req, res)=>{
        const validation = projectSchema.safeParse(req.body)
        if(!validation.success) return res.status(400).json({error:validation.error.errors})

        try{
            const newProject = await this.projectModel.createProject(validation.data)
            res.status(201).json(newProject)
        }catch{
            return res.status(500).json({error: "error al crear el proyecto"})
        }
        
    }

    updateProject = async(req, res)=>{
        const validation = projectSchema.partial().safeParse(req.body)

        if(!validation.success){
            return res.status(400).json({error: validation.error.errors})
        }

        const { id } = req.params

        try{
            const updatedProject = await this.projectModel.updateProject({ id, data: validation.data})

            if (!updatedProject) {
            return res.status(404).json({ message: 'Proyecto no encontrado' })
        }

        res.json(updatedProject)

        }catch (error) {
        res.status(500).json({ error: 'Error al actualizar el proyecto' })
    }
    }

    deleteProject = async (req, res)=> {
        const { id } = req.params
        
        try{
            const deleted = await this.projectModel.deleteProject({ id })

            if(!deleted){
                return res.status(404).json({ message: 'Proyecto no encontrado'})
            }

            return res.json({ message: 'Proyecto y sus tareas eliminados correctamente'})
        }catch(error){
            res.status(500).json({ error: 'Error al eliminar el proyecto'})
        }
    }
}