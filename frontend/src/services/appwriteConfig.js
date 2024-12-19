import { Client, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject("676309f0000a04d06e1c"); // Your Appwrite project ID

const account = new Account(client);

export { client, account };
