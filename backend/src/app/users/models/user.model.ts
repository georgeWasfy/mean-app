import * as bcrypt from 'bcrypt';

const validateEmail = function (email: string) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
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
}
const UserSchema = SchemaFactory.createForClass(User);

// Pre-save hook to hash the password
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if password is new or modified

  const salt = await bcrypt.genSalt(10); // Generate a salt
  this.password = await bcrypt.hash(this.password, salt); // Hash the password
  next();
});

// // Method to generate a hash from plain text
// UserSchema.methods.createHash = async function (plainTextPassword: string) {
//   const saltRounds = 10;
//   const salt = await bcrypt.genSalt(saltRounds);
//   return await bcrypt.hash(plainTextPassword, salt);
// };

// // Validating the candidate password with stored hash and hash function
// UserSchema.methods.validatePassword = async function (
//   candidatePassword: string
// ) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

export default UserSchema;
