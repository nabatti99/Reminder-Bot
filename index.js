// require("dotenv").config();
const jsonServer = require("json-server");
const App = jsonServer.create();
const middlewares = jsonServer.defaults();

const Login = require("./controllers/login.controller");
const Register = require("./controllers/register.controller");
const Create = require("./controllers/create.controller");
const Remind = require("./controllers/remind.controller");
const Delete = require("./controllers/delete.controller");
const WeatherForecasts = require("./controllers/weatherForecasts.controller");

require("./database.config");

App.use(middlewares);
App.use(Login.auth);

App.get("/login", Login.login);
App.get("/register", Register);
App.get("/create", Create);
App.get("/remind", Remind);
App.get("/delete/show", Delete.show);
App.get("/delete/exec", Delete.exec);
App.get("/delete/all", Delete.all);

App.get("/weatherForecasts", WeatherForecasts.get);
App.get("/weatherForecasts/detail", WeatherForecasts.getDetail);

const PORT = process.env.PORT;

App.listen(PORT, function () {
  console.log("Server is running on port " + PORT);
});
