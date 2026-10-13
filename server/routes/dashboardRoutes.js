import express from 'express';
import {
  mockDashboardMetrics,
  mockOccupancyData,
  mockRevenueByCategory
} from '../../src/data/mock/mockData.js';

const router = express.Router();

router.get('/metrics', async (req, res) => {
  return res.json({
    metrics: mockDashboardMetrics,
    occupancyTrend: mockOccupancyData,
    revenueByCategory: mockRevenueByCategory,
  });
});

export default router;
