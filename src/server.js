import  dotenv from 'dotenv'
import  conectDB from './db/index.js'
import app from './app.js'

// dotenv.config({path: "../env"})
dotenv.config()

conectDB()
.then(()=>{
    const  PORT = process.env.PORT || 5000;
    app.listen(PORT ,()=>{
        console.log(`Server is running on port  ${PORT}`)
    })

})
.catch((error)=>{
    console.error('Database connection failed:', error);
    process.exit(1); // Exit the process with failure
})