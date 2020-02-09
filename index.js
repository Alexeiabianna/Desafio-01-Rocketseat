const express = require('express');

const server = express();

server.use(express.json());



server.use((req, res, next) => {
    console.time('Request');
    console.log(`Método: ${req.method}; URL: ${req.url}`);

    next();

    console.timeEnd('Request');
});

const projects = [];

//Middleware Local -- checkProjectExists -- 

function checkProjectExists(req, res, next) {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);

    if (!project) {
        return res.status(400).json({ error: 'Project not found'});
    }

    return next();
}

// Middleware Local -- log número de requisições --

function logRequests(req, res, next) {

    console.count("Número de requisições");

    return next();
}

server.use(logRequests)

//Route params = /projects/1
// localhost:3000/projects/1


server.get('/projects', (req, res) => {
    return res.json(projects);
});


//Request body para adicionar um Projeto na lista.


server.post('/projects', (req, res) => {
    const { id, title } = req.body;

    const project = {
        id,
        title,
        tasks: []
    };

    projects.push(project);

    return res.json(project);
});

//Editando o nome da lista de acordo com seu id 

server.put('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

// Procurar saber sobre estes parâmetros abaixo
    const project = projects.find(p => p.id == id);

    project.title = title;

    return res.json(project);
});

//Deletando um usuário a partir do seu index.

server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;

    const projectIndex = projects.findIndex(p => p.id == id);

    projects.splice(projectIndex, 1);

    return res.send();
});

// Adicionando uma tarefa ao projeto.

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
  
    const project = projects.find(p => p.id == id);
  
    project.tasks.push(title);
  
    return res.json(project);
  });

server.listen(3000);

