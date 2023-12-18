const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();
app.use(express.json());


let users = [];
let index = 0;

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});