import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
var id = 0;

let articles = [];

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { articles: articles });
});

app.get("/compose", (req, res) => {
  res.render("compose.ejs");
});

app.post("/", (req, res) => {
  id = id + 1;
  function articleConstructor(id, title, createdAt, description) {
    const output = {
      id: id,
      title: title,
      createdAt: createdAt,
      description: description,
    };
    return output;
  }

  articles.push(
    articleConstructor(
      id,
      req.body["title"],
      new Date(),
      req.body["description"]
    )
  );

  res.redirect("/");
});

app.get("/delete/:postId", (req, res) => {
  // getting the postId from the clicked button, paseInt convert it to int
  const postId = parseInt(req.params.postId);

  const postToDelete = articles.find((article) => article.id === postId);

  // make sure there is a post to be deleted, meaning postToDelete exists
  if (postToDelete) {
    articles = articles.filter((article) => article.id !== postId);
    res.render("index.ejs", { articles: articles }); //\
  } else {
    res.status(404).send("Post not found");
  }
});

app.get("/edit/:postId", (req, res) => {
  const postId = parseInt(req.params.postId);

  const postToEdit = articles.find((article) => article.id === postId);

  if (postToEdit) {
    res.render("edit.ejs", { post: postToEdit });
  }
});

app.post("/edit/:postId", (req, res) => {
  const postId = parseInt(req.params.postId);

  const postIndex = articles.findIndex((article) => article.id === postId);

  if (postIndex !== -1) {
    articles[postIndex].title = req.body.title;
    articles[postIndex].description = req.body.description;

    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
