import bcrypt from 'bcryptjs';
import { connectDb } from '../config/db.js';
import { assertEnv } from '../config/env.js';
import { User } from '../models/User.js';

assertEnv();
await connectDb();

const email = process.argv[2] || 'arpitmasharmaa@gmail.com';
const newPassword = process.argv[3] || 'PortfolioAdmin123!';

const passwordHash = await bcrypt.hash(newPassword, 12);

await User.deleteMany({});
const user = await User.create({
  email: email.toLowerCase(),
  name: 'Arpit',
  passwordHash,
});

console.log(`\n✅ Admin account successfully reset!`);
console.log(`📧 Email:    ${user.email}`);
console.log(`🔑 Password: ${newPassword}\n`);

process.exit(0);
