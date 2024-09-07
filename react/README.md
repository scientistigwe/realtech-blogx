# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

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

Updated Request and Response Flow with Authentication-Focused Files
Request Flow

User Interaction:

File(s):
Components that trigger API calls, such as components/Auth/Login.js.
Dispatch API Request:

File(s):
components/Auth/Login.js initiates the request by dispatching actions.
Redux Middleware:

File(s):
middleware/authMiddleware.js processes actions related to authentication, such as handling API calls or managing authentication state.
API Call:

File(s):
api/apiClientBase.js creates an Axios instance configured for requests.
api/authApi.js handles specific API calls related to authentication.
API Config:

File(s):
api/apiEndpoints.js provides endpoint URLs for API requests.
API Interceptor:

File(s):
auth/apiInterceptor.js determines whether the URL needs authentication based on private and public API endpoint lists. If authentication is needed, it checks the authentication status.
Auth Status Check (if needed):

File(s):
auth/authStatus.js is used to check and set authentication status if the apiInterceptor determines that authentication is required.
Sending Request (Network Layer):

File(s):
Managed by Axios as configured in apiClientBase.js.
Server Processing:

File(s):
This is on the server-side and not directly represented in your files.
Database Interaction:

File(s):
This is on the server-side and not directly represented in your files.
Response Handling

Receiving Response:

File(s):
Managed by Axios as configured in apiClientBase.js.
API Interceptor (Response Handling):

File(s):
auth/apiInterceptor.js processes responses, including handling unauthorized errors.
API Call Completion:

File(s):
api/apiClientBase.js completes the API request and response cycle.
Redux Store Update:

File(s):
authSlice.js updates the Redux store based on API responses and authentication status.
Component Update:

File(s):
components/Auth/Login.js, components/Auth/Logout.js receive updated state from Redux.
User Feedback:

File(s):
components/Auth/Login.js provides feedback to the user based on authentication state.
Detailed Diagram with Files and apiInterceptor Role
plaintext
Copy code
User Interaction
|
v
Dispatch API Request (Component)
[components/Auth/Login.js]
|
v
Redux Middleware (e.g., thunk/saga)
[middleware/authMiddleware.js]
|
v
API Call
[api/apiClientBase.js, api/authApi.js]
|
v
API Config
[api/apiEndpoints.js]
|
v
API Interceptor (Decides if auth is needed)
[auth/apiInterceptor.js]
|
v
If Auth Needed:
|
v
Auth Status Check
[auth/authStatus.js]
|
v
Sending Request (Network Layer)
|
v
Server Processing
|
v
Database Interaction
|
v
Receiving Response (Network Layer)
|
v
API Interceptor (Response Handling)
[auth/apiInterceptor.js]
|
v
API Call Completion
[api/apiClientBase.js]
|
v
Redux Store Update (Action Dispatch to Reducer)
[authSlice.js]
|
v
Component Update (React Re-render)
[components/Auth/Login.js]
|
v
User Feedback
[components/Auth/Login.js]

