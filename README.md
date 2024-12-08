# Project Title

ExploreInEase

## Motivation

This section is for letting the reader know why you created this project, the reason behind pursuing such a project, and why you have decided to do it.

## Build Status

This basically explains the current build status of the project. If there is a bug/error which needs addressing, mention it here.

## Code Style

This project uses 2-space indentation for all JavaScript and JSON files. Formatting is enforced with Prettier to maintain consistency and uses the routes-controller-service-repository architecture to ensure separation of concerns

## Screenshots

```markdown
Here are some screenshots of the application:

![addGovernorOrAdmin](https://github.com/Advanced-computer-lab-2024/ExploreInEase/raw/Mohamed's/screenshots/addGovernorOrAdmin.png)
![Screenshot 2](../screenshots/screenshot2.png)
![Screenshot 3](../screenshots/screenshot3.png)
![Screenshot 4](../screenshots/screenshot4.png)
![Screenshot 5](../screenshots/screenshot5.png)
```

## Tech/Framework Used

Frontend: React.js
Backend: Node.js, Express.js
Database: MongoDB
Other Tools: Postman

## Features

This is where you write what all extra features have been done in your project. Basically, this is where you try to make your project stand out from the rest.

### Tourist

1. Book Hotel
2. Book Flight
3. Book an Event (Activity/Itinerary/Historical Place)
4. Book Transportation
5. Purchase a Product
6. Pay through wallet/visa/cod
7. Submit Complaints
8. View Order History

### Tour Guide

1. Create/Read/Update/Delete an Itinerary
2. View Sales Report
3. View Number of Tourists Report

### Advertiser

1. Create/Read/Update/Delete an Activity
2. Create/Read/Update/Delete a Transportation
3. View Sales Report
4. View Number of Tourists Report

### Seller

1. Create/Read/Update/Delete a Product
2. Archive/Unarchive a Product
3. View Sales Report

### Tourism Governor

1. Create/Read/Update/Delete a Historical Place
2. Create/Read/Update/Delete a Historical Location Tag

### Admin

1. Create/Read/Update/Delete an Activity Category
2. Create/Read/Update/Delete a Preference Tag
3. Create/Read/Update/Delete a Product
4. Add User
5. Delete an Account

## Code Examples

This is where you try to compress your project and make the reader understand what it does as simple as possible. This should help the reader understand if your code solves their issue.

## Installation

This is the installation guidelines in order to be able to run the project normally.

### Prerequisites

Node.js (v16 or later recommended)
MongoDB (Installed locally or use a MongoDB cloud service like MongoDB Atlas)
npm (comes with Node.js)

