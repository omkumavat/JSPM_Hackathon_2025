<!--
Hey, thanks for using the awesome-readme-template template.  
If you have any enhancements, then fork this project and create a pull request 
or just open an issue with the label "enhancement".

Don't forget to give this project a star for additional support ;)
Maybe you can mention me or this repo in the acknowledgements too
-->
<div align="center">

  <img src="https://res.cloudinary.com/dtobcdrww/image/upload/c_thumb,w_200,g_face/v1738823354/Flux_Dev_A_stylized_illustration_of_a_futuristic_distributed_s_3_s1ours.png" alt="logo" width="auto" height="auto" />
  <h1></h1>
  <p>
This project implements a Task Scheduling System where admins can create tasks, and available workers are assigned based on their execution time and capacity. The system ensures:
Efficient Task Allocation: Assigns tasks to workers with the least load while ensuring they don’t exceed their capacity.
Queue Management: Tasks are initially marked as "not_assigned" and scheduled dynamically when a worker becomes available.
MongoDB Transactions: Prevents assigning multiple tasks simultaneously before updating worker load.
Greedy Load Based Execution: workers with low load balanced can be allocated to process.
</p>
   
</div>

<br />

<!-- Table of Contents -->
# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
  * [Screenshots](#camera-screenshots)
  * [Tech Stack](#space_invader-tech-stack)
  * [Features](#dart-features)
- [Getting Started](#toolbox-getting-started)
  * [Prerequisites](#bangbang-prerequisites)
  * [Run Locally](#running-run-locally)
- [Roadmap](#compass-roadmap)
- [FAQ](#grey_question-faq)
- [Acknowledgements](#gem-acknowledgements)

  

<!-- About the Project -->
## :star2: About the Project


<!-- Screenshots -->
### :camera: Screenshots

<div align="center"> 
  <img src="https://res.cloudinary.com/dtobcdrww/image/upload/v1738824333/WhatsApp_Image_2025-02-06_at_12.11.08_b3452d8f_exzygm.jpg" alt="screenshot" />
</div>
<div align="center"> 
  <img src="https://res.cloudinary.com/dtobcdrww/image/upload/v1738824378/WhatsApp_Image_2025-02-06_at_12.12.35_dab73872_qhpemg.jpg" alt="screenshot" />
</div>
<div align="center"> 
  <img src="https://res.cloudinary.com/dtobcdrww/image/upload/v1738824379/WhatsApp_Image_2025-02-06_at_12.12.35_783f6ae6_qpmol3.jpg" alt="screenshot" />
</div>


<!-- TechStack -->
### :space_invader: Tech Stack

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://reactjs.org/">React.js</a></li>
    <li><a href="https://tailwindcss.com/">TailwindCSS</a></li>
    <li><a href="https://reactrouter.com/">React Router</a></li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://nodejs.org/">Node.js</a></li>
    <li><a href="https://expressjs.com/">Express.js</a></li>
    <li><a href="https://www.npmjs.com/package/bcryptjs">bcrypt.js</a></li>
    <li><a href="https://www.npmjs.com/package/jsonwebtoken">jsonwebtoken</a></li>
    <li><a href="https://www.npmjs.com/package/corns">NPM Corns</a></li>
  </ul>
</details>

<details>
  <summary>Database</summary>
  <ul>
    <li><a href="https://www.mongodb.com/">MongoDB</a></li>
  </ul>
</details>


<!-- Features -->
### :dart: Features

<details>
  <summary>🎯 Features</summary>
  <ul>
    <li>📌 Task creation and management for workers by admin</li>
    <li>⚡ Dynamic task scheduling based on worker availability</li>
    <li>📊 Worker load balancing to optimize task assignment</li>
    <li>⏳ Task queue management with real-time status updates</li>
    <li>🔄 Automatic task reassignment if a worker becomes unavailable</li>
    <li>🚀 Greedy Based low Load task execution</li>
    <li>🔍 Pending,  In Progress and Completed tasks.</li>
    <li>🛠️ Admin panel for monitoring tasks and worker status</li>
  </ul>
</details>






<!-- Getting Started -->
## 	:toolbox: Getting Started

<!-- Prerequisites -->
### :bangbang: Prerequisites

This project uses npm as package manager

```bash
 npm install 
```

<!-- Run Locally -->
### :running: Run Locally


Clone the project

```bash
  git clone https://github.com/omkumavat/JSPM_Hackathon_2025.git
```
### :computer: Client

Go to the project directory

```bash
  cd frontend
```

Install dependencies

```bash
  npm install
```

Start the Client

```bash
  npm start
```

### :computer: Server

Go to the project directory

```bash
  cd backend
```

Install dependencies

```bash
  npm install
```

Start the Server

```bash
  nodemon index.js
```

<!-- Roadmap -->
## :compass: Roadmap

* [x] Set up project structure and initial configurations
* [x] Implement admin authentication and authorization (JWT-based)
* [x] Develop task creation and management system
* [x] Implement worker registration and availability tracking
* [x] Design task scheduling logic with load based handling
* [x] Optimize worker load balancing for efficient task execution
* [x] Create task queue management system
* [x] Develop admin panel for task and worker monitoring
* [x] Implement search and filtering for tasks
* [x] Enable real-time task status update
* [ ] Enhance UI/UX for admin dashboard (React, Tailwind CSS)
* [ ] Optimize API performance and reduce latency
* [ ] Implement multilingual support for global reach
* [ ] Develop a mobile-friendly interface for task management

<!-- FAQ -->
## :grey_question: FAQ

- **How do I set up the project?**

  + Clone the repository using `git clone https://github.com/omkumavat/JSPM_Hackathon_2025.git`, navigate to the project folder, and run `npm install` to install the dependencies. After that, you can start the server using `npm start`.

- **How do I add environment variables?**

  + Create a `.env` file in the root of your project and add the necessary environment variables like `API_KEY`, `MONGODB_URL`, `JWT_SECRET`, and others, as described in the setup section of the README.

- **Can I contribute to the project?**

  + Yes, you can contribute! Please fork the repository, make changes, and create a pull request. Ensure that your code follows the project's style guide and includes necessary tests.

- **What should I do if I face issues with deployment?**

  + If you encounter deployment issues, ensure that all environment variables are set correctly, check the logs for any errors, and make sure the server is configured properly. You can also check the troubleshooting section in the README or contact the maintainer.

- **What are the system requirements?**

  + The project requires Node.js (version 14 or later), npm, and an active MongoDB instance. It also requires certain environment variables like `MONGODB_URL` for database access.

- **How can I run tests for this project?**

  + To run tests, execute `npm start` after installing dependencies. Ensure that you have configured all required environment variables before running the tests.


<!-- Acknowledgments -->
## :gem: Acknowledgements

Use this section to mention useful resources and libraries that you have used in your projects.

- [Readme Template](https://github.com/othneildrew/Best-README-Template) - A great README template to follow for structuring my documentation.
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - For cloud-based MongoDB database hosting.
- [Node.js](https://nodejs.org/en/) - The runtime environment for building the server-side of the project.
- [Express.js](https://expressjs.com/) - Framework used for building the server and API.
- [React.js](https://reactjs.org/) - For building the frontend of the project.
- [Axios](https://axios-http.com/) - For making API requests on the frontend.