Auth Hooks (useAuth.js)
javascript
Copy code
// Authentication Hooks
export const useCreateJwt = () => { /_ implementation _/ };
export const useRefreshJwt = () => { /_ implementation _/ };
export const useVerifyJwt = () => { /_ implementation _/ };
export const useRegister = () => { /_ implementation _/ };
export const useLogout = () => { /_ implementation _/ };
export const useUsersList = () => { /_ implementation _/ };
export const useCreateUser = () => { /_ implementation _/ };
export const useActivateUser = () => { /_ implementation _/ };
export const useGetCurrentUserProfile = () => { /_ implementation _/ };
export const useUpdateUserProfile = () => { /_ implementation _/ };
export const usePartialUpdateUserProfile = () => { /_ implementation _/ };
export const useDeleteUserProfile = () => { /_ implementation _/ };
export const useResendActivation = () => { /_ implementation _/ };
export const useResetPassword = () => { /_ implementation _/ };
export const useResetPasswordConfirm = () => { /_ implementation _/ _/;
export const useResetUsername = () => { /_ implementation _/ };
export const useResetUsernameConfirm = () => { /_ implementation _/ };
export const useSetPassword = () => { /_ implementation _/ };
export const useSetUsername = () => { /_ implementation _/ };
export const useGetUserById = () => { /_ implementation _/ };
export const useUpdateUserById = () => { /_ implementation _/ };
export const usePartialUpdateUserById = () => { /_ implementation _/ };
export const useDeleteUserById = () => { /_ implementation _/ };
Users Hooks (useUsers.js)
javascript
Copy code
// Users Hooks
export const useListUsers = () => { /_ implementation _/ };
export const useCreateUser = () => { /_ implementation _/ };
export const useUpdateUserProfile = () => { /_ implementation _/ };
export const useGetCurrentUserProfile = () => { /_ implementation _/ };
export const usePartialUpdateUserProfile = () => { /_ implementation _/ };
export const useDeleteUserProfile = () => { /_ implementation _/ };
export const useGetRole = () => { /_ implementation _/ };
export const useContactAuthor = () => { /_ implementation _/ };
Comments Hooks (useComments.js)
javascript
Copy code
// Comments Hooks
export const useListComments = () => { /_ implementation _/ };
export const useCreateComment = () => { /_ implementation _/ };
export const useGetCommentById = () => { /_ implementation _/ };
export const useUpdateComment = () => { /_ implementation _/ };
export const usePartialUpdateComment = () => { /_ implementation _/ };
export const useDeleteComment = () => { /_ implementation _/ };
export const useUpvoteComment = () => { /_ implementation _/ };
export const useDownvoteComment = () => { /_ implementation _/ };
Tags Hooks (useTags.js)
javascript
Copy code
// Tags Hooks
export const useListTags = () => { /_ implementation _/ };
export const useCreateTag = () => { /_ implementation _/ };
export const useGetTagById = () => { /_ implementation _/ };
export const useUpdateTag = () => { /_ implementation _/ };
export const usePartialUpdateTag = () => { /_ implementation _/ };
export const useDeleteTag = () => { /_ implementation _/ };
Notifications Hooks (useNotifications.js)
javascript
Copy code
// Notifications Hooks
export const useListNotifications = () => { /_ implementation _/ };
export const useCreateNotification = () => { /_ implementation _/ };
export const useReadNotification = () => { /_ implementation _/ };
export const useUpdateNotification = () => { /_ implementation _/ };
export const usePartialUpdateNotification = () => { /_ implementation _/ };
export const useDeleteNotification = () => { /_ implementation _/ };
export const useMarkAsRead = () => { /_ implementation _/ };
Categories Hooks (useCategories.js)
javascript
Copy code
// Categories Hooks
export const useListCategories = () => { /_ implementation _/ };
export const useCreateCategory = () => { /_ implementation _/ };
export const useGetCategoryById = () => { /_ implementation _/ };
export const useUpdateCategory = () => { /_ implementation _/ };
export const usePartialUpdateCategory = () => { /_ implementation _/ };
export const useDeleteCategory = () => { /_ implementation _/ };
Posts Hooks (usePosts.js)
javascript
Copy code
// Posts Hooks
export const useListPosts = () => { /_ implementation _/ };
export const useCreatePost = () => { /_ implementation _/ };
export const usePostsByCategory = () => { /_ implementation _/ };
export const usePostsBySubcategory = () => { /_ implementation _/ };
export const useMostViewedPosts = () => { /_ implementation _/ };
export const usePostsByUser = () => { /_ implementation _/ };
export const useGetPostById = () => { /_ implementation _/ };
export const useUpdatePost = () => { /_ implementation _/ };
export const usePartialUpdatePost = () => { /_ implementation _/ };
export const useDeletePost = () => { /_ implementation _/ };
export const useUpvotePost = () => { /_ implementation _/ };
export const useDownvotePost = () => { /_ implementation _/ };
export const useManageTags = () => { /_ implementation _/ };
export const usePostEngagements = () => { /_ implementation _/ };
export const useCheckSlug = () => { /_ implementation \*/ };
