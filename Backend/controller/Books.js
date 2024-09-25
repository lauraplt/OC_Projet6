const book = require('../models/book');

//POST to register a book 
exports.createBook = (req, res, next) => {
  //form-data to object
  const bookObject = JSON.parse(req.body.book);
  //create book
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      ratings: [],
      averageRating: 0,
      //get image url 
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  //save book
  book.save()
      .then(() => res.status(201).json({ message: 'Book successfully created' }))
      .catch(error => res.status(400).json({ error }));
};

// GET => to get one specfiq book
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};