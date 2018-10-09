process.env.NODE_ENV = 'test';

import { User } from './../../src/models/UserModel';
import { application as app } from './../../src/server';
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
                "email" : "dimas@test.com",
                "password" : "123456",
                "name" : "Dimas Gabriel",
                "gender" : "male"
            }; 

            const user = new User(userJSON);
            user.save().then(_ => {
                done();
            });
        });
    });

    describe('POST /auth', () => {
        // Auth JSON post body
        const authJSON = {
            "email" : "dimas@test.com",
            "password" : "123456"
        };

        it('it should authenticate a valid user and return an access token and the user information', (done) => {
            chai.request(app)
                .post('/auth')
                .send(authJSON)
                .end((err, res) => {
                    assert(res.status === 200, "Wrong status code: " + res.status);
                    assert(err === null, "We have an error: " + err);
                    assert(res.body.access_token !== null, "Response without access_token field");
                    assert(res.body.refresh_token !== null, "Response without refresh_token field");
                    assert(res.body.user !== null, "Response without user field");
                    done();
                });
        })
    });
});