module.exports = {
  "up": [
    {
      "name": "addColumn",
      "args": [
        "User",
        {
          "name": "email",
          "type": null,
          "unique": false,
          "nullable": true,
          "default": null
        }
      ],
      "reversible": true
    }
  ],
  "down": [
    {
      "name": "removeColumn",
      "args": [
        "User",
        "email"
      ],
      "reversible": true
    }
  ]
};
