# E-Learning Smart Contract

This repository contains a small e-learning platform project built with ReactJS, Redux Toolkit, Ganache, Metamask, and Truffle. Students can take multiple-choice quizzes, and their progress and results are securely stored as smart contracts on the Ethereum blockchain.

## Quick Start

### Steps to Run the Project:

1. **Smart Contract Deployment**:
   - In the project's root directory, execute the following command to deploy the smart contracts to the blockchain and generate new addresses. These addresses will be available in "client/src/contracts/*.json".

   ```bash
   truffle migrate --reset
   ```

2. **Configure Contract Addresses**:
   - Copy the addresses from "client/src/contracts/Authentication.json" and "client/src/contracts/Courses.json".
   - Paste these addresses into "client/src/config.json". These new addresses will allow access to the new smart contracts.

3. **Start the Application**:
   - From the "client" directory, execute the following command to start the React application.

   ```bash
   cd client
   npm install
   npm start
   ```

4. **Access the E-Learning Platform**:
   - Open your web browser and go to `http://localhost:3000` to use the platform.

## Features

- Take multiple-choice quizzes.
- Securely store progress and results on the Ethereum blockchain.
- Integrate with Metamask for blockchain interaction.

## Technologies Used

- ReactJS: Front-end development.
- Redux Toolkit: State management.
- Ganache: Local blockchain development.
- Metamask: Ethereum wallet and blockchain interaction.
- Truffle: Ethereum smart contract deployment.
