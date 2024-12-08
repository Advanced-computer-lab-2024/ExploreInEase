# Project Title

ExploreInEase

## Motivation

This section is for letting the reader know why you created this project, the reason behind pursuing such a project, and why you have decided to do it.

## Build Status

This basically explains the current build status of the project. If there is a bug/error which needs addressing, mention it here.

## Code Style

This project uses 2-space indentation for all JavaScript and JSON files. Formatting is enforced with Prettier to maintain consistency and uses the routes-controller-service-repository architecture to ensure separation of concerns

## Screenshots

As the saying goes, a picture is equal to a thousand words. Most people will be interested if there is a visual representation of what the project is about. It helps them understand better. A visual representation can be snapshots of the project or a video of the functioning of the project.

## Tech/Framework Used

Frontend: React.js
Backend: Node.js, Express.js
Database: MongoDB
Other Tools: Postman

## Features

This is where you write what all extra features have been done in your project. Basically, this is where you try to make your project stand out from the rest.

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

This is where you let them know that they can contribute and help you out. A guideline on how to contribute is also helpful.

## Credits

Giving proper credit is most important. Mention any links/repos which helped you or inspired you to build this project. It can be a blog, another open source project, or just people who have contributed to building this project.

## License

A short description of the license. (MIT, Apache, etc.)