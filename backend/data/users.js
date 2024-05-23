import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'admin',
    username: 'admin@email.com',
    password: bcrypt.hashSync('Admin@123456', 10),
    isAdmin: true,
  },
];

export default users;
