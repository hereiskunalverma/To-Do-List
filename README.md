# To-Do-List


This is a simple to do list using Node.js and Mongodb 


- You can create new list by appending the **name of new list at last of url**


- Interface - 

![todolist](image.png)


- **Note** 

1. Make sure to install the dependencies by running the following command in terminal : 

```
npm install
```

2. In **app.js** at line 14, setup your **MongoDB Atlas** user password and name. Following is the code to edit in app.js :

```
mongoose.connect("mongodb+srv://<user name on mongodb>:<password>@cluster0.nkbyw.mongodb.net/todolistDB",{useNewUrlParser: true})
```

3. Voila 🥳


