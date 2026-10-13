import express from 'express';
import { Housekeeping } from '../models/Housekeeping.js';
import { ServiceRequest } from '../models/ServiceRequest.js';
import { AuditLog } from '../models/AuditLog.js';
import {
  mockHousekeeping,
  mockRequests,
  mockStaff,
  mockAuditLogs
} from '../../src/data/mock/mockData.js';

const router = express.Router();

// Housekeeping
router.get('/housekeeping', async (req, res) => {
  try {
    let tasks = [];
    try { tasks = await Housekeeping.find({}); } catch { /* offline */ }
    if (!tasks || tasks.length === 0) tasks = mockHousekeeping;
    return res.json({ tasks });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.patch('/housekeeping/:id', async (req, res) => {
  const { id } = req.params;
  try {
    try { await Housekeeping.findOneAndUpdate({ $or: [{ _id: id }, { id }] }, req.body); } catch { /* offline */ }
    return res.json({ success: true, updated: req.body });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Service requests
router.get('/requests', async (req, res) => {
  try {
    let requests = [];
    try { requests = await ServiceRequest.find({}).sort({ createdAt: -1 }); } catch { /* offline */ }
    if (!requests || requests.length === 0) requests = mockRequests;
    return res.json({ requests });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/requests', async (req, res) => {
  try {
    let created = null;
    try { created = await ServiceRequest.create(req.body); } catch { created = { ...req.body, id: 'req' + Date.now() }; }
    return res.status(201).json({ request: created });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.patch('/requests/:id', async (req, res) => {
  const { id } = req.params;
  try {
    try { await ServiceRequest.findOneAndUpdate({ $or: [{ _id: id }, { id }] }, req.body); } catch { /* offline */ }
    return res.json({ success: true, updated: req.body });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Staff
router.get('/staff', async (req, res) => {
  return res.json({ staff: mockStaff });
});

// Audit logs
router.get('/audit-logs', async (req, res) => {
  try {
    let logs = [];
    try { logs = await AuditLog.find({}).sort({ createdAt: -1 }); } catch { /* offline */ }
    if (!logs || logs.length === 0) logs = mockAuditLogs;
    return res.json({ logs });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
