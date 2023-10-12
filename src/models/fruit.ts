import mongoose, { Schema, Document } from "mongoose";

interface IFruit extends Document {
  fruit_name: string;
}

const fruitSchema: Schema = new Schema({
  fruit_name: String,
});

export default mongoose.model<IFruit>("Fruit", fruitSchema);
