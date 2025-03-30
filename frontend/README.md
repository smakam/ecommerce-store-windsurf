# E-commerce Store Frontend

This is the frontend for the e-commerce application, built with React.

## Features

- User authentication (JWT, Google OAuth)
- Product browsing and searching
- Shopping cart functionality
- Order management
- Payment integration with Razorpay
- Responsive design

## Tech Stack

- React.js
- Redux for state management
- React Router for navigation
- Axios for API requests
- Material-UI for styling

## Deployment to Vercel

### Prerequisites

1. Create a Vercel account at [vercel.com](https://vercel.com/)
2. Install the Vercel CLI: `npm install -g vercel`
3. Backend API should be deployed on Render

### Environment Variables

Create a `.env.production` file with the following variables:

```
REACT_APP_API_URL=https://your-render-app.onrender.com/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Replace `your-render-app.onrender.com` with your actual Render app URL.

### Deployment Steps

1. Login to Vercel CLI: `vercel login`
2. Deploy the app: `vercel`
3. Follow the prompts to configure your project
4. For production deployment: `vercel --prod`

Alternatively, you can deploy directly from the Vercel dashboard:

1. Import your GitHub repository
2. Configure the project settings
3. Add the environment variables
4. Deploy

## Development

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

#### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
