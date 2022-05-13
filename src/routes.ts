import { Express, Request, Response } from "express";
import { create_a_InstanceId, get_all_instance,  update_instance_status } from "./controller";



export default function (app: Express) {

 
    app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));
    

    app.get("/api/instance", get_all_instance);

    app.post("/api/instance/generate",  create_a_InstanceId);
     
    app.put("/api/instance/status/:instanceId", update_instance_status);
  

  }