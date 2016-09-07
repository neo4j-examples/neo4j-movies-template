module.exports = {
  "Envelope": {
    "id": "Envelope",
    "properties": {
      "response": [
        "Person",
        "Movie",
        "Genre",
        "List[Person]",
        "List[Movie]",
        "List[Genre]",
      ],
      "responseTime": "integer",
      "name": {
        "type": "string"
      }
    }
  },
  "Count": {
    "id": "Count",
    "properties": {
      "count": {
        "type": "integer"
      }
    }
  },
  "Movie": {
    "id": "Movie",
    "properties": {
      "id": {
        "type": "integer"
      },
      "released": {
        "type": "integer"
      },
      "summary": {
        "type": "string"
      },
      "duration": {
        "type": "integer"
      },
      "poster_image": {
        "type": "string"
      },
      "title": {
        "type": "string"
      },
      "tagline": {
        "type": "string"
      },
      "genres": {
        "type": "array"
      },
    }
  },
  "Genre": {
    "id": "Genre",
    "properties": {
      "id": {
        "type": "integer"
      },
      "name": {
        "type": "string"
      }
    }
  },
  "Person": {
    "id": "Person",
    "properties": {
      "id": {
        "type": "integer"
      },
      "name": {
        "type": "string"
      },
      "born": {
        "type": "integer"
      },
      "poster_image": {
        "type": "string"
      }
    }
  },
  "UserResponse": {
    "id": "UserResponse",
    "properties": {
      "id": {
        "type": "string"
      },
      "username": {
        "type": "string"
      },
      "avatar": {
        "type": "object"
      }
    }
  },
  "UserRegister": {
    "id": "UserRegister",
    "properties": {
      "username": {
        "type": "string"
      },
      "password": {
        "type": "string"
      }
    }
  },
  "LoginRequest": {
    "id": "LoginRequest",
    "properties": {
      "username": {
        "type": "string"
      },
      "password": {
        "type": "string"
      }
    }
  },
  "LoginResponse": {
    "id": "LoginResponse",
    "properties": {
      "token": {
        "type": "string"
      }
    }
  },
  "MovieRating": {
    "id": "MovieRating",
    "properties": {
      "rating": {
        "type": "integer"
      }
    }
  }
};