# redis_jobqueue
- Nodejs + Express + Redis를 활용한 Jobqueue 예제 입니다.
- Cluster, Worker Thread를 통해 Job 분산 처리 가능
## Getting Started
#### 개발환경
- nodejs 설치

#### 관련 모듈 설치
```
npm install
```

#### .env 파일 생성
```
WEBSERVER_PORT=8000 // 서버 포트
REDIS_SERVER_IP=localhost // Redis 주소입력
REDIS_SERVER_PORT=16430 // Redis 포트 입력
REDIS_SERVER_PWD=pwd // Redis Password 입력
```

#### nodemon으로 서버 수정시 자동으로 Reload 실행
```
npm run devStart
```

#### Postman을 통하여 서버에 Job 등록
ex) action : add,del,mul,div 명령 전송
![image](https://github.com/rhkdguskim/redis_jobqueue/assets/111857144/7f592c04-5461-40d2-a685-819a18e01ffa)

#### worker_threads를 통하여 분리된 스레드를 생성후 Job 실행
``` javascript
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
```

![image](https://github.com/rhkdguskim/redis_jobqueue/assets/111857144/7882511b-c6a3-48ec-83e6-12e16ab0adb6)

