const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');


const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const getRepositoryIndexById = (id) => repositories.findIndex(repo => repo.id === id)


app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const newRepository = {
    title,
    url,
    techs,
    id: uuid(),
    likes: 0
  }
  // append on repositiores
  repositories.push(newRepository)
  return response.status(201).json(newRepository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body
  const repositoryIndex = getRepositoryIndexById(id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found."})
  }

  const repositoryPatch = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs
  }
  repositories[repositoryIndex] = repositoryPatch

  return response.json(repositoryPatch)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  const repositoryIndex = getRepositoryIndexById(id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found."})
  }

  repositories.splice(repositoryIndex, 1)
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  const repositoryIndex = getRepositoryIndexById(id)
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found."})
  }

  const repositoryWithNewLike = {
    ...repositories[repositoryIndex],
    likes: repositories[repositoryIndex].likes + 1
  }
  repositories[repositoryIndex] = repositoryWithNewLike
  return response.status(201).json(repositoryWithNewLike)
});

module.exports = app;
