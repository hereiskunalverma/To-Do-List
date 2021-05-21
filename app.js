// R E X

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://<user name on mongodb>:<password>@cluster0.nkbyw.mongodb.net/todolistDB",{useNewUrlParser: true})

const itemsSchema = {
  name: String,
};

// mongoose mondel
const Item = mongoose.model("Item",itemsSchema);

// default items in todo list
const item1 = new Item({
  name: "Welcome to your ToDo List"
});
const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item ({
  name: "Hit ☑  to delete an item."
})

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};
const List = mongoose.model("List",listSchema);


app.get("/", function(req, res) {
  Item.find({},function(err, foundItems){
    if (foundItems.length==0){
      // insertion default items in mongoose (items ) collections
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("Successfully saved default items.")
        }
      });
      res.redirect("/");
    }
    else{
    res.render("list", {listTitle: "Today", newListItems: foundItems});
  }
  });


});

// adding route
app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });
  if(listName=="Today"){
    item.save();
    res.redirect("/");
  }
  else{
    List.findOne({name: listName},function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    })
  }
});

// creating dynamic list using dynamic route
app.get("/:customListName",function(req,res){
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name: customListName},function(err,foundList){
    if(!err){
      if(!foundList){
      // Create a new list
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      list.save();
      res.redirect("/"+customListName);
      }
      else{
        // Show an existing list
        res.render("list",{listTitle: foundList.name, newListItems: foundList.items})
      }
    }
  })


})


// deleting item route
app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName=="Today"){
    Item.findByIdAndRemove(checkedItemId,function(err){
      if(!err){
        console.log("Successfully deleted");
        res.redirect("/");
      }
    })
  }else{
    List.findOneAndUpdate({name: listName},{$pull: {items: {_id: checkedItemId}}}, function(err,foundList){
      if(!err){
        res.redirect("/"+listName);
      }
    });
  }

})

app.get("/about", function(req, res){
  res.render("about");
});



// dynamic port for heroku as well as local
let port = process.env.PORT;
if(port==null || port==""){
  port=3000;
}
app.listen(port, function() {
  console.log("Server has started Successfully");
});
