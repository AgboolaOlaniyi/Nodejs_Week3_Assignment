
const http = require('http');
const fs = require('fs');
const path = require('path');


const itemsPath = path.join(__dirname, 'items.json');
const port = 3001


function requestHandler(req, res) {
    if (req.url === '/items' && req.method === "POST") {
        postitem(req, res);
    }

    if (req.url === '/items' && req.method === "GET") {
        getAllitems(req, res);
    }

    if (req.url.startsWith('/items') && req.method === "GET") {
        getOneitem(req, res);
    }

    if (req.url.startsWith('/items') && req.method === "PATCH") {
        updateitem(req, res);
    }

    if (req.url.startsWith('/items') && req.method === "DELETE") {
        deleteitem(req, res);
    }
}


const server = http.createServer(requestHandler);

server.listen(port, () => {
    console.log('Listening on port: ${port}');
})

function postitem(req, res) {
    const preRead = fs.readFileSync(itemsPath)
    const itemsArrayOfObj = JSON.parse(preRead)
   

    const body = [];

    req.on("data", (chunk) => {
        body.push(chunk)
    });

    req.on("end", () => {
        const parsedbody = Buffer.concat(body).toString();
        const itemToPost = JSON.parse(parsedbody)

        itemsArrayOfObj.push({
            ...itemToPost,
            id: Math.floor(Math.random() * 500).toString()
        })

        fs.writeFile(itemsPath, JSON.stringify(itemsArrayOfObj), (err) => {
            if (err) {
                serverError()
            }
            res.end(JSON.stringify(itemToPost));

        })

    });
}
function getAllitems(req, res) {
    fs.readFile(itemsPath, "utf8", (err, data) => {
        if (err) {
            serverError()
        }
        res.end(data);
    });
}

function getOneitem(req, res) {
    const id = req.url.split("/")[2];
    const items = fs.readFileSync(itemsPath);
    const itemsArrayOfObj = JSON.parse(items);

    const itemIndex = itemsArrayOfObj.findIndex((item) => {
        return item.id === id;
    })
    if (itemIndex === -1) {
        clientError()
    }
    res.end(JSON.stringify(itemsArrayOfObj[itemIndex]));
}

function updateitem(req, res) {
    const id = req.url.split("/")[2];
    const items = fs.readFileSync(itemsPath);
    const itemsArrayOfObj = JSON.parse(items);

    const body = [];

    req.on("data", (chunk) => {
        body.push(chunk)
    });

    req.on("end", () => {
        const parsedbody = Buffer.concat(body).toString();
        const update = JSON.parse(parsedbody)

        const itemIndex = itemsArrayOfObj.findIndex((item) => {
            return item.id === id
        });

        if (itemIndex == - 1) {
            res.end('Item not found');
        }

        itemsArrayOfObj[itemIndex] = { ...itemsArrayOfObj[itemIndex], ...update };

        fs.writeFile(itemsPath, JSON.stringify(itemsArrayOfObj), (err) => {
            if (err) {
                serverError()
            }
            res.end(JSON.stringify(itemsArrayOfObj[itemIndex]));
        });

    });
}

function deleteitem(req, res) {
    const id = req.url.split("/")[2];
    const items = fs.readFileSync(itemsPath);
    const itemsArrayOfObj = JSON.parse(items);

    const itemIndex = itemsArrayOfObj.findIndex((item) => {
        return item.id === id;
    })
    if (itemIndex === -1) {
        res.end('Item not found')
    }
    itemsArrayOfObj.splice(itemIndex, 1);

    fs.writeFile(itemsPath, JSON.stringify(itemsArrayOfObj), (err) => {
        if (err) {
            serverError()
        }
        res.end('item delete successfully');
    })
}

function serverError(){
    res.writeHead(500);
}