// import { hashSync } from 'bcryptjs';
import bcrypt from 'bcryptjs';

const Users = [
    {
        name: 'Admin User',
        email: 'admin@email.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'john@email.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: false,
    },
    {
        name: 'Jane Doe',
        email: 'jane@email.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: false,
    },
    {
        name: 'Ram',
        email: 'ram@email.com',
        password: bcrypt.hashSync('123', 10),
        isAdmin: false,
    },
];

export default Users;