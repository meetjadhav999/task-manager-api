const express = require('express')
require('./db/mongoose.js')
const User = require('./models/user.js')
const Task = require('./models/task.js')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')
const auth = require('./middleware/auth.js')
const app = express()

const port = process.env.PORT || 3000

app.use(express.json())

app.use(userRouter)

app.use(taskRouter)

const multer = require('multer')
const upload = multer({
    dest:'images',
    limits:{
        fileSize:1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('file must be a pdf'))
        }
        cb(undefined,true)
    }
})

app.post('/upload',upload.single('upload'),(req,res)=>{
    res.send()
})

app.listen(port,()=>{
    console.log('Server is running on port',port)
})