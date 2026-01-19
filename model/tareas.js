import { MongoClient, ObjectId, ReturnDocument, ServerApiVersion } from 'mongodb'
const uri = process.env.MONGODB_CONNECTION_KEY

const client = new MongoClient(uri, {
    serverApi:{
        version: ServerApiVersion.v1,
        strict: true, 
        deprecationErrors: true
    }
})

async function connect (){
    try{
        await client.connect()
        const database = client.db('GestionadiorDeTareasDeNestor')
        return {
            tareas: database.collection('tareas'),
            project: database.collection('projects')
        }
    } catch(error){
        console.error('error connectiong to the database')
        console.error(error)
        await client.close()
    }
}
export class tareaModel{
    static async getKanbanByProject({projectId}){
        const db = await connect()
        const tasks = await db.tareas.find( {type: "task", projectId: projectId} ).toArray()
        return tasks
    }

    static async getTodoList({ urgency, todate, deadline}) {
    const { tareas } = await connect();
    
    if(urgency === "today"){
        const birthdays = await tareas.find({type: 'birthday', date: todate}).toArray()

        const fechadas = await tareas.find({type: "todo", deadline: {$regex: `^${deadline}`}}).toArray()

        const today = await tareas.find({type:'todo', urgency:'today'}).toArray()

        return [
            ...birthdays, ...fechadas, ...today
        ]
    }

    return await tareas.find({type:'todo', urgency}).toArray()
}


    static async getDailyView ({date, dayOfWeek}){
        const {tareas} = await connect()

        const appointments = await tareas.find({type: "appointment", start: {$regex: `^${date}`}}).toArray()

        const taskSessions = await tareas.find({
            type: "task",
            'workSessions.start': { $regex: `^${date}`}
        }).toArray()

        const recurrents = await tareas.find({
            type: "recurrent",
            "slots.day": dayOfWeek
        }).toArray()

        return {appointments, taskSessions, recurrents}
    }

    static async createTarea ({data}){
        const { tareas } = await connect()
        const result = await tareas.insertOne(data)
        return {...data, _id: result.insertedId.toString()}
    }

    static async updateTarea({id, data}){
        const { tareas } = await connect()

        const result = await tareas.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: data},
            {returnDocument: 'after'}
        )
        return result
    }
    static async deleteTarea({id}){
        const { tareas } = await connect()

        const result = await tareas.deleteOne({_id: id})

        return result.deletedCount > 0
    }
}   