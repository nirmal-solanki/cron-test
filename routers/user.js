'use strict';

var user = require('../controllers/userCtrl');

module.exports = function (app) {
    app.route('/users')
        .get(user.getUsers)
        .post(user.createUser);

    app.route('/users/:id')
        .get(user.getUser)
        .put(user.updateUser)
        .delete(user.deleteUser);

    app.route('/login')
        .post(user.login);

};