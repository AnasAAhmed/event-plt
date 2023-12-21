import { Schema,Document,models,model} from 'mongoose'

export interface IEvent extends Document{ 
    _id:string;
    title:  String;
    description:  String ;
    location:  String ;
    createdAt:  Date;
    imageUrl:  String;
    starDateTime:  Date;
    endDateTime:  Date;
    price:  String ;
    isFree:  Boolean;
    url: String;
    category: { _id:string, name:string },
    organizer: { _id:string, firstName:string,lastName:string },
}

const Eventchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    createdAt: { type: Date, default:Date.now },
    imageUrl: { type: String, required: true },
    starDateTime: {  type: Date, default:Date.now },
    endDateTime: {  type: Date, default:Date.now },
    price: { type: String },
    isFree: { type: Boolean, default: false },
    url: { type: String },
    category: { type: Schema.Types.ObjectId, ref:'category' },
    organizer: { type: Schema.Types.ObjectId, ref:'User' },
})

const Event = models.Event || model('Event',Eventchema)

export default Event;