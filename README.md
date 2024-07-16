# Dressin.com Automation Script

This script is designed to automate the process of placing an order on Dressin.com. It simulates user interactions to navigate through the website, select products, fill out forms, and complete the checkout process.

## Features

- Registers a new user with a random email and password
- Verifies the email manually
- Selects a product and adds it to the cart
- Proceeds to checkout and fills out the checkout form
- Selects standard shipping and uses points
- Places the order using a credit card

## Requirements

- Node.js installed on the system
- Puppeteer library installed (run `npm install puppeteer` to install)
- Environment variables for FIRST_NAME, LAST_NAME, ADDRESS, PHONE, and PASSWORD set

## How to Run

1. Clone the repository and navigate to the project directory.
2. Install the required dependencies by running `npm install`.
3. Set the environment variables for FIRST_NAME, LAST_NAME, ADDRESS, PHONE, and PASSWORD.
4. Run the script using `node index.ts`.

## Note

This script is for demonstration purposes only and should not be used for actual purchases without the consent of the website owners. Additionally, the script may need to be updated if the website structure or functionality changes.
