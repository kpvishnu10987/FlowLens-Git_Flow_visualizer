export const processCommitsToGraph = (commits) => {
    // 1. Prepare Nodes
    // We map purely to the format D3 expects.
    const nodes = commits.map((commit, index) => ({
        id: commit.oid,
        message: commit.message,
        author: commit.author,
        date: commit.date,
        // We'll calculate x/y later. For now, y is just time (index).
        // In a real app, Y would be based on timestamp, but index is easier for now.
        fy: index * 50, // Force Y: space them out vertically
    }));

    // 2. Prepare Links
    // We walk through every commit and create a link to its parents.
    const links = [];
    commits.forEach((commit) => {
        commit.parents.forEach((parentOid) => {
            // rigorous check: Does the parent actually exist in our downloaded list?
            // If we only fetched 20 commits, the last commit's parent is missing.
            // We must NOT create a link to a missing node, or D3 crashes.
            const parentExists = commits.find(c => c.oid === parentOid);
            
            if (parentExists) {
                links.push({
                    source: parentOid, // Parent is the source (older)
                    target: commit.oid // Child is the target (newer)
                });
            }
        });
    });

    return { nodes, links };
};