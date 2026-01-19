import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Color debe ser Hexadecimal (ej: #FF0000)"),
  userId: z.string(),
  createdAt: z.string().datetime().optional()
});