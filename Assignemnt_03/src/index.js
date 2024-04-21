const express = require("express")
const path = require("path")
const app = express()
const hbs = require("hbs")
const LogInCollection = require("./mongo")
const port = process.env.PORT || 3000
app.use(express.json())
app.use(express.urlencoded({ extended: false }))  
const tempelatePath = path.join(__dirname, '../tempelates')
// const publicPath = path.join(__dirname, '../public')
// console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
// app.use(express.static(publicPath))
app.use(express.static('public'));


app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})

app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    };
    
    try {
        const checking = await LogInCollection.findOne({ name: req.body.name });
        
        if (checking) {
            if (checking.name === req.body.name && checking.password === req.body.password) {
                return res.send("User details already exist");
            } else {
                await LogInCollection.insertMany([data]);
                return res.render("home");
            }
        } else {
            // No user found with the provided name
            await LogInCollection.insertMany([data]);
            return res.render("home");
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Internal Server Error");
    }
});



app.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name })
        if (check.password === req.body.password) {
            // res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` })
            res.render("home")
        }
        else {
            res.send("incorrect password")
        }
    } 
    catch (e) {
        res.send("wrong details")
    }
})

app.listen(port, () => {
    console.log('port connected');
})