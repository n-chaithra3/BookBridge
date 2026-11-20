const express = require('express');
const Book = require('../models/Book');
const { requireLogin, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/books?search=&department=&semester=&condition=
router.get('/', async (req, res) => {
  const { search, department, semester, condition } = req.query;
  const filter = { status: 'Available' };
  if (search) filter.$or = [{ title: new RegExp(search, 'i') }, { author: new RegExp(search, 'i') }];
  if (department) filter.department = department;
  if (semester) filter.semester = Number(semester);
  if (condition) filter.condition = condition;
  try {
    const books = await Book.find(filter).populate('seller', 'name');
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Could not load books' });
  }
});

// POST /api/books - add a listing (logged-in students)
router.post('/', requireLogin, async (req, res) => {
  const { title, author, price, condition, semester, department } = req.body;
  if (!title || !price || price <= 0) return res.status(400).json({ error: 'Title and a valid price are required' });
  try {
    const book = await Book.create({ title, author, price, condition, semester, department, seller: req.user.id });
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/books/:id - seller can delete own listing, admin can delete any
router.delete('/:id', requireLogin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    if (String(book.seller) !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not allowed' });
    }
    await book.deleteOne();
    res.json({ message: 'Listing removed' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/books/all - admin view of every listing
router.get('/all', requireLogin, requireAdmin, async (req, res) => {
  const books = await Book.find().populate('seller', 'name email');
  res.json(books);
});

module.exports = router;
