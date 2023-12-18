const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const passport = require('passport');
const app = express();
let users = [];
let index = 0;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: "ASFSDF#45jk242SDf3242sdf",
    resave: false,
    saveUninitialized: false
}));

function getUserById(id) {
    return users.find((user) => user.id == id);
}

function getUserByUsername(username) {
    return users.find((user) => user.username == username);
}
const initializePassport = require('./passport-config')
initializePassport(passport, getUserByUsername, getUserById)

app.use(passport.initialize())
app.use(passport.session())



app.post('/api/user/register', async (req, res) => {
    const login_info = req.body;
    index++
    const found = users.find((user) => user.username == login_info.username)
    if (found) {
        return res.status(400).send("Username already exists");
    } else {
        try{
            const new_user = {
                id: index,
                username: login_info.username,
                password: await hashPassword(login_info.password)
            };

            users.push(new_user);
            res.json(new_user);
        } catch (e) {
            throw e
        }
    }
    
});
/*
app.post('/api/user/login', passport.authenticate('local', {
    successMessage: "Yes!",
    failureMessage: "Nope"
}))

*/
app.post('/api/user/login', 
  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err); }
      if (!user) { return res.status(401).send('Invalid credentials'); }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        return res.status(200).send('Logged in successfully');
      });
    })(req, res, next);
  }
);
/*
app.post('/api/user/register', async (req, res) => {
    const login_info = req.body;
    const found = users.find((user) => user.username == login_info.username)
    if (found) {
        if (await checkPassword) {
            res
        }
    } else {



});
*/
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    return res.status(401).send("No Cookie, my boe")
}

app.get("/api/secret", checkAuthenticated, (req, res) => {
    res.status(200).send("Welcome to my secret page");
})





app.get("/api/user/list", (req,res) => {
    res.send(users);
})

async function hashPassword(password){
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        return hashedPassword
    } catch(e) {
        throw e;
    }
}

async function checkPassword(submittedPassword, storedHash) {
    try {
      return await bcrypt.compare(submittedPassword, storedHash);
    } catch (error) {
      throw error;
    }
  }

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});