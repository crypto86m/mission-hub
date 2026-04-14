import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, Zap, RefreshCw, ArrowRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Approvals() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, approved, denied, all
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [actionNotes, setActionNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  // Fetch all approvals
  const fetchApprovals = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('approvals').select('*');
      
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }
      
      const { data, error } = await query.order('requested_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching approvals:', error);
      } else {
        setApprovals(data || []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Subscribe to real-time changes
  useEffect(() => {
    fetchApprovals();
    
    const channel = supabase
      .channel('approvals-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'approvals' },
        () => fetchApprovals()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchApprovals]);

  // Handle approval action (approve/deny/execute)
  const handleAction = async (approvalId, action, notes = '') => {
    setProcessing(true);
    try {
      const updateData = {
        status: action,
        decided_at: new Date().toISOString(),
      };

      if (notes) {
        updateData.payload = JSON.stringify({
          ...JSON.parse(selectedApproval?.payload || '{}'),
          notes,
          action_taken_at: new Date().toISOString(),
        });
      }

      const { error } = await supabase
        .from('approvals')
        .update(updateData)
        .eq('id', approvalId);

      if (error) {
        console.error('Update error:', error);
        alert('Error updating approval: ' + error.message);
      } else {
        setSelectedApproval(null);
        setActionNotes('');
        fetchApprovals();
      }
    } catch (error) {
      console.error('Action error:', error);
      alert('Error: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  // Execute an approved action
  const executeApproval = async (approval) => {
    setProcessing(true);
    try {
      // Parse payload to get execution details
      const payload = JSON.parse(approval.payload || '{}');
      
      console.log(`🚀 Executing: ${approval.agent_type} - ${approval.description}`);
      
      // Update status to show execution started
      const { error: updateError } = await supabase
        .from('approvals')
        .update({
          payload: JSON.stringify({
            ...payload,
            exec_status: 'executing',
            exec_at: new Date().toISOString(),
          }),
        })
        .eq('id', approval.id);

      if (updateError) throw updateError;

      // Simulate execution (replace with actual agent execution logic)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mark as executed
      const { error: execError } = await supabase
        .from('approvals')
        .update({
          payload: JSON.stringify({
            ...payload,
            exec_status: 'executed',
            exec_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
          }),
        })
        .eq('id', approval.id);

      if (execError) throw execError;

      console.log('✅ Execution complete');
      fetchApprovals();
    } catch (error) {
      console.error('Execution error:', error);
      alert('Execution failed: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

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

  const pendingCount = approvals.filter(a => a.status === 'pending').length;
  const approvedCount = approvals.filter(a => a.status === 'approved').length;

  return (
    <div className="space-y-4 p-4 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Approvals Manager</h1>
          <p className="text-sm text-gray-400">
            {pendingCount} pending • {approvedCount} approved • {approvals.length} total
          </p>
        </div>
        <button
          onClick={() => fetchApprovals()}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-cyan/20 text-cyan border border-cyan/30 hover:bg-cyan/40 flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {['pending', 'approved', 'denied', 'all'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-cyan/30 text-cyan border border-cyan/50'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8 text-gray-400">
          <RefreshCw className="animate-spin mx-auto mb-2" />
          Loading approvals...
        </div>
      )}

      {/* Empty State */}
      {!loading && approvals.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <AlertTriangle size={32} className="mx-auto mb-2 opacity-50" />
          <p>No {filter === 'all' ? '' : filter} approvals found</p>
        </div>
      )}

      {/* Approvals Grid */}
      {!loading && approvals.length > 0 && (
        <div className="grid gap-3">
          {approvals.map(approval => {
            const payload = JSON.parse(approval.payload || '{}');
            const isExecuted = payload.exec_status === 'executed';
            const isExecuting = payload.exec_status === 'executing';

            return (
              <div
                key={approval.id}
                onClick={() => setSelectedApproval(approval)}
                className={`glass-card p-4 cursor-pointer transition-all border ${
                  selectedApproval?.id === approval.id
                    ? 'border-cyan/50 bg-cyan/10'
                    : 'border-gray-700/50 hover:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-mono border flex items-center gap-1 ${statusColors[approval.status]}`}>
                        {statusIcons[approval.status]}
                        {approval.status.toUpperCase()}
                      </span>
                      <span className="text-[10px] px-2 py-1 rounded bg-gray-800/50 text-gray-400">
                        {approval.agent_type}
                      </span>
                      {isExecuted && (
                        <span className="text-[10px] px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                          ✅ EXECUTED
                        </span>
                      )}
                      {isExecuting && (
                        <span className="text-[10px] px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse">
                          🔄 EXECUTING
                        </span>
                      )}
                    </div>
                    <p className="font-medium text-white mb-1">{approval.description}</p>
                    <p className="text-[11px] text-gray-500">
                      Requested: {new Date(approval.requested_at).toLocaleString()}
                    </p>
                    {approval.decided_at && (
                      <p className="text-[11px] text-gray-500">
                        Decided: {new Date(approval.decided_at).toLocaleString()}
                      </p>
                    )}
                    {payload.exec_at && (
                      <p className="text-[11px] text-gray-500">
                        Execution: {new Date(payload.exec_at).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {approval.status === 'pending' && (
                      <>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleAction(approval.id, 'approved', actionNotes);
                          }}
                          disabled={processing}
                          className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/40 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleAction(approval.id, 'denied', actionNotes);
                          }}
                          disabled={processing}
                          className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/40 disabled:opacity-50"
                        >
                          Deny
                        </button>
                      </>
                    )}

                    {approval.status === 'approved' && !isExecuted && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          executeApproval(approval);
                        }}
                        disabled={processing || isExecuting}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-cyan/20 text-cyan border border-cyan/30 hover:bg-cyan/40 disabled:opacity-50 flex items-center gap-1 justify-center"
                      >
                        <Zap size={12} />
                        Execute
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Panel */}
      {selectedApproval && (
        <div className="glass-card p-6 border border-cyan/30 bg-cyan/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Details</h2>
            <button
              onClick={() => setSelectedApproval(null)}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500 text-xs">AGENT</p>
              <p className="font-medium">{selectedApproval.agent_type}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">DESCRIPTION</p>
              <p className="font-medium">{selectedApproval.description}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">STATUS</p>
              <span className={`inline-block px-2 py-1 rounded text-xs font-mono border ${statusColors[selectedApproval.status]}`}>
                {selectedApproval.status.toUpperCase()}
              </span>
            </div>
            {JSON.parse(selectedApproval.payload || '{}').exec_log && (
              <div>
                <p className="text-gray-500 text-xs">EXECUTION LOG</p>
                <p className="font-mono text-[11px] bg-gray-900 p-2 rounded overflow-auto max-h-32">
                  {JSON.parse(selectedApproval.payload || '{}').exec_log}
                </p>
              </div>
            )}
          </div>

          {/* Action Section */}
          {selectedApproval.status === 'pending' && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <textarea
                value={actionNotes}
                onChange={e => setActionNotes(e.target.value)}
                placeholder="Optional notes for this decision..."
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm text-white placeholder-gray-500 focus:border-cyan focus:outline-none mb-3 resize-none h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(selectedApproval.id, 'approved', actionNotes)}
                  disabled={processing}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-bold bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/40 disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(selectedApproval.id, 'denied', actionNotes)}
                  disabled={processing}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/40 disabled:opacity-50"
                >
                  Deny
                </button>
              </div>
            </div>
          )}

          {selectedApproval.status === 'approved' && !JSON.parse(selectedApproval.payload || '{}').exec_status?.includes('executed') && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <button
                onClick={() => executeApproval(selectedApproval)}
                disabled={processing}
                className="w-full px-4 py-2 rounded-lg text-sm font-bold bg-cyan/20 text-cyan border border-cyan/30 hover:bg-cyan/40 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Zap size={16} />
                Execute Now
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
