import { GraphQLClient } from 'graphql-request';
import dotenv from 'dotenv';

dotenv.config();

const endpoint = 'https://api.github.com/graphql';

export const graphQLClient = new GraphQLClient(endpoint,{
    headers:{
        authorization : `Bearer ${process.env.GITHUB_TOKEN}`
    },
});