### Backend Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Advanced-computer-lab-2024/ExploreInEase.git
    cd backend
    ```

2. Install dependencies:

    ```bash
    npm install
    npm install stripe
    npm install nodemailer
    npm install amadues
    npm install jsonwebtoken
    ```

3. Start the backend server:

    ```bash
    node main.js
    ```

### Frontend Installation

1. Navigate to the frontend directory:

    ```bash
    cd frontend
    cd exploreinease
    ```

2. Install dependencies:

    ```bash
    npm install
    npm install recharts
    ```

3. Start the frontend server:

    ```bash
    npm run start
    ```

### .env Configuration

1. Create a `.env` file in the root directory of backend and frontend .
2. Add the necessary environment variables. For example:

    ```plaintext
    # Backend .env

    MONGO_URI =mongodb+srv://Mahmoudd2:2292003-Ma@acl.neyvc.mongodb.net/?retryWrites=true&w=majority&appName=ACL
    PORT=3030

    EMAIL_USER=aclproject7@gmail.com
    EMAIL_PASS=Buildo12
    RAPIDAPI_KEY=6710fd7b1ac0ed805eec0fce


    AMADEUS_CLIENT_ID= 0ZNDWQAtjqdGQcAMpVIl4zMR9IJwYgbR
    AMADEUS_CLIENT_SECRET= 986AX1xyZejDvN51

    AMADEUS_CLIENT_ID2= SmzXGDuf2RMIZDLllUYQZ29a0SWGsQvF
    AMADEUS_CLIENT_SECRET2= oM96OTLUtHWjKzpQ


    AMADEUS_CLIENT_ID3 = yzOW0nOROG5brSafY83NWEXUiudjmLdo
    AMADEUS_CLIENT_SECRET3 = p6wllMcKcTi84yGe

    AMADEUS_CLIENT_ID4= 6odeGdyTrngv1iK4MTGLV1ZA3e5DGpaQ
    AMADEUS_CLIENT_SECRET4=5C6yUMriUDBvwtdK

    STRIPE_SECRET_KEY=sk_test_51QOfrZP3C1ta6TKcaY6MeeVy0DTG00poVlhmfQkuSyCxqjzdqoy9fIlQmCuPpBCMVEgZxvWrPdfgVZooxmki6ATI00dNNo7CSy
    STRIPE_PUBLISHABLE_KEY =pk_test_51QOfrZP3C1ta6TKcd53VEcNm89cLxgcOaunbE5hVEIsHyBkHl7G36Gh3SnPErTfMgpUsT4RhmSf8mvpPDxjFgeuz00LJSztbXr

    EMAIL2_USER=saifahmedsalah11
    EMAIL2_PASS=lsssmezaheetgmld


    # Frontend .env
    URL=http://localhost:3000
    AMADEUS_CLIENT_ID4= 6odeGdyTrngv1iK4MTGLV1ZA3e5DGpaQ
    AMADEUS_CLIENT_SECRET4=5C6yUMriUDBvwtdK
    ```

3. Save the `.env` files.

## API Reference

If your project is small, then we can add the reference docs in the readme. For larger projects, it is better to provide links to where the API reference documentation is documented.

## Tests

This is the section where you mention all the different tests that can be performed with code examples.

## How to Use?

As I have mentioned before, you never know who is going to read your readme. So it is better to provide information on how to use your project. A step-by-step guide is best suited for this purpose. It is better to explain the steps as detailed as possible because it might be a beginner who is reading it.

## Contribute

If you want to contribute to our project you can clone our repository and create your own branch to be able to contribute by following steps:

### Cloning the Repository and Creating a Branch

1. Clone the repository:

    ```bash
    git clone https://github.com/Advanced-computer-lab-2024/ExploreInEase.git
    ```

2. Create a new branch:

    ```bash
    git checkout -b your-branch-name
    ```

3. Make your changes and commit them:

    ```bash
    git add .
    git commit -m "Description of your changes"
    ```

4. Push your branch to the repository:

    ```bash
    git push origin your-branch-name
    ```

5. Create a pull request on GitHub to merge your changes into the main branch.

## Credits

### Node.js resources

1. [Node.js resource 1](https://www.youtube.com/playlist?list=PLZlA0Gpn_vH_uZs4vJMIhcinABSTUH2bY)
2. [Node.js resource 2](https://youtu.be/3OOHC_UzrKA?si=6S-I2KhhBGqCn1vn)

### React.js resources

1. [React.js resource 1](https://www.youtube.com/playlist?list=PLZlA0Gpn_vH_NT5zPVp18nGe_W9LqBDQK)
2. [React.js resource 2](https://codedamn.com/news/reactjs/usestate-and-useeffect-hooks)

## License

### Nodemailer

- **License:** MIT
- **Source:** [Nodemailer GitHub Repository](https://github.com/nodemailer/nodemailer)
- **Details:** Nodemailer is licensed under the MIT License, which permits unrestricted use, modification, and distribution as long as the original copyright notice is included.

### Amadeus Node.js SDK

- **License:** MIT
- **Source:** [Amadeus Node.js SDK GitHub Repository](https://github.com/amadeus4dev/amadeus-node)
- **Details:** The Amadeus Node.js SDK is also licensed under the MIT License, allowing for unrestricted use, modification, and distribution with attribution.

### Stripe Node.js SDK

- **License:** Apache 2.0
- **Source:** [Stripe GitHub Repository](https://github.com/stripe/stripe-node)
- **Details:** Stripe Node.js SDK is licensed under the Apache License 2.0, which permits usage, modification, and distribution with attribution, provided you comply with the terms of the license, including providing a copy of the license in any distribution.
