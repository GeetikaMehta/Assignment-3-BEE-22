const express = require("express");
const app = express();
const path = require("path");
const PORT = 8080;
const session = require("express-session");

// Middleware for session management
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));

// Setting EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User data
let userData = [
    { user: "geetika", age: 20, hobby: "drawing" },
    { user: "priya", age: 19, hobby: "dancing" },
    { user: "tanya", age: 21, hobby: "singing" }
];

// User authentication data
let users = {
    user1: "password1",
    user2: "password2",
};

let loggedInUser = null;

const checkLoginStatus = (req, res, next) => {
    loggedInUser = req.session.username || null;
    next();
};

app.get("/profile/:username", (req, res) => {
    const { username } = req.params;
    const user = userData.find(u => u.user.toLowerCase() === username.toLowerCase());

    if (user) {
        res.render('profile', { user: user });
    } else {
        res.status(404).send("User not found");
    }
});

// Home route - Landing Page
app.get("/", checkLoginStatus, (req, res) => {
    let greeting = getGreeting();
    res.render("index", { name: "Geetika", destination: "Chandigarh", greeting, loggedInUser });
});


const products = [
    { name: "Laptop", price: 800 },
    { name: "Smartphone", price: 500 },
    { name: "Headphones", price: 100 },
    { name: "Keyboard", price: 50 },
    { name: "Monitor", price: 300 }
];

app.get("/products", (req, res) => {
    let filteredProducts = products;
    if (req.query.search) {
        const searchQuery = req.query.search.toLowerCase();
        filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchQuery)
        );
    }
    res.render("products", { products: filteredProducts, search: req.query.search });
});

// Main Todo Page
let tasks = ["Complete assignment", "Buy groceries"];
app.get("/todo", (req, res) => {
    let greeting = getGreeting();
    res.render("welcome", { name: "Geetika", destination: "Chandigarh", greeting, tasks });
});

app.post("/add-task", (req, res) => {
    const newTask = req.body.task;
    if (newTask) {
        tasks.push(newTask);
    }
    res.redirect("/todo");
});

app.post("/edit-task/:id", (req, res) => {
    const taskId = req.params.id;
    const updatedTask = req.body.updatedTask;
    if (updatedTask && tasks[taskId]) {
        tasks[taskId] = updatedTask;
    }
    res.redirect("/todo");
});

app.post("/delete-task/:id", (req, res) => {
    const taskId = req.params.id;
    tasks.splice(taskId, 1);
    res.redirect("/todo");
});

// Search route
let searchItems = [
    { name: "Item 1" },
    { name: "Item 2" },
    { name: "Searchable Item" },
    { name: "Item 3" }
];

app.get('/search', (req, res) => {
    let filteredItems = searchItems;
    const searchQuery = req.query.item;

    if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        filteredItems = searchItems.filter(item =>
            item.name.toLowerCase().includes(lowerCaseQuery)
        );
    }

    res.render('search', { searchbar: filteredItems, search: searchQuery || '' });
});

// Blog application
const posts = [
    { title: "Sports", content: "I went to a swimming club" },
    { title: "Club", content: "I recently joined a gaming club" },
    { title: "Restaurant", content: "I went to a restaurant, and it was amazing!!!" }
];

app.get("/posts", (req, res) => {
    res.render("post", { posts });
});

app.post("/add-post", (req, res) => {
    const { title, content } = req.body;
    posts.push({ title, content });
    res.redirect("/posts");
});

// User login
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        req.session.username = username;
        res.redirect('/');
    } else {
        res.send('Invalid username or password');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        loggedInUser = null;
        res.redirect('/');
    });
});

// Utility function to get greeting message
function getGreeting() {
    let currentHour = new Date().getHours();
    if (currentHour < 12) {
        return "Good Morning";
    } else if (currentHour < 18) {
        return "Good Afternoon";
    } else {
        return "Good Evening";
    }
}

// Start the server
app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log(`Listening to Port ${PORT}`);
});
























// const express = require("express");
// const app = express();
// const path = require("path");
// const PORT = 8000;
// const session = require("express-session");
// app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));


// app.set('view engine', 'ejs');
// app.set('views', './views');

// filepath=path.join(__dirname,'/views/index.ejs')
// filepath1=path.join(__dirname,'/views/profile.ejs')

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// let userData = [
//     {user : "geetika" ,age:20 ,hobby:"drawing"},
//     {user : "priya",age : 19,hobby : "dancing"},
//     {user :"tanya" , age :21,hobby:"singing"}
// ];
// app.get("/profile/:username",(req,res)=>{
//     const {username} = req.params;
//     // console.log(username)
//     const user = userData.find(u => u.user.toLowerCase() === username.toLowerCase());

