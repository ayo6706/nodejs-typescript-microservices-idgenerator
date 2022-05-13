import { RequestHandler} from "express"
import { SequenceGenerator } from "./generator";
import IdGenerator from "./model";
import config from "config"


const workerIdBits = config.get("workerIdBits") as number;
const datacenterIdBits = config.get("datacenterIdBits") as number;
const sequenceBits = config.get("sequenceBits") as number;


export const create_a_InstanceId: RequestHandler = async (req, res) => {

    const Idgenerator = new SequenceGenerator(0, 1, {
        workerIdBits: workerIdBits,
        datacenterIdBits: datacenterIdBits,
        sequenceBits: sequenceBits,
    });
    const uid = new IdGenerator({
        instanceId : Idgenerator.nextId()
    })
    
    const saved_Id = await uid.save()
    return res.json(saved_Id)
    
}


export const get_all_instance: RequestHandler = async (req, res) => {
    try {
        const instance = await IdGenerator.find()
        return res.json(instance)
    } catch (er) {
        console.log(er)
        return res.json({"message": "Error while getting all the instances!", "error" : er})
    }
}


export const update_instance_status: RequestHandler = async (req, res) => {


    const instanceId = req.params.instanceId;
    const updateStatus = req.body.status;  
          
    const instance = await IdGenerator.findOne({ instanceId });

    if (!instance) {
      return res.sendStatus(404);
    }

   
    const updatedStatus = await IdGenerator.findOneAndUpdate({ instanceId }, updateStatus, { new: true });
    return res.send(updatedStatus);
  }