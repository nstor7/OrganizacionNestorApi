import { ObjectId } from 'mongodb'
import { tareaSchema, updateTareaSchema } from '../schemas/tareaSchema.js'

export class TareaController{
    constructor({ tareaModel }){
        this.tareaModel = tareaModel
    }
        getKanbanByProject =  async (req, res)=>{
            const { projectId } = req.params
            try{
                const tasks = await this.tareaModel.getKanbanByProject({projectId})
                res.json(tasks)
            }catch{
                return res.status(500).json({error: "error al definir Kanban"})
            }
            
        }

        getTodoList = async (req, res) => {
            const { urgency } = req.query; // 'today', 'pending', 'idea', 'done'

            // Obtenemos fechas para la lógica automática
            const now = new Date();
            const deadline = now.toISOString().split('T')[0]; 
            const todate = deadline.slice(5, 10);            

            try {
                const results = await this.tareaModel.getTodoList({urgency, todate, deadline})
                res.json(results);
            
            } catch (error) {
                res.status(500).json({ error: "Error al obtener la lista de To-Dos" });
            }
}

        getDailyView = async (req, res)=>{
            const { date } = req.query
            const days = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
            
            try{
                const dayOfWeek = days[new Date(date).getUTCDay()]
                const { appointments, taskSessions, recurrents } = await this.tareaModel.getDailyView({date, dayOfWeek})

                res.json({appointments, taskSessions, recurrents})
            }catch{
                res.status(500).json({ error : "Error al obtener la lista de Día"})
            }
            
        }

        createTarea = async (req, res)=>{
            const validation = tareaSchema.safeParse(req.body)

            if (!validation.success){
                return res.status(400).json({error: validation.error.errors})
            }

            const newTarea = await this.tareaModel.createTarea({data: validation.data})
            res.status(201).json(newTarea)
        }

        updateTarea = async(req, res)=>{
            const validation = updateTareaSchema.partial().safeParse(req.body)

            if(!validation.success){
                return res.status(400).json({error: validation.error.errors})

            }
            const { id } = req.params
            
            try{
                const updatedTarea = await this.tareaModel.updateTarea({id, data: validation.data})

                if(!updatedTarea){
                    return res.status(404).json({ message: 'Tarea no encontrada'})
                }
                res.json(updatedTarea)
            }catch(error){
                res.status(500).json({ error: 'error al actualizar el proyecto'})
            }
        }
        deleteTarea = async(req, res)=>{
            const { id } = req.params

            try{
                const deleted = await this.tareaModel.deleteTarea({ id: new ObjectId(id) })
                if (!deleted) res.status(404).json({message: 'Tarea no encontrada'})

                return res.json({message: 'Tarea eliminada correctamente'})
            }catch{
                res.status(500).json({message: 'error tratando de eliminar la tarea'})
            }
        }
}