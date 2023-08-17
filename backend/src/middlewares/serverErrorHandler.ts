export const serverErrorHandler = (err: any, req: any, res: any, next: any) => {
  console.log(err.name)
  console.log(err.stack)
  console.log(err.message)

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Something wrong happened',
  })
}
