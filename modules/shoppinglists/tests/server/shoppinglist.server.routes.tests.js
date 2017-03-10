'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Shoppinglist = mongoose.model('Shoppinglist'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  shoppinglist;

/**
 * Shoppinglist routes tests
 */
describe('Shoppinglist CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Shoppinglist
    user.save(function () {
      shoppinglist = {
        name: 'Shoppinglist name'
      };

      done();
    });
  });

  it('should be able to save a Shoppinglist if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Shoppinglist
        agent.post('/api/shoppinglists')
          .send(shoppinglist)
          .expect(200)
          .end(function (shoppinglistSaveErr, shoppinglistSaveRes) {
            // Handle Shoppinglist save error
            if (shoppinglistSaveErr) {
              return done(shoppinglistSaveErr);
            }

            // Get a list of Shoppinglists
            agent.get('/api/shoppinglists')
              .end(function (shoppinglistsGetErr, shoppinglistsGetRes) {
                // Handle Shoppinglists save error
                if (shoppinglistsGetErr) {
                  return done(shoppinglistsGetErr);
                }

                // Get Shoppinglists list
                var shoppinglists = shoppinglistsGetRes.body;

                // Set assertions
                (shoppinglists[0].user._id).should.equal(userId);
                (shoppinglists[0].name).should.match('Shoppinglist name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Shoppinglist if not logged in', function (done) {
    agent.post('/api/shoppinglists')
      .send(shoppinglist)
      .expect(403)
      .end(function (shoppinglistSaveErr, shoppinglistSaveRes) {
        // Call the assertion callback
        done(shoppinglistSaveErr);
      });
  });

  it('should not be able to save an Shoppinglist if no name is provided', function (done) {
    // Invalidate name field
    shoppinglist.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Shoppinglist
        agent.post('/api/shoppinglists')
          .send(shoppinglist)
          .expect(400)
          .end(function (shoppinglistSaveErr, shoppinglistSaveRes) {
            // Set message assertion
            (shoppinglistSaveRes.body.message).should.match('Please fill Shoppinglist name');

            // Handle Shoppinglist save error
            done(shoppinglistSaveErr);
          });
      });
  });

  it('should be able to update an Shoppinglist if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Shoppinglist
        agent.post('/api/shoppinglists')
          .send(shoppinglist)
          .expect(200)
          .end(function (shoppinglistSaveErr, shoppinglistSaveRes) {
            // Handle Shoppinglist save error
            if (shoppinglistSaveErr) {
              return done(shoppinglistSaveErr);
            }

            // Update Shoppinglist name
            shoppinglist.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Shoppinglist
            agent.put('/api/shoppinglists/' + shoppinglistSaveRes.body._id)
              .send(shoppinglist)
              .expect(200)
              .end(function (shoppinglistUpdateErr, shoppinglistUpdateRes) {
                // Handle Shoppinglist update error
                if (shoppinglistUpdateErr) {
                  return done(shoppinglistUpdateErr);
                }

                // Set assertions
                (shoppinglistUpdateRes.body._id).should.equal(shoppinglistSaveRes.body._id);
                (shoppinglistUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Shoppinglists if not signed in', function (done) {
    // Create new Shoppinglist model instance
    var shoppinglistObj = new Shoppinglist(shoppinglist);

    // Save the shoppinglist
    shoppinglistObj.save(function () {
      // Request Shoppinglists
      request(app).get('/api/shoppinglists')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Shoppinglist if not signed in', function (done) {
    // Create new Shoppinglist model instance
    var shoppinglistObj = new Shoppinglist(shoppinglist);

    // Save the Shoppinglist
    shoppinglistObj.save(function () {
      request(app).get('/api/shoppinglists/' + shoppinglistObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', shoppinglist.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Shoppinglist with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/shoppinglists/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Shoppinglist is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Shoppinglist which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Shoppinglist
    request(app).get('/api/shoppinglists/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Shoppinglist with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Shoppinglist if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Shoppinglist
        agent.post('/api/shoppinglists')
          .send(shoppinglist)
          .expect(200)
          .end(function (shoppinglistSaveErr, shoppinglistSaveRes) {
            // Handle Shoppinglist save error
            if (shoppinglistSaveErr) {
              return done(shoppinglistSaveErr);
            }

            // Delete an existing Shoppinglist
            agent.delete('/api/shoppinglists/' + shoppinglistSaveRes.body._id)
              .send(shoppinglist)
              .expect(200)
              .end(function (shoppinglistDeleteErr, shoppinglistDeleteRes) {
                // Handle shoppinglist error error
                if (shoppinglistDeleteErr) {
                  return done(shoppinglistDeleteErr);
                }

                // Set assertions
                (shoppinglistDeleteRes.body._id).should.equal(shoppinglistSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Shoppinglist if not signed in', function (done) {
    // Set Shoppinglist user
    shoppinglist.user = user;

    // Create new Shoppinglist model instance
    var shoppinglistObj = new Shoppinglist(shoppinglist);

    // Save the Shoppinglist
    shoppinglistObj.save(function () {
      // Try deleting Shoppinglist
      request(app).delete('/api/shoppinglists/' + shoppinglistObj._id)
        .expect(403)
        .end(function (shoppinglistDeleteErr, shoppinglistDeleteRes) {
          // Set message assertion
          (shoppinglistDeleteRes.body.message).should.match('User is not authorized');

          // Handle Shoppinglist error error
          done(shoppinglistDeleteErr);
        });

    });
  });

  it('should be able to get a single Shoppinglist that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Shoppinglist
          agent.post('/api/shoppinglists')
            .send(shoppinglist)
            .expect(200)
            .end(function (shoppinglistSaveErr, shoppinglistSaveRes) {
              // Handle Shoppinglist save error
              if (shoppinglistSaveErr) {
                return done(shoppinglistSaveErr);
              }

              // Set assertions on new Shoppinglist
              (shoppinglistSaveRes.body.name).should.equal(shoppinglist.name);
              should.exist(shoppinglistSaveRes.body.user);
              should.equal(shoppinglistSaveRes.body.user._id, orphanId);

              // force the Shoppinglist to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Shoppinglist
                    agent.get('/api/shoppinglists/' + shoppinglistSaveRes.body._id)
                      .expect(200)
                      .end(function (shoppinglistInfoErr, shoppinglistInfoRes) {
                        // Handle Shoppinglist error
                        if (shoppinglistInfoErr) {
                          return done(shoppinglistInfoErr);
                        }

                        // Set assertions
                        (shoppinglistInfoRes.body._id).should.equal(shoppinglistSaveRes.body._id);
                        (shoppinglistInfoRes.body.name).should.equal(shoppinglist.name);
                        should.equal(shoppinglistInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Shoppinglist.remove().exec(done);
    });
  });
});
