const Joi = require("joi");
const express = require("express");
const app = express();
app.use(express.json());

const courses = [
  { id: 1, name: "Humanities" },
  { id: 2, name: "Finance" },
  { id: 3, name: "Management" },
  { id: 4, name: "Law" },
];
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.get("/api/courses", (req, res) => {
  res.send(courses);
});
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send("Course with the given ID not found");
  }
  res.send(course);
});
app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  /* manual validation
  if (!req.body.name || req.body.name < 3) {
    res
      .status(400)
      .send("Name is required and should be more than 3 character");
    return;
  }*/
  //  validation using Joi
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});
// Update a course
app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send("Course with the given ID not found");
  }

  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  course.name = req.body.name;
  res.send(course);
});
// Deletee a course
app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).send("Course with the given ID not found");
  }
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});
// Validate
function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(course);
}
// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}...`));
