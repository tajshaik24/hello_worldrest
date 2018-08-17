/*
* Main file for the Hello World RESTful API
* @author: Taj Shaik
*/

var http = require('http');
var url = require('url');
var string_decoder = require('string_decoder').StringDecoder;

var httpServer = http.createServer(function(req, res){
    //Produces parsed URL
    var parsedURL = url.parse(req.url, true);
    
    //Getting the path name from the Request
    var pathName = parsedURL.pathname;

    //Trimming the Slashes at the End
    var trimmedPath = pathName.replace(/^\/+|\/+$/g, '');

    //Get the Query String as an object 
    var queryStringObject = parsedURL.query;
    
    //Get the HTTP Method
    var httpmethod = req.method.toLowerCase();

    //Get the headers from the object
    var header = req.headers;

    //Gets the payload, if any present
    var decoder = new string_decoder('utf-8');
    var payload = '';

    //When we have data from the payload, add to the payload string
    req.on('data', function(data){
        payload += decoder.write(data); //Must decode the data
    });
    
    req.on('end', function(){
        payload += decoder.end();

        var chosenHandler = typeof(router[trimmedPath]) == 'function' ? router[trimmedPath] : handlers.notfound;

        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject, 
            'method' : httpmethod,
            'headers' : header,
            'payload' : payload
        };

        //Route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload){
            //Use status code called back by handler, or the default one
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            //Use payload called back by handler, or the default one
            payload = typeof(payload) == 'object' ? payload : {};

            //Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            //Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);

            //Writing the payload String
            res.end(payloadString);

            //Log the request path
            console.log(`Returning this response: ${statusCode}`,payloadString);
        });
    });
});

httpServer.listen(3000, function(req, res){
    console.log('Listening on port 3000.')
});

//Define handlers
var handlers = {};

//Sample handler
handlers.hello = function(data, callback) {
    //Callback a HTTP Status Code
    //Callback a payload (object)
    callback(200, {'hello' : 'Hello World'}); //Status Code, JSON Object
};

//Not Found Handler
handlers.notfound = function(data, callback) {
    callback(404);
};

//Define a request router
var router = {
    'hello' : handlers.hello
}