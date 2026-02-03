export const fetchCommits = async (owner , repo) => {
    const response = await fetch(`http://localhost:3000/api/commits/${owner}/${repo}`);
    if(!response.ok){
        throw new Error('Network response was not ok');
    }
    return response.json();
}