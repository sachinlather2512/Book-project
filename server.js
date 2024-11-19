const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/signup')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define a schema
// const userSchema = new mongoose.Schema({
//     username: String,
//       email: String,
//       phone: String,
//       message: String
//     });

const userSchema = new mongoose.Schema({
     username: {
         type: String, 
         required: true,
          trim: true 
        }, 
          email: {
             type: String,
              required: true,
            //    unique: true, 
               validate: {
                 validator: function (v) {
                     return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v); 
                    }, 
                    message: props => `${props.value} is not a valid email address!`
                 } 
                }, 
                phone: { 
                    type: String,
                     required: true,
                      validate: { 
                        validator: function (v) { 
                            return /^\d{10}$/.test(v); 
                         },
                          message: props => `${props.value} is not a valid phone number!` 
                        }
                     },
                      message: {
                         type: String,
                          required: true,
                           trim: true
                         }
                        });

// Create a model
const User = mongoose.model('User', userSchema);

// Serve static files
app.use(express.static(path.join(__dirname)));

// Handle form submission
app.post('/signup', async (req, res) => {
    const { username, email, phone , message } = req.body;

    // Create a new user
    const newUser = new User({
        username,
        email,
        phone,
        message
    });

    try {
        // Save the user to the database
        const savedUser = await newUser.save();
        res.redirect('welcome.html');
    } catch (err) {
        console.error('Error saving user data:', err);
        res.status(500).send('Error saving user data.');

        // if (err.code === 11000) {
        //     console.error('Error: Duplicate email'); 
        //     res.status(400).send('Error: Email already exists.'); 
        // } else { 
        //     console.error('Error saving user data:', err);
        //      res.status(500).send('Error saving user data.'); 
        //     }
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
