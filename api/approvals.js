/**
 * APPROVALS API ENDPOINT
 * Handles creation of approval requests from AI optimization recommendations
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://uunqqpqyehxjodvozlgu.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseKey) {
  throw new Error('SUPABASE_ANON_KEY not set');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * POST /api/approvals
 * Create a new approval request
 */
async function createApproval(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      agent,
      title,
      description,
      recommendation_id,
      recommendation_type,
      recommended_action,
      potential_impact,
      priority,
      risk,
    } = req.body;

    // Validate required fields
    if (!agent || !title || !description) {
      return res.status(400).json({ error: 'Missing required fields: agent, title, description' });
    }

    // Create approval record in Supabase
    const { data, error } = await supabase.from('approvals').insert({
      agent,
      title,
      description,
      risk: risk || 'MEDIUM',
      value: potential_impact,
      icon_type: 'optimization',
      color: priority === 'high' ? '#EF4444' : priority === 'medium' ? '#F59E0B' : '#22C55E',
      status: 'pending',
      metadata: {
        recommendation_id,
        recommendation_type,
        recommended_action,
        potential_impact,
        priority,
      },
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to create approval', details: error.message });
    }

    // Log the recommendation
    console.log(`✅ Optimization recommendation created:`, {
      id: data?.[0]?.id,
      agent,
      title,
      priority,
      action: recommended_action,
    });

    // Post to Discord if webhook available
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await postToDiscord({
          agent,
          title,
          description,
          potential_impact,
          priority,
          action: recommended_action,
        });
      } catch (discordError) {
        console.warn('Discord post failed (non-blocking):', discordError.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Recommendation submitted for approval',
      approval_id: data?.[0]?.id,
      agent,
      title,
    });
  } catch (error) {
    console.error('Error in createApproval:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

/**
 * Post optimization recommendation to Discord
 */
async function postToDiscord({ agent, title, description, potential_impact, priority, action }) {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return;

  const priorityEmoji = {
    high: '🔴',
    medium: '🟡',
    low: '🟢',
  };

  const embed = {
    title: `${priorityEmoji[priority]} ${title}`,
    description: description,
    fields: [
      {
        name: 'Agent',
        value: agent,
        inline: true,
      },
      {
        name: 'Action',
        value: action,
        inline: true,
      },
      {
        name: 'Potential Impact',
        value: potential_impact,
        inline: false,
      },
    ],
    color: priority === 'high' ? 0xef4444 : priority === 'medium' ? 0xf59e0b : 0x22c55e,
    footer: {
      text: 'AI Optimization Recommendation',
    },
  };

  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: `**${priority.toUpperCase()} PRIORITY:** Optimization recommendation waiting for approval`,
      embeds: [embed],
    }),
  });

  if (!response.ok) {
    throw new Error(`Discord webhook failed: ${response.status}`);
  }
}

/**
 * GET /api/approvals
 * Fetch pending recommendations
 */
async function getApprovals(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('approvals')
      .select('*')
      .eq('status', 'pending')
      .eq('icon_type', 'optimization')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      recommendations: data,
    });
  } catch (error) {
    console.error('Error in getApprovals:', error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * PUT /api/approvals/:id
 * Update approval status (approve/deny)
 */
async function updateApproval(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const { status, notes } = req.body;

    if (!id || !status) {
      return res.status(400).json({ error: 'Missing id or status' });
    }

    if (!['approved', 'denied'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be approved or denied' });
    }

    const { data, error } = await supabase
      .from('approvals')
      .update({
        status,
        decided_at: new Date().toISOString(),
        notes,
      })
      .eq('id', id)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    console.log(`✅ Recommendation ${status}:`, {
      id,
      agent: data?.[0]?.agent,
      title: data?.[0]?.title,
    });

    return res.status(200).json({
      success: true,
      message: `Recommendation ${status}`,
      approval: data?.[0],
    });
  } catch (error) {
    console.error('Error in updateApproval:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Router
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (req.method === 'POST') {
    return createApproval(req, res);
  } else if (req.method === 'GET') {
    return getApprovals(req, res);
  } else if (req.method === 'PUT' && id) {
    return updateApproval(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};
