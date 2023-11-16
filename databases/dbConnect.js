const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB).then(() => {
   // console.log("connected to DB "+mongoDB);
})
.catch((err) => {
    console.log(err);
});