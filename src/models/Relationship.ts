import {Document, Schema, Model, model} from 'mongoose';

export interface RelationshipInterface extends Document {
   fromUser: Schema.Types.ObjectId | string;
   toUser: Schema.Types.ObjectId | string;
   relation: string;
}

const RelationshipSchema = new Schema({
   fromUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },

   toUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },

   relation: {
      type: String,
      enum: ['follow', 'block']
   }
});

RelationshipSchema.index({fromUser: 1, toUser: 1}, {unique: true});

export const Relationship: Model<RelationshipInterface> = model<RelationshipInterface>(
   'Relationship',
   RelationshipSchema
);
