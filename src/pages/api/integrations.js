import integrations from '../../data/integrations.json';

export default function handler(req, res) {
  res.status(200).json(integrations);
}
