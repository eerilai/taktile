const { User } = require('./index');
const { hashPassword, comparePassword } = require('./encryptionHelpers');

const findUserById = (id) => {
  return new Promise((resolve, reject) => {
    User.findById(id)
      .then((user) => {
        resolve(user);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const findOrCreateUserByGoogleId = (id) => {
  return new Promise((resolve, reject) => {
    User.findOrCreate({
      where: {
        googleID: id
      },
      defaults: {
        username: 'Tak-user-' + Math.random().toString(36).slice(2,9)
      }
    })
      .then(([user, created]) => {
        resolve(user);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

const createUser = (userInfo) => {
  return new Promise((resolve, reject) => {
  const { username, email, password } = userInfo;
  hashPassword(password)
    .then((hash) => {
      User.create({
        username,
        email,
        password: hash
      })
      .then((user) => {
        resolve(user);
      })
      .catch((err) => {
        reject(err);
      })
    })
    .catch((err) => {
      reject(err);
    });
  });
}

module.exports = {
  findUserById,
  findOrCreateUserByGoogleId,
  createUser
};