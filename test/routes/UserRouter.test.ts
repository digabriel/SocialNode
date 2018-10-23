process.env.NODE_ENV = 'test';

import {User, UserInterface} from '../../src/models/User';
import {application as app} from './../../src/server';
const chaiHttp = require('chai-http');
import * as chai from 'chai';

const assert = chai.assert;
chai.use(chaiHttp);

describe('UserRouter', () => {
   // Empty Users before each test
   beforeEach((done) => {
      User.deleteMany({}, () => {
         done();
      });
   });

   describe('GET /users', () => {
      it('it should GET all users from database', (done) => {
         chai
            .request(app)
            .get('/users')
            .end((err, res) => {
               assert.isNull(err, `We have an error: ${err}`);
               assert.equal(res.status, 200, 'Wrong status code: ' + res.status);
               done();
            });
      });
   });

   describe('POST /users', () => {
      it('it should not create an user with a password with less than 6 characters', (done) => {
         const user = {
            email: 'dimas@dimasgabriel.net',
            name: 'Dimas Gabriel',
            password: '1234'
         };

         chai
            .request(app)
            .post('/users')
            .send(user)
            .end((err, res) => {
               assert.equal(res.status, 422, `Wrong status code: ${res.status}`);
               done();
            });
      });

      it('it should not create an user with a duplicated email', (done) => {
         const userJSON = {
            email: 'dimas@dimasgabriel.net',
            name: 'Dimas Gabriel',
            password: '123456'
         };

         const user = new User(userJSON);
         user.save().then((_) => {
            chai
               .request(app)
               .post('/users')
               .send(userJSON)
               .end((err, res) => {
                  assert.equal(res.status, 422, `Wrong status code`);
                  done();
               });
         });
      });

      it('it should create a valid user', (done) => {
         const userJSON = {
            email: 'dimas@dimasgabriel.net',
            name: 'Dimas Gabriel',
            password: '123456',
            gender: 'male'
         };

         chai
            .request(app)
            .post('/users')
            .send(userJSON)
            .end((err, res) => {
               const data = res.body.data;

               assert.equal(res.status, 201, 'Wrong status code');
               assert.isNull(err, `We have an error: ${err}`);
               assert.isNotNull(data);
               assert.isString(data._id, `No user id`);
               assert.equal(data.name, userJSON['name'], `Wrong user name`);
               assert.equal(data.gender, userJSON['gender'], `Wrong user gender`);

               done();
            });
      });
   });
});

describe('Relationships', () => {
   let user1: UserInterface, user2: UserInterface;
   let user1AccessToken: string;

   // Create 2 users to use in the tests
   beforeEach((done) => {
      const user1JSON = {
         email: 'dimas@dimasgabriel.net',
         name: 'Dimas Gabriel',
         password: '123456'
      };

      const user2JSON = {
         email: 'dimas2@dimasgabriel.net',
         name: 'Dimas Gabriel 2',
         password: '123456'
      };

      User.deleteMany({}, async () => {
         const _user1 = new User(user1JSON);
         const _user2 = new User(user2JSON);

         user1 = await _user1.save();
         user2 = await _user2.save();

         let authJSON = {
            email: 'dimas@dimasgabriel.net',
            password: '123456'
         };

         chai
            .request(app)
            .post('/auth')
            .send(authJSON)
            .end((err, res) => {
               user1AccessToken = res.body.data.access_token;
               done();
            });
      });
   });

   it('an user should follow another user with success', (done) => {
      chai
         .request(app)
         .post(`/users/${user1._id}/follow`)
         .set('Access-Token', user1AccessToken)
         .end((err, res) => {
            assert.isNull(err, `We have an error: ${err}`);
            assert.equal(res.status, 200, 'Wrong status code: ' + res.status);
            done();
         });
   });
});