//     if (user) {
//         res.render('profile', { user: user });
//     } else {
//         res.status(404).send("User not found");
//     }
//     // res.send("Hi")
// });

// let tasks = ["Complete assignment", "Buy groceries"];

// //Home route - Landing Page
// app.get("/", (req, res) => {
//     let name = "Geetika";
//     let place = "Chandigarh";
//     let currentHour = new Date().getHours();
//     let greeting;

//     if (currentHour < 12) {
//         greeting = "Good Morning";
//     } else if (currentHour < 18) {
//         greeting = "Good Afternoon";
//     } else {
//         greeting = "Good Evening";
//     }

//     res.render("index", { name, destination: place, greeting });
// });

// //rendering product list 
// const products = [
//     { name: "Laptop", price: 800 },
//     { name: "Smartphone", price: 500 },
//     { name: "Headphones", price: 100 },
//     { name: "Keyboard", price: 50 },
//     { name: "Monitor", price: 300 }
// ];

// //Products route
// app.get("/products", (req, res) => {
//     let filteredProducts = products;

//     // Search functionality
//     if (req.query.search) {
//         const searchQuery = req.query.search.toLowerCase();
//         filteredProducts = products.filter(product =>
//             product.name.toLowerCase().includes(searchQuery)
//         );
//     }

//     res.render("products", { products: filteredProducts, search: req.query.search });
// });

// //Main Todo Page
// app.get("/todo", (req, res) => {
//     // let name = "Sam";
//     // let place = "Hyderabad";
//     let currentHour = new Date().getHours();
//     let greeting;

//     if (currentHour < 12) {
//         greeting = "Good Morning";
//     } else if (currentHour < 18) {
//         greeting = "Good Afternoon";
//     } else {
//         greeting = "Good Evening";
//     }

//     res.render("welcome", { name, destination: place, greeting, tasks });
// });

// app.post("/add-task", (req, res) => {
//     const newTask = req.body.task;
//     if (newTask) {
//         tasks.push(newTask);
//     }
//     res.redirect("/todo");
// });
// app.post("/edit-task/:id", (req, res) => {
//     const taskId = req.params.id;
//     const updatedTask = req.body.updatedTask;
//     if (updatedTask && tasks[taskId]) {
//         tasks[taskId] = updatedTask;
//     }
//     res.redirect("/todo");
// });
// app.post("/delete-task/:id", (req, res) => {
//     const taskId = req.params.id;
//     tasks.splice(taskId, 1);
//     res.redirect("/todo");
// });

// // search route 
// let search = [
//     { name: "Item 1" },
//     { name: "Item 2" },
//     { name: "Searchable Item" },
//     { name: "Item 3" }
// ];
// app.get('/search', (req, res) => {
//     let searchbar = search;
//     const searchQuery = req.query.item;

//     if (searchQuery) {
//         const lowerCaseQuery = searchQuery.toLowerCase();
//         searchbar = search.filter(item =>
//             item.name.toLowerCase().includes(lowerCaseQuery)
//         );
//     }

//     res.render('search', { searchbar: searchbar, search: searchQuery || '' });
// });


// // build a blog application 

// const posts = [
//     { title: "Sports", content: "I went to a swimming club" },
//     { title: "Club", content: "I recently joined a gaming club" },
//     { title: "Restaurant", content: "I went to a restaurant, and it was amazing!!!" }
// ];

// app.get("/posts", (req, res) => {
//     res.render("post", { posts });
// });
// app.post("/add-post", (req, res) => {
//     const { title, content } = req.body;
//     posts.push({ title, content });
//     res.redirect("/posts");
// });

// // creating a dynamic web page 
// let users = {
//     user1: "password1",
//     user2: "password2"
// };

// let loggedInUser = null;


// const checkLoginStatus = (req, res, next) => {
//     loggedInUser = req.session.username || null;
//     next();
// };


// app.get('/login', (req, res) => {
//     res.render('login');
// });

// // Handle login form submission
// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
//     if (users[username] && users[username] === password) {
//         req.session.username = username;
//         res.redirect('/');
//     } else {
//         res.send('Invalid username or password');
//     }
// });


// app.get('/logout', (req, res) => {
//     req.session.destroy(err => {
//         if (err) {
//             return res.redirect('/');
//         }
//         loggedInUser = null;
//         res.redirect('/');
//     });
// });

// app.get('/', checkLoginStatus, (req, res) => {
//     res.render('index', { loggedInUser });
// });



// app.listen(PORT, (err) => {
//     if (err) console.log(err);
//     else console.log(`Listening to Port ${PORT}`);
// });