const express = require("express");

const bodyParser = require("body-parser");

const app = express();

const mongoose = require("mongoose");

mongoose.set('useFindAndModify', false);

mongoose.connect('mongodb://localhost:27017/todolist', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

const itemsSchema = new mongoose.Schema({
    title: String,
    flag: Boolean
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    title: "Welcome to your todolist!",
    flag: false
});

const item2 = new Item({
    title: "Tasks to be completed shows here",
    flag: false
});

const item3 = new Item({
    title: "Completed Tasks shows here",
    flag: true
});

const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {

    Item.find({}, (err, item) => {
        if (item.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully Inserted Default Items");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {
                items: item
            });
        }
    });

});

app.post("/insert", (req, res) => {

    const newItem = new Item({
        title: req.body.newItem,
        flag: false
    });

    newItem.save((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully Inserted New Item");
            res.redirect("/");
        }
    });
});

app.post("/done", (req, res) => {
    Item.findByIdAndUpdate(req.body.checkbox, {
        flag: true
    }, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully Updated The Item");
            res.redirect("/");
        }
    });
});

app.post("/delete", (req, res) => {
    Item.findByIdAndDelete(req.body.checkbox, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully Deleted Item");
            res.redirect("/");
        }
    });
});

app.post("/update", (req, res) => {
    Item.findByIdAndUpdate(req.body.itemID, {
        title: req.body.updateText
    }, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Updated Existing List Title");
            res.redirect("/");
        }
    });
});

app.listen(8080, () => {
    console.log("Server Started at Port 8080");
});