process.env.NODE_ENV = 'test';

import {User, IUserModel} from '../../src/models/UserModel';
import {assert} from 'chai';

let user: IUserModel;

describe('UserModel', () => {
  before((done) => {
    User.deleteMany({}, () => {
      const userJSON = {
        email: 'dimas@dimas.com',
        name: 'Dimas Gabriel',
        password: 'qwerty'
      };

      user = new User(userJSON);
      user.save().then((user) => {
        done();
      });
    });
  });

  describe('comparePassword', () => {
    it('it should compare two equal passwords and return true', (done) => {
      const userJSON = {
        email: 'dimas@dimas.com',
        name: 'Dimas Gabriel',
        password: 'qwerty'
      };

      user.comparePassword('qwerty').then(
        (result) => {
          assert.equal(result, true);
          done();
        },
        (err) => {
          console.log(`Compare password error: ${err}`);
        }
      );
    });
  });

  describe('toJSON()', () => {
    it('it should exclude certains fileds when converting an user to JSON', (done) => {
      const json = user.toJSON();
      assert.notExists(json.email);
      assert.notExists(json.password);
      done();
    });
  });
});
