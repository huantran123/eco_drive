/* eslint-disable block-scoped-var */
/* eslint-disable no-trailing-spaces */
/* eslint-disable padded-blocks */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-console */
/* eslint-disable comma-dangle */

require('dotenv').config();
const mongoose = require('mongoose');

try {
  // Connect to the MongoDB cluster
  mongoose.connect(
    process.env.DATABASE_CONNECTION_ADDRESS,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    () => console.log('mongoose is connected')
  );

  var db = mongoose.connection;

} catch (e) {
  console.log('mongoose could not connect to cluster');
}
<<<<<<< HEAD

module.exports = db;
=======
run().catch(console.dir);
>>>>>>> aed6f0a193eba884aad8e03e870c38429d8a0d04