import express from 'express';
import User from '../models/User';
import Property from '../models/Property';
import { UserRole } from '@peec/shared';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const agencies = await User.find({ role: UserRole.AGENCY, verified: true })
      .select('-password');
    res.json(agencies);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const agency = await User.findOne({ _id: req.params.id, role: UserRole.AGENCY })
      .select('-password');
    
    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }

    const properties = await Property.find({ agencyId: req.params.id, status: 'verified' });

    res.json({ agency, properties });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
