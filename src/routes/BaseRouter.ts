import {APIError, APIErrorCodes} from './../models/APIError';
import {Model, Document, Types} from 'mongoose';
import {APIResponse} from './../models/APIResponse';
import {Response} from 'express';

// Base Router class with basic common functionallity.
export class BaseRouter<T extends Document> {
   model: Model<T>;

   constructor(model: Model<T>) {
      this.model = model;
   }

   private isValidId(id: string | number | Types.ObjectId): boolean {
      return Types.ObjectId.isValid(id);
   }

   // Returns a boolean promise telling if a document with an ObjectId exists
   exists(id: string | number | Types.ObjectId): Promise<boolean> {
      const self = this;
      return new Promise(async function(resolve, reject) {
         if (!self.isValidId(id)) {
            return reject(APIError.resourceNotFound());
         }

         try {
            const count = await self.model.estimatedDocumentCount({_id: id});
            resolve(count > 0);
         } catch (e) {
            reject(e);
         }
      });
   }

   // Saves a new document and handles response
   async create(model: T, res: Response, next) {
      try {
         const d = await model.save();
         let response = new APIResponse(true, 201, d);
         res.status(201).send(response);
      } catch (err) {
         let apiError = new APIError(err.message, null, 422);
         next(apiError);
      }
   }

   // async delete(id: string | number | Types.ObjectId, res: Response, next)
   // async update(id: string | number | Types.ObjectId, updates, res: Response, next)
   // async findFirst(id)
   // async find(query)
}
