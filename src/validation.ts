import { date, number, object, string } from 'yup';

let createUserSchema = object({
  email: string().required().trim(),
  password: string().required().trim(),
  role: string().required().trim()
});

let updateUserSchema = object({
  email: string().required().trim(),
  password: string().required().trim(),
  role: string().required().trim()
});

let createCourseSchema = object({
  title: string().required().trim(),
  date: date().required()
});

let updateCourseSchema = object({
  title: string().required().trim(),
  date: date().required()
});

let createStudentCourseSchema = object({
  user_id: number().required(),
  course_id: number().required(),
});

let updateStudentCourseSchema = object({
  user_id: number().required(),
  course_id: number().required(),
  registeredAt: date().required(),
  signedAt: date().required()
});

export { createUserSchema, updateUserSchema, createCourseSchema, updateCourseSchema, createStudentCourseSchema, updateStudentCourseSchema};