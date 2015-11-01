var expect = require("chai").expect;

var Waterline = require('waterline');
var diskAdapter = require('sails-disk');
var userCollection = require('../models/user');
var accountCollection = require('../models/account');
var historyCollection = require('../models/history');
var bcrypt = require('bcryptjs');

var ormConfig = {
    adapters: {
        disk: diskAdapter
    },
    connections: {
        disk: {
            adapter: 'disk'
        }
    },
    defaults: {
        migrate: 'alter'
    }
};

var User;

before(function (done) {
    var orm = new Waterline();

    orm.loadCollection(userCollection);
    orm.loadCollection(accountCollection);
    orm.loadCollection(historyCollection);

    orm.initialize(ormConfig, function(err, models) {
        if(err) throw err;
        User = models.collections.user;
        done();
    });
});

describe("UserTest", function () {
    beforeEach(function (done) {
        User.destroy({email: "test@test.com"}, function (err) {
            if (err) throw err;
            done();
        });
    });
    it("should create a new user", function () {
       return User.create({
            email: "test@test.com",
            password: "testpass",
            firstname: "Firstname",
            lastname: "Lastname",
            address: "Test street 13.",
            city: "Test city",
            zipcode: 1000,
            role: "user"
        })
        .then(function (user) {
            expect(user.email).to.equal("test@test.com");
            expect(bcrypt.compareSync("testpass", user.password)).to.be.true;
            expect(user.firstname).to.equal("Firstname");
            expect(user.lastname).to.equal("Lastname");
            expect(user.address).to.equal("Test street 13.");
            expect(user.city).to.be.equal("Test city");
            expect(user.zipcode).to.be.equal(1000);
            expect(user.role).to.be.equal("user");
        });
   });
   
    function getUserData() {
        return {
            email: "test@test.com",
            password: "testpass",
            firstname: "Firstname",
            lastname: "Lastname",
            address: "Test street 13.",
            city: "Test city",
            zipcode: 1000,
            role: "user"
        };
    }
   
   it("should be able to find a user", function() {
        return User.create(getUserData()).then(function(user) {
            return User.findOne({email: user.email}).then(function (user) {
                expect(user.email).to.equal("test@test.com");
                expect(bcrypt.compareSync("testpass", user.password)).to.be.true;
                expect(user.firstname).to.equal("Firstname");
                expect(user.lastname).to.equal("Lastname");
                expect(user.address).to.equal("Test street 13.");
                expect(user.city).to.be.equal("Test city");
                expect(user.zipcode).to.be.equal(1000);
                expect(user.role).to.be.equal("user");
            });
        });
   });
    
    it("should throw error for invalid data", function () {
        return expect(User.create({
            email: "test@test.com",
            password: "testpass",
            firstname: "Firstname",
            lastname: "Lastname",
            address: "Test street 13.",
            city: "Test city",
            zipcode: 1000,
            role: "invalidrole"
        })).to.throw;
    });    
});

describe('ValidPassword', function() {
    beforeEach(function (done) {
        User.destroy({email: "test@test.com"}, function (err) {
            if (err) throw err;
            done();
        });
    });
    it("should return true with right password", function() {
         return User.create({
            email: "test@test.com",
            password: "testpass",
            firstname: "Firstname",
            lastname: "Lastname",
            address: "Test street 13.",
            city: "Test city",
            zipcode: 1000,
            role: "user"
        }).then(function(user) {
            expect(user.validPassword("testpass")).to.be.true;
        });
    });
    it("should return false with wrong password", function() {
         return User.create({
            email: "test@test.com",
            password: "testpass",
            firstname: "Firstname",
            lastname: "Lastname",
            address: "Test street 13.",
            city: "Test city",
            zipcode: 1000,
            role: "user"
        }).then(function(user) {
            expect(user.validPassword("wrong")).to.be.false;
        });
    });
});