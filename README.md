# Dressin.com Automation Script

This project is an automated script designed to simulate user interactions on Dressin.com, demonstrating proficiency in web automation and e-commerce processes.

## Technologies Used

- **Node.js**: The core runtime environment for the script.
- **TypeScript**: Used for adding static typing to the JavaScript code, enhancing code quality and maintainability.
- **Playwright**: A powerful library for browser automation, used to interact with web elements and simulate user actions.
- **Dotenv**: For managing environment variables securely.
- **Google APIs**: Utilized for potential email verification or other Google-related functionalities.

## Key Features

- User Registration: Automates the process of creating a new user account with random credentials.
- Email Verification: Implements a manual email verification step.
- Product Selection: Automatically selects a product and adds it to the cart.
- Checkout Process: Simulates the entire checkout flow, including form filling and shipping selection.
- Payment Simulation: Demonstrates the ability to handle complex e-commerce transactions.

## Technical Highlights

- **Asynchronous Programming**: Leverages Node.js's asynchronous capabilities for efficient web interactions.
- **Browser Automation**: Utilizes Playwright for cross-browser testing and interaction simulation.
- **Environment Variable Management**: Implements secure handling of sensitive information using dotenv.
- **TypeScript Integration**: Enhances code reliability and developer experience with static typing.

## Setup and Execution

1. Clone the repository:

   ```bash
   git clone https://github.com/ICEPrey/Dressin-Bot
   cd Dressin-Bot
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the project root and add the following variables:

   ```bash
   FIRST_NAME=
   LAST_NAME=
   ADDRESS=
   PHONE=
   PASSWORD=
   CITY=
   ZIP_CODE=
   CLIENT_ID=
   CLIENT_SECRET=
   REDIRECT_URIS=
   ```

4. Run the script:
   ```bash
   npm run dev
   ```

## Development Tools

- **ts-node**: For executing TypeScript files directly.
- **Gmail Tester**: A development dependency, used for automatically verifying email addresses.

## Note on Usage

This script is intended for demonstration and educational purposes only. It showcases skills in web automation, e-commerce process simulation, and handling of complex web interactions. The script should not be used for actual purchases without explicit permission from the website owners.

## Contributing

Contributions to improve the script or extend its capabilities are welcome. Please feel free to submit pull requests or open issues for discussion.

## License

This project is open-source and available under the ISC License.
