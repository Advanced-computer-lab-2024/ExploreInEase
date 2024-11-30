const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Users Schema
const UsersSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
    },
    email: {
        type: String,
    }, 
    rating: {
        type: Number,
        min: 0,
        max: 5,
      },
    ratingSum: {
        type: Number,
        default: 0,
    },
    ratingCount: {
        type: Number,
        default: 0,
    },
    documents: {
        nationalId: {
            type: String,
           
        },
        certificate: {
            type: String,
            
        },
        taxation: {
            type: String,
            
        },  
    },
    experience: {
        type: String,
       
    },
    previousWork: {
        type: String,
       
    },
    linkWebsite: {
        type: String,
        
    },
    hotline: {
        type: String,
        default: ''
    },
    companyProfile: {
        type: String,
        
    },
    sellerName: {
        type: String,
        
    },
    type: {
        type: String,
        required: [true, 'User type is required'],
        enum: ['advertiser', 'tourGuide', 'seller', 'tourismGovernor', 'admin'] // User types
    },
    photo: {
        selfPicture: {
            type: String,
            default: ""
        },
        logo: {
            type: String,
            default: ""
        }
    },
    comment: {
        type: [String],
        
    },
    industry: {
        type: String,
        
    },
    linkedInLink: {
        type: String,
        
    },
    sellerType: {
        type: String,
        enum: ['VTP', 'External',''], // Seller types
        default: function() {
            return this.type === 'seller' ? 'External' : '';
        }
    },
    docStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected', ""],
        default: function() {
            if(this.documents.nationalId || this.documents.certificate || this.documents.taxation) {
                return 'pending';
            } else {
                return "";
            }
        }
    },
    termsAndConditions: {
        type: Boolean,
        default: false
    },
    requestDeletion: {
        type: Boolean,
        default: false
    },
    founded: {
        type: Date,
       
    },
    specialist: {
        type: String,
        default: ''
    },
    noEmployees: {
        type: Number,
      
    },
    
    status: {
        type: Boolean,
        default: false
    },
    promoCodes: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        promoCode: {
            type: String,
            ref: 'PromoCodes'
        },
    }],
    otp: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'EGP'
    }
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    versionKey: false // Disable the "__v" version key
});

// Create the Users Model
const Users = mongoose.model('Users', UsersSchema);

module.exports = Users;
