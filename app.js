const express = require("express");
const stripe = require("stripe")("sk_test_D5Vvnc82q3Vl1i6P21VEl28700xVwQRNUD");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const app = express();
//hnadlebars middle ware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//set static folder
app.use(express.static(`${__dirname}/public`));

// index router
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/sucess", (req, res) => {
  res.render("sucess");
});

app.post("/charge", (req, res) => {
  const amount = 900;
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    })
    .then(customer => {
      stripe.charges
        .create({
          amount,
          description: "Tokyo Ghoul Comic",
          currency: "usd",
          customer: customer.id
        })
        .then(charge => res.render("sucess"));
    })
    .catch(err => {});
});
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
