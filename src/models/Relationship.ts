import {Document, Schema, Model, model} from 'mongoose';

export interface IRelationshipModel {
   fromUser: Schema.Types.ObjectId;
   toUser: Schema.Types.ObjectId;
   relation: String;
}
