import { NextFunction, Request, Response } from "express"

async function errorHandler(
  error: { code: string, message: string }, 
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  if(error.code === 'NotFound') {
    return res.status(404).send(error.message);
  }

  else if(error.code === 'Conflict') {
    return res.status(409).send(error.message);
  }
  
  else if(error.code === 'IncompatibleFormat') {
    return res.status(422).send(error.message);
  }

  else if(error.code === 'Expired') {
    return res.status(406).send(error.message);
  }

  else if(error.code === 'Unauthorized') {
    return res.status(401).send(error.message);
  }

  else if(error.code === 'BadRequest') {
    return res.status(400).send(error.message);
  }

  res.sendStatus(500);
}

export default errorHandler;