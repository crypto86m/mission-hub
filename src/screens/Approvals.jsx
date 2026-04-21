import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, Zap, RefreshCw } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  approved: 'bg-green-500/20 text-green-400 border-green-500/30',
  denied: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusIcons = {
  pending: <Clock size={16} />,
  approved: <CheckCircle size={16} />,
  denied: <XCircle size={16} />,
};

export default function Approvals() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [actionNotes, setActionNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const isConnected = !!(SUPABASE_URL && SUPABASE_KEY);

  const fetchApprovals = useCallback(async () => {
    if (!isConnected) { setLoading(false); return; }
    setLoading(true);
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      let query = supabase.from('approvals').select('*');
      if (filter !== 'all') query = query.eq('status', filter);
      const { data, error: err } = await query.order('requested_at', { ascending: false });
      if (err) { setError(err.message); } else { setApprovals(data || []); setError(null); }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filter, isConnected]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const handleAction = async (approvalId, action) => {
    if (!isConnected) return;
    setProcessing(true);
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      const updateData = { status: action, decided_at: new Date().toISOString() };
      if (actionNotes && selectedApproval) {
        const existing = JSON.parse(selectedApproval.payload || '{}');
        updateData.payload = JSON.stringify({ ...existing, notes: actionNotes, action_taken_at: new Date().toISOString() });
      }
      const { error: err } = await supabase.from('approvals').update(updateData).eq('id', approvalId);
      if (err) { alert('Error: ' + err.message); } else { setSelectedApproval(null); setActionNotes(''); fetchApprovals(); }
    } catch (e) {
      alert('Error: ' + e.message);
    } finally {
      setProcessing(false);
    }
  };

  const executeApproval = async (approval) => {
    if (!isConnected) return;
    setProcessing(true);
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      const payload = JSON.parse(approval.payload || '{}');
      await supabase.from('approvals').update({ payload: JSON.stringify({ ...payload, exec_status: 'executing', exec_at: new Date().toISOString() }) }).eq('id', approval.id);
      await new Promise(r => setTimeout(r, 1000));
      await supabase.from('approvals').update({ payload: JSON.stringify({ ...payload, exec_status: 'executed', exec_at: new Date().toISOString(), completed_at: new Date().toISOString() }) }).eq('id', approval.id);
      fetchApprovals();
    } catch (e) {
      alert('Execution failed: ' + e.message);
    } finally {
      setProcessing(false);
    }
  };

  const pendingCount = approvals.filter(a => a.status === 'pending').length;

  return (
    <div className="p-4 pb-24 max-w-6xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Approvals Manager</h1>
          <p className="text-sm text-gray-400">
            {isConnected ? `${pendingCount} pending • ${approvals.length} total` : 'Supabase not configured'}
          </p>
        </div>
        <button onClick={fetchApprovals} disabled={loading || !isConnected} className="px-4 py-2 rounded-lg bg-cyan/20 text-cyan border border-cyan/30 hover:bg-cyan/40 flex items-center gap-2 disabled:opacity-50">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {!isConnected && (
        <div className="glass-card border-yellow-500/30 bg-yellow-500/5 p-6 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle size={20} className="text-yellow-400" />
            <h2 className="text-yellow-400 font-bold">Supabase Not Configured</h2>
          </div>
          <p className="text-gray-300 text-sm mb-3">Add these to your <code className="text-cyan">.env.local</code> file to enable approvals:</p>
          <div className="bg-black/40 rounded-lg p-3 font-mono text-xs space-y-1">
            <p className="text-cyan">VITE_SUPABASE_URL=https://uunqqpqyehxjodvozlgu.supabase.co</p>
            <p className="text-cyan">VITE_SUPABASE_ANON_KEY=your_anon_key_here</p>
          </div>
          <p className="text-gray-400 text-xs mt-3">The anon key is in mission-hub/.env.local or the old Supabase dashboard.</p>
        </div>
      )}

      {isConnected && (
        <>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {['pending', 'approved', 'denied', 'all'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-cyan/30 text-cyan border border-cyan/50' : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {error && <div className="text-red-400 text-sm mb-3 p-3 bg-red-500/10 rounded-lg">⚠️ {error}</div>}

          {loading && (
            <div className="text-center py-8 text-gray-400">
              <RefreshCw className="animate-spin mx-auto mb-2" />
              Loading approvals...
            </div>
          )}

          {!loading && approvals.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <AlertTriangle size={32} className="mx-auto mb-2 opacity-50" />
              <p>No {filter === 'all' ? '' : filter} approvals found</p>
            </div>
          )}

          {!loading && approvals.length > 0 && (
            <div className="grid gap-3">
              {approvals.map(approval => {
                const payload = JSON.parse(approval.payload || '{}');
                const isExecuted = payload.exec_status === 'executed';
                const isExecuting = payload.exec_status === 'executing';
                return (
                  <div key={approval.id} onClick={() => setSelectedApproval(approval)}
                    className={`glass-card p-4 cursor-pointer transition-all border ${selectedApproval?.id === approval.id ? 'border-cyan/50 bg-cyan/10' : 'border-gray-700/50 hover:border-gray-600'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`px-2 py-1 rounded text-xs font-mono border flex items-center gap-1 ${statusColors[approval.status]}`}>
                            {statusIcons[approval.status]}
                            {approval.status.toUpperCase()}
                          </span>
                          <span className="text-[10px] px-2 py-1 rounded bg-gray-800/50 text-gray-400">{approval.agent_type}</span>
                          {isExecuted && <span className="text-[10px] px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">✅ EXECUTED</span>}
                          {isExecuting && <span className="text-[10px] px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse">🔄 EXECUTING</span>}
                        </div>
                        <p className="font-medium text-white mb-1">{approval.description}</p>
                        <p className="text-[11px] text-gray-500">Requested: {new Date(approval.requested_at).toLocaleString()}</p>
                        {approval.decided_at && <p className="text-[11px] text-gray-500">Decided: {new Date(approval.decided_at).toLocaleString()}</p>}
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                        {approval.status === 'pending' && (
                          <>
                            <button onClick={e => { e.stopPropagation(); handleAction(approval.id, 'approved'); }} disabled={processing}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/40 disabled:opacity-50">
                              Approve
                            </button>
                            <button onClick={e => { e.stopPropagation(); handleAction(approval.id, 'denied'); }} disabled={processing}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/40 disabled:opacity-50">
                              Deny
                            </button>
                          </>
                        )}
                        {approval.status === 'approved' && !isExecuted && (
                          <button onClick={e => { e.stopPropagation(); executeApproval(approval); }} disabled={processing || isExecuting}
                            className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-cyan/20 text-cyan border border-cyan/30 hover:bg-cyan/40 disabled:opacity-50 flex items-center gap-1">
                            <Zap size={12} />Execute
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {selectedApproval && (
            <div className="glass-card p-6 border border-cyan/30 bg-cyan/5 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Details</h2>
                <button onClick={() => setSelectedApproval(null)} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              <div className="space-y-3 text-sm">
                <div><p className="text-gray-500 text-xs">AGENT</p><p className="font-medium">{selectedApproval.agent_type}</p></div>
                <div><p className="text-gray-500 text-xs">DESCRIPTION</p><p className="font-medium">{selectedApproval.description}</p></div>
                <div>
                  <p className="text-gray-500 text-xs">STATUS</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-mono border ${statusColors[selectedApproval.status]}`}>{selectedApproval.status.toUpperCase()}</span>
                </div>
              </div>
              {selectedApproval.status === 'pending' && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <textarea value={actionNotes} onChange={e => setActionNotes(e.target.value)}
                    placeholder="Optional notes for this decision..."
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm text-white placeholder-gray-500 focus:border-cyan focus:outline-none mb-3 resize-none h-20" />
                  <div className="flex gap-2">
                    <button onClick={() => handleAction(selectedApproval.id, 'approved', actionNotes)} disabled={processing}
                      className="flex-1 px-4 py-2 rounded-lg text-sm font-bold bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/40 disabled:opacity-50">
                      Approve
                    </button>
                    <button onClick={() => handleAction(selectedApproval.id, 'denied', actionNotes)} disabled={processing}
                      className="flex-1 px-4 py-2 rounded-lg text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/40 disabled:opacity-50">
                      Deny
                    </button>
                  </div>
                </div>
              )}
              {selectedApproval.status === 'approved' && !JSON.parse(selectedApproval.payload || '{}').exec_status?.includes('executed') && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <button onClick={() => executeApproval(selectedApproval)} disabled={processing}
                    className="w-full px-4 py-2 rounded-lg text-sm font-bold bg-cyan/20 text-cyan border border-cyan/30 hover:bg-cyan/40 disabled:opacity-50 flex items-center justify-center gap-2">
                    <Zap size={16} />Execute Now
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
