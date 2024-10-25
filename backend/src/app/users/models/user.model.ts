import * as bcrypt from 'bcrypt';

const validateEmail = function (email: string) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    validate: [validateEmail, 'Please fill a valid email address'],
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  hashedRt: string;
}
const UserSchema = SchemaFactory.createForClass(User);


export default UserSchema;
