const Book = require('../models/book');

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

//PUT
exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/resized_${req.file.filename}`
    } : { ...req.body };
    delete bookObject._userId;
    book.findOne({_id: req.params.id})
    .then((book) => {
        if(book.userId != req.auth.userId) {
            res.status(403).json({ message : '403: unauthorized request' });
        }else{
            const FILE_NAME = book.imageUrl.split('/images/')[1];
            req.file && FileSystem.unlink('images/${FILE_NAME}', (err => {
                    if (err) console.log(err);
                })
            );
        
            book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet modifié !' }))
            .catch(error => res.status(400).json({ error }));
        }
    })
    .catch((error) => {
        res.status(404).json({ error });
    });
};

//DELETE
exports.deleteBook = (req, res, next) => {
    book.findOne({ _id: req.params.id })
    .then(book => {
        if (book.userId != req.auth.userId) {
            res.status(403).json({ message: '403: unauthorized request'});
        } else {
            const FILE_NAME = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${FILE_NAME}`, () => {
                book.deleteOne({ _id: req.params.id })
                .then(() => { res.status(200).json({ message: 'Objet Suprimé !'}) })
                .catch(error => res.status(400).json({ error }));
            })
        }
    })
    .catch( error => {
        res.status(404).json({ error });
    });
};
//GET
exports.getAllBooks = (req, res, next) => {
    book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(404).json({ error }));
};