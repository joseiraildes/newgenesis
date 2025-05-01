const { app } = require("./config/config.js");
const server = require("./socket/config.js");

require("./routes.js");

server.listen(3000, (err) => {
    if (err) console.log(err);
    console.log("Server is running on port 3000");
});
