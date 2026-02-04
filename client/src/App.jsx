import { useState, useEffect } from 'react';
import CommitGraph from './components/CommitGraph';
import { fetchCommits } from './services/api';

function App() {
  const [repoDetails,setRepoDetails] = useState({owner : 'facebook',repo : 'react'})
  const [data, setData] = useState(null);
  const [selectedCommit, setSelectedCommit] = useState(null);

  useEffect(() => {
    fetchCommits(repoDetails.owner, repoDetails.repo)
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, [repoDetails]);

  return (
    <div className="flex h-screen w-screen bg-slate-900 text-slate-200 overflow-hidden font-sans">

      {/* SIDEBAR (Restored FlowLens Design) */}
      <aside className="w-80 bg-slate-800/50 border-r border-slate-700 flex flex-col p-6 backdrop-blur-md">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          FlowLens
        </h1>
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-8">Git Visualizer</p>

        {/* Stats Card */}
        <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50 mb-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-1">Active Repo</h3>
          <p className="text-lg font-mono text-blue-300">{repoDetails.owner}/{repoDetails.repo}</p>
          <div className="mt-4 flex justify-between text-xs text-slate-400">
            <span>Commits Loaded:</span>
            <span className="text-white">{data?.nodes?.length || 0}</span>
          </div>
        </div>

        {/* Selected Commit Detail */}
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Inspector</h3>
          {selectedCommit ? (
            <div className="space-y-4 animate-in slide-in-from-left-2 fade-in duration-300">
              <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <p className="text-xs text-slate-400 mb-1">Commit Hash</p>
                <p className="font-mono text-xs text-blue-300 select-all">{selectedCommit.id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Message</p>
                <p className="text-sm text-white leading-relaxed">{selectedCommit.message}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Author</p>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs text-purple-300 mr-2">
                    {selectedCommit.author[0]}
                  </div>
                  <span className="text-sm">{selectedCommit.author}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-700 rounded-lg">
              <p className="text-sm text-slate-600 italic">Select a commit</p>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-900 to-black">
        {/* Floating Header */}
        <div className="absolute top-4 left-6 z-10 px-4 py-2 bg-slate-800/80 rounded-full border border-slate-600/30 text-xs backdrop-blur-sm text-slate-400 shadow-xl">
          Viewing: <span className="text-white font-medium">Main Branch</span>
        </div>

        {/* The Graph */}
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          {data && data.nodes? (
            <CommitGraph nodes={data.nodes} links={data.links} onSelect={setSelectedCommit} />
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <div className="text-blue-400 text-sm animate-pulse">Analyzing Repository...</div>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}

export default App;