// lib/dependency_graph.js
const fetch = require('node-fetch');
const { FIGMA_TOKEN } = require('../config.js');

const NODE_CACHE = new Map();
const FALLBACK_REF_MAP = new Map(); // Maps MasterID -> InstanceID (The "Proxy")
const PREFERRED_NAME_MAP = new Map(); // Maps MasterID -> Pretty Name

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchNodeWithRetry(fileKey, nodeId, retries = 5) {
    if (NODE_CACHE.has(nodeId)) return NODE_CACHE.get(nodeId);

    const cleanId = nodeId.replace('-', ':');
    const url = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${cleanId}`;

    for (let i = 0; i < retries; i++) {
        try {
            await sleep(200 * (i + 1));
            const res = await fetch(url, { headers: { 'X-Figma-Token': FIGMA_TOKEN } });

            if (res.status === 429) {
                console.warn(`[GRAPH] ⏳ Rate limit (429) on ${nodeId}. Waiting 5s...`);
                await sleep(5000);
                continue;
            }

            if (!res.ok) throw new Error(`Status ${res.status}`);
            const data = await res.json();
            const node = Object.values(data.nodes)[0]?.document;

            if (node) {
                NODE_CACHE.set(nodeId, node);
                return node;
            }
            return null;
        } catch (e) {
            if (i === retries - 1) {
                console.error(`[GRAPH] ❌ Failed to fetch ${nodeId}: ${e.message}`);
                return null;
            }
        }
    }
}

// ✅ STRICT SCANNER: Finds ONLY direct dependencies
// Returns list of { masterId, refId, name }
function scanDirectDependencies(node, found = []) {
    if (!node) return found;

    if (node.type === 'INSTANCE') {
        // Found a black box. Record it and STOP recursing.
        found.push({ masterId: node.componentId, refId: node.id, name: node.name });

        if (!PREFERRED_NAME_MAP.has(node.componentId)) {
            PREFERRED_NAME_MAP.set(node.componentId, node.name);
        }
        return found;
    }

    // If Frame/Group/Component, keep digging for Instances
    if (node.children) {
        node.children.forEach(c => scanDirectDependencies(c, found));
    }
    return found;
}

async function generateBuildPlan(fileKey, rootNodeId) {
    console.log(`[GRAPH] 🕸️  Scanning dependency tree starting from ${rootNodeId}...`);

    const visited = new Set();
    const buildOrder = [];
    const idDependencyMap = {};
    const masterIdToName = {};

    async function visit(nodeId) {
        if (!nodeId || visited.has(nodeId)) return;
        visited.add(nodeId);

        // 1. Try fetching the Master Node
        let node = await fetchNodeWithRetry(fileKey, nodeId);

        // 2. EMPTY MASTER CHECK
        // If the Master is empty (no children), try to use the Fallback Instance
        const fallbackId = FALLBACK_REF_MAP.get(nodeId);
        let usedFallback = false;

        if ((!node || !node.children || node.children.length === 0) && fallbackId) {
            // console.log(`[GRAPH] ⚠️ Master ${nodeId} empty. Scanning Instance proxy ${fallbackId}...`);
            const fallbackNode = await fetchNodeWithRetry(fileKey, fallbackId);
            if (fallbackNode) {
                node = fallbackNode;
                usedFallback = true;
            }
        }

        if (!node) return;

        // Name Resolution
        const rawName = PREFERRED_NAME_MAP.get(nodeId) || node.name;
        const cleanName = rawName.replace(/[^a-zA-Z0-9]/g, '');
        masterIdToName[nodeId] = cleanName;

        // 3. Scan for Children
        let childRefs = [];

        if (usedFallback && node.type === 'INSTANCE') {
            // SPECIAL CASE: We are scanning a Proxy Instance to fake the Master's data.
            // Since scanDirectDependencies stops at INSTANCE, passing the root Instance 
            // would return just itself. We must manually scan its *children*.
            if (node.children) {
                node.children.forEach(c => scanDirectDependencies(c, childRefs));
            }
        } else {
            // Normal behavior
            scanDirectDependencies(node, childRefs);
        }

        const uniqueChildren = [];
        const seenChildren = new Set();

        for (const child of childRefs) {
            if (child.masterId === nodeId) continue;

            if (!seenChildren.has(child.masterId)) {
                seenChildren.add(child.masterId);
                uniqueChildren.push(child);

                // Save the fallback for the child! 
                // This propagates the "Proxy" ability down the tree.
                if (!FALLBACK_REF_MAP.has(child.masterId)) {
                    FALLBACK_REF_MAP.set(child.masterId, child.refId);
                }
            }
        }

        // Record Dependencies (ID based)
        idDependencyMap[nodeId] = uniqueChildren.map(c => c.masterId);

        // 4. RECURSE (DFS) - Visit Children
        for (const child of uniqueChildren) {
            await visit(child.masterId);
        }

        // 5. Post-Order Push (Leaves First)
        buildOrder.push({
            id: nodeId,
            name: cleanName,
            type: node.type,
            refId: fallbackId || null
        });
    }

    // Seed Root
    const rootNode = await fetchNodeWithRetry(fileKey, rootNodeId);
    if (rootNode) PREFERRED_NAME_MAP.set(rootNodeId, rootNode.name);

    await visit(rootNodeId);

    // 6. CONVERT TO NAMES
    const finalDependencyMap = {};
    Object.keys(idDependencyMap).forEach(parentId => {
        const parentName = masterIdToName[parentId];
        const childIds = idDependencyMap[parentId];
        if (parentName && childIds) {
            finalDependencyMap[parentName] = childIds.map(id => masterIdToName[id]).filter(Boolean);
        }
    });

    console.log(`[GRAPH] ✅ Scan complete. Discovered ${buildOrder.length} components.`);
    return { buildOrder, dependencyMap: finalDependencyMap };
}

module.exports = { generateBuildPlan, fetchNodeWithRetry };