const http = require('http');

const dogs = [
  {
    dogId: 1,
    name: "Fluffy",
    age: 2
  }
];

let nextDogId = 2;

function getNewDogId() {
  const newDogId = nextDogId;
  nextDogId++;
  return newDogId;
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // assemble the request body
  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  req.on("end", () => { // request is finished assembly the entire request body
    // Parsing the body of the request depending on the Content-Type header
    if (reqBody) {
      switch (req.headers['content-type']) {
        case "application/json":
          req.body = JSON.parse(reqBody);
          break;
        case "application/x-www-form-urlencoded":
          req.body = reqBody
            .split("&")
            .map((keyValuePair) => keyValuePair.split("="))
            .map(([key, value]) => [key, value.replace(/\+/g, " ")])
            .map(([key, value]) => [key, decodeURIComponent(value)])
            .reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {});
          break;
        default:
          break;
      }
      console.log(req.body);
    }

    /* ======================== ROUTE HANDLERS ======================== */

    // GET /dogs
    if (req.method === 'GET' && req.url === '/dogs') {
      // Your code here
      res.statusCode = 200;
      res.setHeader('content-type','application/json');
      res.write(JSON.stringify(dogs));
      return res.end();
    }

    // GET /dogs/:dogId
    if (req.method === 'GET' && req.url.startsWith('/dogs/')) {
      const urlParts = req.url.split('/'); // ['', 'dogs', '1']
      if (urlParts.length === 3) {
        const TdogId = urlParts[2];
        // Your code here
        res.statusCode = 200;
        res.setHeader('content-type','application/json');
        function dogFinder(Tdog){
          if(Tdog.dogId == TdogId){
            return Tdog;
          }
        }
        const answer = dogs.find(dogFinder);
        res.write(JSON.stringify(answer));
        return res.end();
      }
    }

    // POST /dogs
    if (req.method === 'POST' && req.url === '/dogs') {
      const { name, age } = req.body;
      // Your code here
      if(!name || !age){
        res.statusCode = 400;
        res.setHeader('content-type','application\json');
        res.write(JSON.stringify("Name and age both required"));
        return res.end();
      }
      const dog = {dogId : getNewDogId(), name, age};
      dogs.push(dog);
      res.statusCode = 201;
      res.setHeader('content-type', 'application/json');
      res.write(JSON.stringify(dog));
      return res.end();
    }

    // PUT or PATCH /dogs/:dogId
    if ((req.method === 'PUT' || req.method === 'PATCH')  && req.url.startsWith('/dogs/')) {
      const urlParts = req.url.split('/');
      if (urlParts.length === 3) {
        const dogId = urlParts[2];
        const {name, age} = req.body;
        // Your code here
        res.statusCode = 200;
        res.setHeader("content-type","application/json");
        function dogFinderPost(TdogId){
          if(TdogId.dogId == dogId){
            return TdogId;
          }
        }
        let answer = dogs.find(dogFinderPost);
        if(answer){
          let dogIndex = dogs.indexOf(answer);
          dogs[dogIndex].name = name;
          dogs[dogIndex].age = age;
        }
        res.write(JSON.stringify("Successfully Updated"));
        return res.end();
      }
    }

    // DELETE /dogs/:dogId
    if (req.method === 'DELETE' && req.url.startsWith('/dogs/')) {
      const urlParts = req.url.split('/');
      if (urlParts.length === 3) {
        const dogId = urlParts[2];
        // Your code here
        res.statusCode = 201;
        res.setHeader = ("content-type","application/json");
        function dogFinderDelete(TdogId){
          if(TdogId == dogId){
            return dogId;
          }
        }
        let theDog = dogs.find(dogFinderDelete);
        let dogIndex = dogs.indexOf(theDog);
        dogs.splice(dogIndex,1);
        res.write(JSON.stringify("Successfully Deleted"));
        return res.end();
      }
    }

    // No matching endpoint
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    return res.end('Endpoint not found');
  });

});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));