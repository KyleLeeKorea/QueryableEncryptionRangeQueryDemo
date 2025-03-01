# Node.js Queryable Encryption Tutorial

- This project demonstrates an example implementation of Queryable Encryption for the MongoDB Node.js driver, including examples of Equality and Range queries.
- This content has been modified and enhanced to enable Range Queries based on the following:
[MongoDB University - Queryable Encryption Examples](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption) 
- To learn more about Queryable Encryption, see the [[Queryable Encryption section]](https://www.mongodb.com/docs/manual/core/queryable-encryption/) in the Server manual.

## Install Dependencies

To run this sample application, you first need to install the following
dependencies:

- MongoDB Server version 8.0 or later
- Automatic Encryption Shared Library version 8.0 or later
- Node.js
- npm

For more information on installation requirements for {+qe+}, see [Installation Requirements](https://www.mongodb.com/docs/manual/core/queryable-encryption/install/#std-label-qe-install).

## Configure Your Environment

1. Copy the `env_template` file in the root of the project directory to a file named `.env`.

1. Replace the placeholder values in the `.env` file with your own credentials.

## Run the App

1. In a shell, navigate to the project root directory.

1. Run `npm install` to install the Node.js driver and
   `mongodb-client-encryption` packages.

   > **Note:** `mongodb-client-encryption` must be version 2.8.0 or later.
   > For more information on compatible package versions, see the
   > [Driver Compatibility Table](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/compatibility/).
   >
   > When using Node.js driver version `6.0.0` or later,
   > `mongodb-client-encryption` must have the same major version number as the driver.

1. In `queryable-encryption-tutorial.js`, replace the placeholder `<Your KMS
Provider Name>` with a valid KMS provider name.

1. Run `node queryable-encryption-tutorial` to start the app.

1. If successful, the application will print a document to the console.
