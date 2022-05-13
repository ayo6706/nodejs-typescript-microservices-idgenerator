import mongoose, { Schema, model } from 'mongoose'

export interface IdGeneratorDocument extends mongoose.Document{
    status: number;
    instanceId: string;
    createdAt: Date;
}


const IdGeneratorSchema = new Schema ({
    instanceId : {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true,
        default: 1,
        enum: [1, 2]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default model<IdGeneratorDocument>('IdGenerator', IdGeneratorSchema)