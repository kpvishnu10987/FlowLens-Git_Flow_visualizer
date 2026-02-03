export const processCommitsToGraph = (commits) => {
    // 1. Sort by Date (Newest first) so we walk backwards in history
    const sortedCommits = [...commits].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Create a Map for easy lookup (We need to find nodes by ID quickly)
    const commitMap = new Map();
    sortedCommits.forEach((c, i) => {
        // We initialize 'lane' as null because we haven't calculated it yet
        commitMap.set(c.oid, { ...c, id: c.oid, y: i, lane: null });
    });
    
        // 2. Build Children Map (Who points to me?)
    const childrenMap = new Map();
    sortedCommits.forEach(c => {
        c.parents.forEach(p => {
            if (!childrenMap.has(p)) childrenMap.set(p, []);
            childrenMap.get(p).push(c.oid);
        });
    });

    // 3. Lane Assignment (The Greedy Loop)
    const nodes = [];
    
    sortedCommits.forEach((rawCommit) => {
        const commit = commitMap.get(rawCommit.oid);
        const children = childrenMap.get(commit.id) || [];
        
        let assignedLane = null;

        // CHECK: Can I inherit a lane from a child?
        for (const childOid of children) {
            const childNode = commitMap.get(childOid);
            // Must be a valid child with a lane
            if (childNode && childNode.lane !== null) {
                // Rule: Am I the FIRST parent? (The main line)
                if (childNode.parents[0] === commit.id) {
                    assignedLane = childNode.lane;
                    break; // Found my lane, stop looking
                }
            }
        }

        // FALLBACK: If no child gave me a lane, I need a new one.
        if (assignedLane === null) {
            // In a pro app, we'd find the first "Free" lane.
            // For learning, we'll just check existing nodes to find the next max number.
            const existingLanes = nodes.map(n => n.lane);
            const maxLane = existingLanes.length > 0 ? Math.max(...existingLanes) : -1;
            assignedLane = maxLane + 1;
        }

        commit.lane = assignedLane;
        nodes.push(commit);
    });

        // 3. Prepare Links (Optimized)
    const links = [];
    nodes.forEach(node => {
        node.parents.forEach(parentOid => {
            // FAST: Immediate lookup in the Map
            if (commitMap.has(parentOid)) {
                links.push({
                    source: parentOid, // Parent is older
                    target: node.id    // Child is newer
                });
            }
        });
    });

    return { nodes, links };
};