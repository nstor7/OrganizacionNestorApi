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
            projects: database.collection('projects')
        }
    } catch(error){
        console.error('error connectiong to the database')
        console.error(error)
        await client.close()
    }
}

export class projectModel {
    static async getProjects(){
        const {projects} = await connect()
        const proyectos = await projects.find({}).toArray()
        return proyectos
        
    }
    static async createProject(data){
        const { projects } = await connect()
        const result = await projects.insertOne(data)
        return {...data, _id: result.insertedId.toString()}
    }

    static async updateProject ({id, data}){
        const { projects } = await connect()
        
        const result = await projects.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: data},
            {returnDocument: 'after'}
        )
        return result
    }

    static async deleteProject ({id}){
        const { projects, tareas} = await connect()

        const objectId = new ObjectId(id)

        await tareas.deleteMany({ projectId: id})
        const result = await projects.deleteOne({_id: objectId})
        return result.deletedCount > 0
    }
}
