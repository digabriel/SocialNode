process.env.NODE_ENV = 'test';

import {User} from './../../src/models/UserModel';
import {application as app} from './../../src/server';
const chaiHttp = require('chai-http');
import * as chai from 'chai';

const assert = chai.assert;
chai.use(chaiHttp);

describe('AuthRouter', () => {
   // Empty Users before each test
   before((done) => {
      User.deleteMany({}, () => {
         // Creates a test user
         const userJSON = {
            email: 'dimas@test.com',
            password: '123456',
            name: 'Dimas Gabriel',
            gender: 'male'
         };

         const user = new User(userJSON);
         user.save().then((_) => {
            done();
         });
      });
   });

   describe('POST /auth', () => {
      // Auth JSON post body
      const authJSON = {
         email: 'dimas@test.com',
         password: '123456'
      };

      it('it should authenticate a valid user', (done) => {
         chai
            .request(app)
            .post('/auth')
            .send(authJSON)
            .end((err, res) => {
               const data = res.body.data;

               assert.equal(res.status, 200, 'Wrong status code: ' + res.status);
               assert.notExists(err, 'We have an error: ' + err);

               assert.typeOf(data.access_token, 'string', 'Response without access_token field');
               assert.typeOf(data.refresh_token, 'string', 'Response without refresh_token field');
               assert.exists(data.user, 'Response without user field');
               assert.notExists(data.user.email, 'Response with user email included');
               assert.notExists(data.user.password, 'Response with user password included');

               done();
            });
      });

      const worngAuthJSON = {
         email: 'dimas@test.com',
         password: '12356'
      };

      it('it should not authenticate an invalid email/password combination', (done) => {
         chai
            .request(app)
            .post('/auth')
            .send(worngAuthJSON)
            .end((err, res) => {
               const data = res.body.data;

               assert.equal(res.status, 401, 'Wrong status code');
               assert.equal(res.body.code, 1002, 'Wrong error code');
               assert.isString(res.body.message, 'No error message');

               done();
            });
      });
   });
});
