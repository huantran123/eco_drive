const User = require('../models/user.js').User;

module.exports = {

  // test adding a fake user
  addExampleUser: async () => {
    const doc = new User({
      full_name: 'john smith',
      email: 'jsmith@yahoo.com'
    });
    await doc.save();
  },

  // remove all users from database
  clearUsers: async () => {
    await User.deleteMany( {} );
  },

  // get one user by ID
  getUser: async (userId) => {
    // console.log('ID', userId)
    let id = {_id: userId};
    let user = await User.find(id).catch(err => console.log('ERR FINDING: ', err))
    return user;
  },

  // start route
  startRoute: async (_id, route) => {
    await User.updateOne({ _id }, {$set: {[`${route}_route.started`]: true}}).catch(err => console.log(err));
    return 'started trip';
  },

  // end a trip (& send back passenger ID list)
  endTrip: async (_id, route) => {
    let users = await User.find({ _id })
    let user = users[0];
    console.log('Before:', user)
    var rider_list = user.driver_route.riders;

    if (route === "driver") {
      // concat rider_list to the recent riders array
      await User.updateOne({ _id }, {$concat: {recent_riders: rider_list}}).catch(err => console.log(err));
      // add route to driver_trips
      await User.updateOne({ _id }, {$push: {driver_trips: user.driver_route}}).catch(err => console.log(err));
      // clear driver_route
      await User.updateOne({ _id }, {$set: {driver_route: { started: false }}}).catch(err => console.log(err));
      return rider_list;

    } else if (route === "rider") {
      // add driver to recent drivers
      await User.updateOne({ _id }, {$push: {recent_drivers: user.rider_route.driver_id}}).catch(err => console.log(err));
      // add route to rider_trips
      await User.updateOne({ _id }, {$push: {rider_trips: user.rider_route}}).catch(err => console.log(err));
      // clear rider_route
      await User.updateOne({ _id }, {$set: {rider_route: { started: false }}}).catch(err => console.log(err));
      return rider_list;
    }
  },

  // add a favorite to a user's list
  addFavorite: async (userId, driverId) => {
    const filter = {_id: userId};
    await User.updateOne(filter, {$push: {favorites: driverId}}).catch(err => console.log(err));
    return 'Successfully favorite driver'
  },

  // remove a favorite from a user's list
  removeFavorite: async (userId, driverId) => {
    const filter = {_id: userId};
    await User.updateOne(filter, {$pull: {favorites: driverId}}).catch(err => console.log(err));
    return 'Successfully unfavorite driver'
  },

  // cancel rider route
  cancelRiderRoute: async (_id) => {
    let users = await User.find({ _id })
    let user = users[0];
    // remove rider from riders array of driver
    await User.updateOne({_id: user.rider_route.driver_id }, {$pull: {driver_route: {riders: _id}}}).catch(err => console.log(err));
    // remove rider_route for user
    await User.updateOne({_id }, {$set: {rider_route: { started: false }}}).catch(err => console.log(err));
    return 'Successfully cancelled route'
  },

  // cancel driver route
  cancelDriverRoute: async (_id) => {
    let users = await User.find({ _id })
    let user = users[0];
    // remove rider_route for all riders
    for (var rider_id of user.driver_route.riders) {
      await User.updateOne({ _id: rider_id }, {$set: {rider_route: { started: false }}}).catch(err => console.log(err));
    }
    // remove driver_route for user
    await User.updateOne({ _id }, {$set: {driver_route: { started: false , riders: []}}}).catch(err => console.log(err));
    return 'Successfully canceled route'
  }

};
