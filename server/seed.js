// Adds demo users and books. Run only on a development database: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Book = require('./models/Book');
const Request = require('./models/Request');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookbridge');
  await Promise.all([User.deleteMany(), Book.deleteMany(), Request.deleteMany()]);

  const hash = await bcrypt.hash('password123', 10);
  const [arjun, meera] = await User.create([
    { name: 'Arjun K', email: 'arjun@college.edu', password: hash },
    { name: 'Meera S', email: 'meera@college.edu', password: hash },
    { name: 'Admin', email: 'admin@college.edu', password: hash, role: 'admin' }
  ]);

  await Book.create([
    { title: 'Data Structures Using C', author: 'Reema Thareja', price: 220, condition: 'Good', semester: 3, department: 'CSE', seller: arjun._id },
    { title: 'Operating System Concepts', author: 'Silberschatz', price: 350, condition: 'Like New', semester: 5, department: 'CSE', seller: meera._id },
    { title: 'Database System Concepts', author: 'Korth', price: 300, condition: 'Good', semester: 4, department: 'CSE', seller: arjun._id },
    { title: 'Computer Networks', author: 'Tanenbaum', price: 280, condition: 'Fair', semester: 5, department: 'CSE', seller: meera._id },
    { title: 'Engineering Mathematics', author: 'B.S. Grewal', price: 250, condition: 'Good', semester: 1, department: 'Basic Science', seller: arjun._id },
    { title: 'Java: The Complete Reference', author: 'Herbert Schildt', price: 320, condition: 'Like New', semester: 3, department: 'CSE', seller: meera._id },
    { title: 'Design & Analysis of Algorithms', author: 'Anany Levitin', price: 260, condition: 'Good', semester: 4, department: 'CSE', seller: arjun._id },
    { title: 'Software Engineering', author: 'Roger Pressman', price: 240, condition: 'Fair', semester: 6, department: 'ISE', seller: meera._id }
  ]);

  console.log('Demo data added. Login: arjun@college.edu / password123 (admin@college.edu for admin)');
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
