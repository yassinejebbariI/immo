import express from 'express';
import Visit from '../models/Visit';
import Property from '../models/Property';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { propertyId, scheduledDate, notes } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const visit = new Visit({
      propertyId,
      clientId: req.userId,
      agencyId: property.agencyId,
      scheduledDate,
      notes
    });

    await visit.save();
    res.status(201).json(visit);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my-visits', authenticate, async (req: AuthRequest, res) => {
  try {
    const visits = await Visit.find({ clientId: req.userId })
      .populate('propertyId')
      .populate('agencyId', 'name companyName phone email')
      .sort({ scheduledDate: -1 });

    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/agency-visits', authenticate, async (req: AuthRequest, res) => {
  try {
    const visits = await Visit.find({ agencyId: req.userId })
      .populate('propertyId')
      .populate('clientId', 'name phone email')
      .sort({ scheduledDate: -1 });

    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    
    const visit = await Visit.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' });
    }

    res.json(visit);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
