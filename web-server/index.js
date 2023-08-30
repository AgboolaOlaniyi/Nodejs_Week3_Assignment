const http = require('http');
const fs = require('fs');
const path = require('path')




const IndexPath = path.join(__dirname, "index.html")
const errorPath = path.join(__dirname, "error.html")


const PORT = 3001


function requestHandler(req, res){
  if (req.url === '/') {
      getIndex(req, res);

   }

   if (req.url.endsWith(".html") && req.method === "GET"){
      try{
         getRequestIndex(req, res);
      } catch (error){
         getErrorIndex(req, res);
      }
   }
   
}
const server = http.createServer(requestHandler);
server.listen(PORT, () => {
   console.log(`Server has started runing at http://localhost:${PORT}`);
})
 
function getIndex (req, res){
   res.setHeader("content-type", "text/html");
   res.writeHead(200);
   res.end(fs.readFileSync(IndexPath));
}

function getRequestIndex (req, res){
const file = req.url.split("/")[1];
const actualPath = path.join(__dirname, file);
const read = fs.readFileSync(actualPath);
res.setHeader("content-type", "text/html");
res.writeHead(200);
res.end(read)
}

function getErrorIndex(req, res){
   res.setHeader("content-type", "text/html")
   res.writeHead(404);
   res.end(fs.readFileSync(errorPath))
}


