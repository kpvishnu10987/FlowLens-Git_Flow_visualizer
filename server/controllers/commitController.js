import {gql} from "graphql-request";
import { graphQLClient } from "../config/github.js";
import { processCommitsToGraph } from "../utils/processGraph.js";

export const getRepoCommits = async (req,res) => {
    const { owner , repo } = req.params;
    const branch = "main";

    const query = gql`
        query GetCommits($owner: String!, $repo: String!, $branch: String!) {
            repository(owner: $owner, name: $repo) {
                ref(qualifiedName: $branch) {
                    target {
                        ... on Commit {
                            history(first: 20) {
                                edges {
                                    node {
                                        oid
                                        message
                                        author {
                                            name
                                            date
                                        }
                                        parents(first: 2) {
                                            edges {
                                                node {
                                                    oid
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    `;

    try{
        const data = await graphQLClient.request(query,{ owner, repo, branch });
        // Let's clean up the data before sending it. 
        // GitHub wraps it efficiently but confusingly in "edges" and "nodes".

        const history = data.repository.ref.target.history.edges;
        const rawCommits = history.map(edge => {
            const node = edge.node;

            return {
                oid : node.oid,
                message : node.message,
                author : node.author.name,
                date : node.author.date,
                parents : node.parents.edges.map(parent => parent.node.oid)
            };
        });

        const graphDate = processCommitsToGraph(rawCommits);

        res.json(graphDate);


    }catch(error){
        console.error(error);
        res.status(500).json({error : error.message});
    }
}