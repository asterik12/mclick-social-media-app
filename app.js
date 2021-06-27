const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')
const morgan = require('morgan')
const flash = require('connect-flash')
const { resolve } = require('path')
const { Cookie } = require('express-session')
const { Mongoose } = require('mongoose')

//Load Config
dotenv.config({ path: './config/config.env'})

//Passport config
require('./config/passport')(passport)

connectDB()

const app = express()


//Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//flash configure

  
    app.use(flash());

//method override
app.use(
    methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))

//Logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//handlebar helpers
const { formatDate, stripTags, truncate, editIcon, select, checklength, validImage,TimeStatus } = require('./helpers/hbs')



//Handlebars
app.engine(
    '.hbs', 
    exphbs({
        helpers: {
            formatDate,
            stripTags,
            truncate,
            editIcon,
            select,
            checklength,
            validImage,
            TimeStatus,
        },
        defaultLayout: 'main', 
        extname: '.hbs'
    })
);
app.set('view engine', '.hbs');

//Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
    }

))


//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set global var
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})

//Static folder
app.use(express.static(path.join(__dirname, 'public')))


//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/feed', require('./routes/feed'))



const PORT = process.env.PORT || 3000


app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} node on port ${PORT}`)
    )