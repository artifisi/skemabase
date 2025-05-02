module.exports = {
  "up": [
    {
      "name": "createTable",
      "args": [
        "User",
        [
          {
            "name": "id",
            "type": null,
            "unique": false,
            "nullable": true,
            "default": null
          },
          {
            "name": "name",
            "type": null,
            "unique": false,
            "nullable": true,
            "default": null
          }
        ]
      ],
      "reversible": true
    },
    {
      "name": "createTable",
      "args": [
        "Post",
        [
          {
            "name": "id",
            "type": null,
            "unique": false,
            "nullable": true,
            "default": null
          },
          {
            "name": "title",
            "type": null,
            "unique": false,
            "nullable": true,
            "default": null
          }
        ]
      ],
      "reversible": true
    }
  ],
  "down": [
    {
      "name": "dropTable",
      "args": [
        "User"
      ],
      "reversible": true
    },
    {
      "name": "dropTable",
      "args": [
        "Post"
      ],
      "reversible": true
    }
  ]
};
