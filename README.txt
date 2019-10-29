~Requirements~
To be able to launch this site, you must first download Node from nodejs.org and run the following command in the terminal to install the necessary dependencies:

npm install -g
npm init
npm install react --save
npm install react-dom --save
npm install spotify-web-api-js
npm install react-bootstrap bootstrap --save

If you run into any other errors when trying to launch the website, check the error message and if missing a dependency install it by running this in the terminal:
npm install dependency_name --save

~Launching the Website~
Open two terminal windows. 
In one navigate to auth-server/authorization_codde and run the following command:
node app.js

In the other, navigate to client and run the following command:
npm start

