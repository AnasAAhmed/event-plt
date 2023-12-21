import { Schema ,models,model} from 'mongoose'

export interface ICategory extends Document{  
_id:string;
name:string;
}


const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
  
})

const Category = models.User || model('User',CategorySchema)

export default Category;