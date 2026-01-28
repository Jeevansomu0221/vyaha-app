import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory stores
interface User { id: string; role: 'customer' | 'partner' | 'delivery'; name?: string }
interface OrderItem { id: string; name: string; quantity: number }
interface Order {
  id: string;
  customerId: string;
  partnerId: string;
  items: OrderItem[];
  status: 'PLACED' | 'ACCEPTED_BY_PARTNER' | 'ASSIGNED_TO_COURIER' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  deliveryAgentId?: string;
}

const users = new Map<string, User>();
const orders = new Map<string, Order>();

// Very simple token middleware using user id as token for MVP
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.header('authorization') || req.header('Authorization');
  if (!auth) return res.status(401).json({ message: 'Missing Authorization header' });
  const token = auth.replace('Bearer ', '').trim();
  const user = users.get(token);
  if (!user) return res.status(401).json({ message: 'Invalid token' });
  (req as any).user = user;
  next();
}

// Seed a few users
const customerId = uuidv4();
const partnerId = uuidv4();
const courierId = uuidv4();
users.set(customerId, { id: customerId, role: 'customer', name: 'Demo Customer' });
users.set(partnerId, { id: partnerId, role: 'partner', name: 'Demo Partner' });
users.set(courierId, { id: courierId, role: 'delivery', name: 'Demo Courier' });

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Auth: return a token for demo
app.post('/api/auth/demo', (req, res) => {
  const role = String(req.body?.role || 'customer');
  const user = role === 'partner' ? users.get(partnerId) : role === 'delivery' ? users.get(courierId) : users.get(customerId);
  res.json({ token: user!.id, user });
});

// Place order (customer)
const placeOrderSchema = z.object({
  partnerId: z.string().uuid(),
  items: z.array(z.object({ name: z.string(), quantity: z.number().int().positive() })).min(1),
});

app.post('/api/orders', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  if (user.role !== 'customer') return res.status(403).json({ message: 'Only customers can place orders' });
  const parse = placeOrderSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ message: 'Invalid body', issues: parse.error.issues });

  const now = new Date().toISOString();
  const id = uuidv4();
  const order: Order = {
    id,
    customerId: user.id,
    partnerId: parse.data.partnerId,
    items: parse.data.items.map((i, idx) => ({ id: `${id}-${idx}`, name: i.name, quantity: i.quantity })),
    status: 'PLACED',
    createdAt: now,
    updatedAt: now,
  };
  orders.set(id, order);
  res.status(201).json(order);
});

// Partner accepts order
app.post('/api/orders/:id/accept', requireAuth, (req, res) => {
  const user = (req as any).user as User;
  if (user.role !== 'partner') return res.status(403).json({ message: 'Only partners can accept orders' });
  const order = orders.get(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.partnerId !== user.id) return res.status(403).json({ message: 'Cannot accept order for another partner' });
  if (order.status !== 'PLACED') return res.status(400).json({ message: 'Order cannot be accepted in current state' });
  order.status = 'ACCEPTED_BY_PARTNER';
  order.updatedAt = new Date().toISOString();
  res.json(order);
});

// Courier accepts assignment
app.post('/api/orders/:id/assign', requireAuth, (req, res) => {
  const user = (req as any).user as User;
  if (user.role !== 'delivery') return res.status(403).json({ message: 'Only delivery agents can accept assignment' });
  const order = orders.get(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.status !== 'ACCEPTED_BY_PARTNER') return res.status(400).json({ message: 'Order not ready for assignment' });
  order.status = 'ASSIGNED_TO_COURIER';
  order.deliveryAgentId = user.id;
  order.updatedAt = new Date().toISOString();
  res.json(order);
});

// Courier marks picked up
app.post('/api/orders/:id/pickup', requireAuth, (req, res) => {
  const user = (req as any).user as User;
  const order = orders.get(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (user.role !== 'delivery' || order.deliveryAgentId !== user.id) return res.status(403).json({ message: 'Only assigned courier can pick up' });
  if (order.status !== 'ASSIGNED_TO_COURIER') return res.status(400).json({ message: 'Order not in courier assignment state' });
  order.status = 'PICKED_UP';
  order.updatedAt = new Date().toISOString();
  res.json(order);
});

// Courier marks delivered
app.post('/api/orders/:id/deliver', requireAuth, (req, res) => {
  const user = (req as any).user as User;
  const order = orders.get(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (user.role !== 'delivery' || order.deliveryAgentId !== user.id) return res.status(403).json({ message: 'Only assigned courier can deliver' });
  if (order.status !== 'PICKED_UP') return res.status(400).json({ message: 'Order not picked up yet' });
  order.status = 'DELIVERED';
  order.updatedAt = new Date().toISOString();
  res.json(order);
});

// Get my orders (customer)
app.get('/api/orders/my', requireAuth, (req, res) => {
  const user = (req as any).user as User;
  if (user.role !== 'customer') return res.status(403).json({ message: 'Only customers can view their orders' });
  const list = Array.from(orders.values()).filter(o => o.customerId === user.id);
  res.json(list);
});

// Get order by id (any role involved)
app.get('/api/orders/:id', requireAuth, (req, res) => {
  const user = (req as any).user as User;
  const order = orders.get(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  const isRelated = [order.customerId, order.partnerId, order.deliveryAgentId].includes(user.id);
  if (!isRelated) return res.status(403).json({ message: 'Not authorized to view this order' });
  res.json(order);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
  console.log('Demo tokens:', { customerId, partnerId, courierId });
});
