import Express, { NextFunction, Request, Response } from 'express'
import { ValidationError } from 'yup';

import { createCourseSchema, createStudentCourseSchema, createUserSchema, updateUserSchema } from './validation'
import db from './db'

const app = Express()

let auth = 2
let user_id = -1

app.use(Express.json())

if (auth > 1) {

    // Get all users
  app.get('/users', async (req, res) => {
    // Load data from db.json into db.data
    await db.read()

    res.json(db.data.users)
  })

  // GET /users/:id
  // Get user by id from DB
  app.get('/users/:id', async (req, res) => {
    const id = parseInt(req.params.id)

    // Load data from db.json into db.data
    await db.read()
    const user = db.data.users.find(user => user.id === id)

    if (!user) {
      res.sendStatus(404)
      return
    }

    res.json(user)
  })


  const validateSchema = (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, {abortEarly: false});
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        console.log(error.errors);
        res.status(400).json({message: error.errors})
      }
    }
  }

  if (auth = 2) {
    // curl -X POST -d '{"email": "el@gmail.com", "password": "1234", "role": "admin"}' -H "Content-Type: application/json" http://localhost:3000/users
    // POST /users with body { email: string, password: string, role: string }
    // Add a new user in DB
    app.post('/users', validateSchema(createUserSchema), async (req, res) => {
      const person = req.body    
      
      // Load data from db.json into db.data
      await db.read()

      const lastCreatedPerson = db.data.users[db.data.users.length - 1]
      const id = lastCreatedPerson ? lastCreatedPerson.id + 1 : 1

      db.data.users.push({ id, ...person })

      // Save data from db.data to db.json file
      await db.write()

      res.json({ id })
    })


    // curl -X POST -d '{"title": "Maths", "date": "12-09-2023"}' -H "Content-Type: application/json" http://localhost:3000/courses
    // POST /users with body { title: string, date: date}
    // Add a new user in DB
    app.post('/courses', validateSchema(createCourseSchema), async (req, res) => {
      const course = req.body    
      
      // Load data from db.json into db.data
      await db.read()

      const lastCreatedCourse= db.data.courses[db.data.courses.length - 1]
      const id = lastCreatedCourse ? lastCreatedCourse.id + 1 : 1

      db.data.courses.push({ id, ...course })

      // Save data from db.data to db.json file
      await db.write()

      res.json({ id })
    })


    // curl -X POST '{"user_id": 1, "course_id": 1}' -H "Content-Type: application/json" "http://localhost:3000/students-courses"
    // POST /users with body { title: string, date: date}
    // Add a new user in DB
    app.post('/students-courses', validateSchema(createStudentCourseSchema), async (req, res) => {
      const student_course = req.body  
      const date: Date = new Date();
      const notSignedDate:Date = new Date(0);
      
      // Load data from db.json into db.data
      await db.read()

      db.data.students_courses.push({ ...student_course, "registeredAt": date, "signedAt": null})

      // Save data from db.data to db.json file
      await db.write()

      res.json({student_course})
    })
  }
  
  /*
  // 3.
  // PATCH /persons/:id with body { firstName: string, lastName: string }
  // Update a person in DB
  app.patch('/persons/:id', validateSchema(updatePersonSchema), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    const person = req.body

    // Load data from db.json into db.data
    await db.read()

    const personIndex = db.data.persons.findIndex(person => person.id === id)
    if (personIndex === -1) {
      res.sendStatus(404)
      return
    }

    db.data.persons[personIndex] = { ...db.data.persons[personIndex], ...person }

    // Save data from db.data to db.json file
    await db.write()

    res.sendStatus(204)
  })

  // 4. Qu'est-ce qu'une API REST ?
  // En 2-3 slides que faut-il retenir ?
  // Quelle association entre les verbes HTTP et les opérations CRUD ?
  // Comment nommer les routes ? Singulier ou pluriel ? Majuscule ou minuscule ?
  // Comment documenter une API REST ? Un package NPM ? Un site web ? Autre ? Avec Express ?

  app.delete('/persons/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    await db.read()

    const personIndex = db.data.persons.findIndex(person => person.id === id)
    if (personIndex === -1) {
      res.sendStatus(404)
      return
    }

    db.data.persons.splice(personIndex, 1)
    await db.write()
    res.sendStatus(204)
  })
  */
}

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000')
})