import express from 'express';
import mongoose from 'mongoose';
import bp from 'body-parser';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.mjs';

const app = express();

// middleware
app.use(express.static('public'))
app.use(bp.urlencoded({extended: true}))
app.use(cookieParser())
app.use(bp.json())

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://withAsilbeck:wBuL9xsCMCgikTe7@cluster0.x7vdmpi.mongodb.net/auth?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(8000))
  .catch((err) => console.log(err));

// routes
app.get('/set-cookies', (req, res) => {
  res.cookie('newUser', false)
  res.cookie('isEmployee', true, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  })
})

app.get('/read-cookies', (req, res) => {
    const cookies = req.cookies;
    console.log(cookies)
    res.json(cookies)
})

app.use(authRoutes);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));