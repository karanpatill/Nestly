const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError');
const Listing = require('./models/listing.js'); // Fixed capitalization
const Review = require('./models/review.js'); 
const { listingSchema, reviewSchema } = require('./Schema.js');
const listings = require('./routes/listing.js');
const users = require('./routes/user.js');
const posts = require('./routes/post.js');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const app = express();
const session = require('express-session');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionoption = session({
    secret: "secret",
    resave: false, 
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, 
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
});

app.use(sessionoption); // Session first
app.use(flash());       // Flash next

app.use((req, res, next) => {
    res.locals.successmsg = req.flash('success');  
    res.locals.errormsg = req.flash('error');
    next();
});


const mongourl = 'mongodb://127.0.0.1:27017/wanderlust';
async function main() {
    await mongoose.connect(mongourl);
    console.log("MongoDB connected");
}
main().catch(err => console.log(err));

app.get("/", (req, res) => { 
    res.redirect("/listings");
});

app.use("/listings", listings);
app.use("/users", users);
app.use("/posts", posts);


/* ============================
   Server Initialization
============================ */
app.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`);
});
