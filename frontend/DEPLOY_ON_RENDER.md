## Deploying the Frontend to Render

I have configured the frontend for deployment on Render. Here's a summary of the changes I made:

1.  **Created `server.js`**: This file contains a simple Express server to serve the production build of the React application.
2.  **Added `express` dependency**: I added `express` to the `package.json` to run the server.
3.  **Updated `start` script**: The `start` script in `package.json` is now `node server.js` to run the production server.
4.  **Specified Node.js version**: I added an `engines` section to `package.json` to tell Render to use Node.js version `18.x`.
5.  **Created `render.yaml`**: This file defines the services and infrastructure needed to deploy the application on Render, making the deployment process more automated and reproducible.

### Deployment Steps

To deploy your frontend to Render, follow these steps:

1.  **Push your code to a GitHub repository.**
2.  **Create a new 'Blueprint' on the Render dashboard.**
3.  **Connect your GitHub repository to the new blueprint.**

Render will then automatically build and deploy your application based on the `render.yaml` file.