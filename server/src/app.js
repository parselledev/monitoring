import express from "express";

const app = express();

app.route("/api/tracks").get((req, res) => {
  if (req.query.id) {
    if (req.users.hasOwnProperty(req.query.id))
      return res.status(200).send({ data: req.users[req.query.id] });
    else return res.status(404).send({ message: "User not found." });
  } else if (!req.users)
    return res.status(404).send({ message: "Users not found." });

  return res.status(200).send({ data: req.users });
});
