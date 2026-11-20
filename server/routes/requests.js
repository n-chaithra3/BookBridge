const express = require('express');
const Request = require('../models/Request');
const Book = require('../models/Book');
const { requireLogin } = require('../middleware/auth');

const router = express.Router();

// POST /api/requests - buyer sends a request for a book
router.post('/', requireLogin, async (req, res) => {
  try {
    const book = await Book.findById(req.body.bookId);
    if (!book || book.status !== 'Available') return res.status(400).json({ error: 'Book is not available' });
    if (String(book.seller) === req.user.id) return res.status(400).json({ error: 'You cannot buy your own book' });
    const request = await Request.create({ book: book._id, buyer: req.user.id });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/requests/mine - requests I sent and requests for my books
router.get('/mine', requireLogin, async (req, res) => {
  const sent = await Request.find({ buyer: req.user.id }).populate('book', 'title price');
  const myBooks = await Book.find({ seller: req.user.id }).select('_id');
  const received = await Request.find({ book: { $in: myBooks } })
    .populate('book', 'title price').populate('buyer', 'name email');
  res.json({ sent, received });
});

// PATCH /api/requests/:id - seller accepts or rejects
router.patch('/:id', requireLogin, async (req, res) => {
  const { status } = req.body;
  if (!['Accepted', 'Rejected'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const request = await Request.findById(req.params.id).populate('book');
  if (!request) return res.status(404).json({ error: 'Request not found' });
  if (String(request.book.seller) !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
  request.status = status === 'Accepted' ? 'Sold' : 'Rejected';
  await request.save();
  if (status === 'Accepted') await Book.findByIdAndUpdate(request.book._id, { status: 'Sold' });
  res.json(request);
});

module.exports = router;
