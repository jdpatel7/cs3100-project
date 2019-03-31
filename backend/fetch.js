const db = require('./db');

module.exports.fetch = (req, res) => {
  console.log(req.path, req.body);
  switch (req.body.type) {
    case 'secQ':
      if (req.body.value && req.body.value.username) {
        db.get(
          'userByUsername',
          {username: req.body.value.username},
          (error, row) => {
            if (!error) {
              if (typeof row === 'undefined') {
                res.send({
                  ok: false,
                  message: 'User does not exist.',
                });
              } else {
                // Got a user
                res.send({
                  ok: true,
                  secQ: row.secQ,
                  message: 'User exists',
                });
              }
            } else {
              res.send({
                ok: false,
                message: `Error contacting database: ${error}`,
              });
            }
          }
        );
      } else {
        res.status(400);
        res.type('text');
        res.send('Bad Request');
      }
      break;
    default:
      res.status(400);
      res.type('text');
      res.send('Bad Request');
      break;
  }
};

module.exports.all = (req, res) => {
  console.log(req.path, req.body);
  switch (req.body.type) {
    case 'tag':
    case 'level':
    case 'user':
      db.all(req.body.type, (error, rows) => {
        if (!error) {
          res.status(200);
          res.send(rows);
        } else {
          res.status(500);
          res.type('text');
          res.send(
            `Unable to retrieve ${req.body.type}s from database:${error}`
          );
        }
      });
      break;
    default:
      res.status(400);
      res.type('text');
      res.send('Bad Request');
      break;
  }
};
