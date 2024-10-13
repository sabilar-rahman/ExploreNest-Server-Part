import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utility/catchAsync'
import { AnyZodObject } from 'zod'

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsed = await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    })

    req.body = parsed.body
    req.cookies = parsed.cookies

    next()
  })
}

export default validateRequest