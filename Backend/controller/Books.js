const Book = require('../models/book');
const average = require('../utils/average');
const path = require('path');
const fs = require('fs');

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

//POST
exports.createRating = (req, res, next) => {
    if(0 <= req.body.rating <= 5) {
        const RATING_OBJECT = { ...req.body, grade: req.body.rating };
        delete RATING_OBJECT.id;
        book.findOne({_id: req.params.id})
        .then(book => {
            const NEW_RATING = book.ratings;
            const USERID_ARRAY = NEW_RATING.map(rating => rating.userId);
            if (USERID_ARRAY.includes(req.auth.userId)) {
                res.status(403).json({ message: 'not authorized' });
            } else {
                NEW_RATING.push(RATING_OBJECT);
                const GRADES = NEW_RATING.map(rating => rating.grade);
                const AVERAGE_GRADES = average.average(GRADES);
                book.averageRating = AVERAGE_GRADES;
                book.updateOne({ _id: req.params.id }, {ratings: NEW_RATING, averageRating: AVERAGE_GRADES, _id: req.params.id })
                .then(() => {res.status(201).json()})
                .catch(error => { res.status(400).json( { error })});
                res.status(200).json(book);
            }
        })
        .catch((error) => {
            res.status(404).json({ error });
        });
    } else {
        res.status(404).json({ message: 'la note doit être comprise entre 1 et 5' });
    }
};
//GET
exports.getBestRating = (req, res, next) => {
    book.find().sort({averageRating: -1}).limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(404).json({ error }));
}