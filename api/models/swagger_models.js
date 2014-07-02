//add Genre here and fill it up

module.exports = {
  "Envelope":{
    "id":"Envelope",
    "properties":{
      "response":[
        "Person",
        "Movie",
        "List[Person]",
        "List[Movie]",
      ],
      "responseTime":"integer",
      "name":{
        "type":"string"
      }
    }
  },
  "Count":{
    "id":"Count",
    "properties": {
      "count":{
        "type":"integer"
      }
    }
  },
  "Movie":{
    "id":"Movie",
    "properties":{
      "id":{
        "type":"integer"
      },
      "title":{
        "type":"string"
      },
      "released":{
        "type":"integer"
      },
      "tagline":{
        "type":"string"
      }
    }
  },
  "Person":{
    "id":"Person",
    // "required": ["id"],
    "properties":{
      "id":{
        "type":"int"  //changing to int
      },
      "name":{
        "type":"string"
      }
    }
  }
};