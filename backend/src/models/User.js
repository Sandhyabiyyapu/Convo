import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({// User schema definition
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,   
    },
    bio: {
        type: String,
        default: '',
    },
    profilePic: {
        type: String,
        default: '',
    },
    nativeLanguage: {
        type: String,
        default: '',
    },
    learningLanguage: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        default: '',
    },
    isOnBoarded: {
        type: Boolean,
        default: false,
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
},{timestamps:true});

//pre hook to hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next(); // If password is not modified, skip hashing
    
    try{
        const salt = await bcrypt.genSalt(10);// Generate a salt with 10 rounds
        // Hash the password with the generated salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch (error) {
        next(error);
    }
})

// Method to compare entered password with stored password
// This method will be used to verify the user's password during login
userSchema.methods.matchPassword = async function(enteredPassword) {// Method to compare entered password with stored password
    const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);// Compare the entered password with the hashed password
    return isPasswordCorrect; // Return true if the passwords match, false otherwise
}

// Create a User model based on the userSchema
// This model will be used to interact with the users collection in the MongoDB database
const User = mongoose.model('User', userSchema);
export default User;