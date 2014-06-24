node-neo4j-swagger-api
=====================

This is an open source node neo4j api server based on node-neo4j-template and swagger-node-express

The idea is to make it as easy as possible to create an api using node and neo4j that can be consumed by some other app. Swagger provides interactive documentation so that it is easy to interact with the API. The goal is merge swagger and neo4j gist together (vizualizations!) so developers can see how neo4j and the api calls relate to each other.


Try it out at http://neo4j-swagger.tinj.com/docs


node-neo4j-template
https://github.com/aseemk/node-neo4j-template/


Swagger-Node-Express
https://github.com/wordnik/swagger-node-express

Swagger
https://developers.helloreverb.com/swagger/

graphgist
https://github.com/neo4j-contrib/graphgist/


Built focusing on using Cypher and Neo4j 2.0RC1

![Neo4j-Swagger Diagram](/views/img/neo4j-swagger.jpg "Neo4j-Swagger Diagram")


Start
clone
npm install
have a neo4j server up at localhost:7474 or NEO4J_URL specified in .env
node app.js
http://localhost:3000/docs


TODO

I'm using Trello for my todo list, feel free to comment!

https://trello.com/b/kelJzC12/neo4j-swagger

1. Move neo4j queries and results to swagger client
2. Add graph visualization to swagger
3. improve swagger model format
4. pull out neo4j-swagger client, cypher helpers, and mixins into separate modules
5. finish implementing basic queries for users
6. add second node type (pets?)
7. add queries relating users and pets
8. TESTS!!!
9. ...


More details about goals
So basically, swagger creates interactive api docs, which is great but i also want to see what's going on with neo4j at the same time

the idea is to pass raw query/results optionally in api responses which could be visualized on the swagger client along side the api results

end result being i can see what neo4j and my api are doing side by side in the web client so i can stop debugging in the console




MIT License