const express = require('express');
const { createClient } = require('redis');
const dotenv = require('dotenv');
const { Worker } = require('worker_threads');

dotenv.config();

const client = createClient({
    url : `redis://${process.env.REDIS_SERVER_IP}:${process.env.REDIS_SERVER_PORT}`,
    password: process.env.REDIS_SERVER_PWD,
    legacyMode:true,
});

client.connect()
.catch(err => {
    console.log(err);
})

client.on("error", function (err) {
    console.log("Error " + err);
});
 
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(function(req,res,next){
    req.cache = client;
    next();
})

// addJobQueue
app.post('/', (req,res) => {
    const jobData = JSON.stringify(req.body);
    req.cache.lpush('job_queue', jobData, (err, reply) => {
        if (err) {
          console.error('Error adding job to queue:', err);
        } else {
          console.log('Job added to queue:', reply);
          res.end("Job Queue Added");
        }
      });
})

function startWorker() {
    const worker = new Worker('./jobworker.js');
  
    worker.on('error', (err) => {
      console.error('Worker error:', err);
    });
  
    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error('Worker stopped with exit code', code);
        // You may want to handle worker restart or cleanup operations here
      }
    });
  }


app.listen(process.env.WEBSERVER_PORT, () => {
    console.log(process.env.WEBSERVER_PORT, "is Listening!!")
    startWorker();
})