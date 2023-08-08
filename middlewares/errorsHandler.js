export default ((err, req, res, next) => {
  console.log('err', err)
  res.status(err.status);

  switch (err.status) {
    case 404:
      res.render('errors/404');
      break;
    default:
      next(new Error('Unexpected error'));
  }
});