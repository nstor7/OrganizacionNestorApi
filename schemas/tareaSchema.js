import { z } from 'zod';

// 1. La base mínima que tienen TODOS
const baseSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
});

// 2. Esquema para los que SÍ pueden tener un proyecto (Task, Appointment, Recurrent, Todo)
const projectLinkSchema = baseSchema.extend({
  projectId: z.string().nullable().optional(),
});

export const tareaSchema = z.discriminatedUnion("type", [
  
  // KANBAN: Único con Status y Sesiones
  projectLinkSchema.extend({
    type: z.literal("task"),
    status: z.enum(["enlisted", "in_progress", "in_review", "done"]).default("enlisted"),
    deadline: z.string().datetime().optional(),
    workSessions: z.array(z.object({
      start: z.string().datetime(),
      end: z.string().datetime()
    })).default([])
  }),

  // APPOINTMENT: Bloque de tiempo fijo
  projectLinkSchema.extend({
    type: z.literal("appointment"),
    start: z.string().datetime(),
    end: z.string().datetime(),
    location: z.string().optional()
  }),

  // RECURRENT: Bloques cíclicos
  projectLinkSchema.extend({
    type: z.literal("recurrent"),
    slots: z.array(z.object({
      day: z.enum(["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]),
      startTime: z.string(),
      endTime: z.string()
    }))
  }),

  // TODO: Lista con urgencia y deadline opcional
  projectLinkSchema.extend({
    type: z.literal("todo"),
    urgency: z.enum(["idea", "pending", "today", "done"]),
    deadline: z.string().datetime().optional()
  }),

  // BIRTHDAY: No tiene proyecto, solo título y fecha
  baseSchema.extend({
    type: z.literal("birthday"),
    date: z.string().regex(/^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
  })
]);

export const updateTareaSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  projectId: z.string().nullable().optional(),
  type: z.enum(["task", "appointment", "recurrent", "todo", "birthday"]),
  status: z.enum(["enlisted", "in_progress", "in_review", "done"]),
  deadline: z.string().datetime().optional(),
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  location: z.string().optional(),
  date: z.string().regex(/^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).optional(),
  urgency: z.enum(["idea", "pending", "today", "done"]),
  workSessions: z.array(z.object({
    start: z.string().datetime(),
    end: z.string().datetime()
  })).optional(),
  slots: z.array(z.object({
    day: z.enum(["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]),
    startTime: z.string(),
    endTime: z.string()
  })).optional()
});