import { User } from 'src/schemas/user.schema';

// Default password is P@ssw0rd
const users: User[] = [
  {
    username: 'testA',
    password: '$2b$10$LdexHq.eVTiy2aIMSo5B2eNPnXOf9o/0/jZbosQZMcfn4QNQWnepC',
    balanceUSD: 100,
    balanceTHB: 3500,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    username: 'testB',
    password: '$2b$10$wphVeHEqG.CZT99hZcyeSuRGU/CB12jAyC7Ptqo5BfCLM2jYEu/Eq',
    balanceUSD: 100,
    balanceTHB: 3500,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default users;
