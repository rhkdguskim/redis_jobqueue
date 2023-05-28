const { parentPort } = require('worker_threads');
const { createClient } = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const client = createClient({
  url: `redis://${process.env.REDIS_SERVER_IP}:${process.env.REDIS_SERVER_PORT}`,
  password: process.env.REDIS_SERVER_PWD,
  legacyMode: true,
});

client.connect().catch((err) => {
  console.log(err);
});

client.on('error', function (err) {
  console.log('Error ' + err);
});

function processJob() { // 0 : 무기한 대기한다.
  client.brpop('job_queue', 0, (err, reply) => {
    if (err) {
      console.error('Error processing job:', err);
    } else {
      if (reply) {
        const [listName, jobData] = reply;
        const job = JSON.parse(jobData);

        switch(job.action) // Perform the job processing logic here
        {
            case "add":
                console.log("add cmd Called", " Params : ", job.params)
                break;
            case "del":
                console.log("del cmd Called", " Params : ", job.params)
                break;
            case "mul":
                console.log("mul cmd Called", " Params : ", job.params)
                break;
            case "div":
                console.log("div cmd Called", " Params : ", job.params)
                break;
            default:
                console.log("Function is not Defined!!", " Params : ", job.params)
                break;
        }
        
        processJob();
      } else {
        console.log('Timeout occurred, no element in the list');

        // After a timeout, call processJob() recursively to continue listening for new jobs
        processJob();
      }
    }
  });
}

processJob();