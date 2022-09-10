const db = require("./db/connection");
const express = require("express");
const inquirerStart = require("./lib/departments");
const PORT = process.env.PORT || 3001;
const app = express();

//express schtuff
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//default response
app.use((req, res) => {
    res.status(404).end();
});

//if db connected then start server
db.connect(err => {
    if(err) throw err;
    console.log('database is connected.');
    app.listen(PORT, () => {
        console.log(`server active on PORT ${PORT}`);
        inquirerStart();
    });
});
