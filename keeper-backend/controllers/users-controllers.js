const signup = (req, res, next) => {
  res.send('Admin homepage');
};

const login = (req, res, next) => {
  res.send('Admins homepage');
};

exports.signup = signup;
exports.login = login;