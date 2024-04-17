# Northcoders News(NC news) API

# ABOUT Northcoders News
    This is my first independent project. NC news is mainly a news web application. It allows users to create accounts, post, delete articles, and browse commented articles. It allows users to create an account, post, delete articles, browse commented articles, and filter articles on different topics through various filters, and so on.

# LINK TO THE HOSTED VERSION
    This is the link to the 1.0.0 version of the NC news: https://back-end-project-clnr.onrender.com/api/
    
    // I will put the screenshot of the web app here once I finished the frontend//




# HOW TO INSTALL AND RUN Northcoders News Locally
- 1. Clone this repo https://github.com/WanwanShi/back_end_project-NC_news
    - In your terminal, go to the directory where you want to install the project;
    - run 'git clone https://github.com/WanwanShi/back_end_project-NC_news' in your terminal
- 2. Install the dependencies you need for this project
    - run 'npm i' in the terminal,this will install all the dependencies.
- 3. .env files create 
    - database access: If you wish to clone this repo and run locally, you will need to link to your own database as following steps:
        - Create a file under the root directory of this project named ".env.test".
        - In the ".env.test" file you created, set the file content to "PGDATABASE=nc_news_test". Please be aware, there should not be any other content and semicolon in the file. This is to set the environment for the database.
        - Create a file under the root directory of this project named ".env.development".
        - In the ".env.development" file you created, set the file content to "PGDATABASE=nc_news".
        - There is a file called "env-example", you can check the example to set the database name.
        -*******IMPORTANT*********
        - Make sure your .env files is in the .gitignore file by putting '.env.*' so your personal database information is not in public files by any chance.

- 4. Create local databases
    - in your terminal, run'npm run setup-dbs', this will allow you to create test and development databases.
- 5. Run test using test database (if you wish to run test)
    - run 'npm test',this will allow you to seed your test data and run test
- 6. Run development using development database(if you wish to check project in the development stage)
    - run 'npm run seed', this will allow you to seed the development data

# minimum version for Node.js Postgres
- Node.js v20.10.0
- Postgres 14.10 
