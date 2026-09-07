import express from 'express'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createHash } from 'crypto'
import { readFileSync, writeFileSync, existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

// ─── Password hashing (SHA-256 + salt, no external deps) ──────────────────────
function hashPassword(plain) {
  return createHash('sha256').update(plain + 'nwc-salt-2025').digest('hex')
}
function verifyPassword(plain, hashed) {
  return hashPassword(plain) === hashed
}

// ─── Initial users (passwords hashed) ────────────────────────────────────────
const INITIAL_USERS = [
  { id: 'USR-001', username: 'amerrawahneh', password: hashPassword('Rawahneh97'), name: 'Amer Rawahneh', email: 'amer.rawahneh@company.com', role: 'admin', status: 'active', department: 'IT', createdAt: '2025-01-01T08:00:00Z', lastLogin: '2026-04-14T09:30:00Z' },
  { id: 'USR-002', username: 'sara.mohammed', password: hashPassword('Sara@2025'), name: 'Sara Mohammed', email: 'sara.mohammed@company.com', role: 'manager', status: 'active', department: 'Creative', createdAt: '2025-01-05T08:00:00Z', lastLogin: '2026-04-13T14:20:00Z' },
  { id: 'USR-003', username: 'ahmed.alrashid', password: hashPassword('Ahmed@2025'), name: 'Ahmed Al-Rashid', email: 'ahmed.alrashid@company.com', role: 'team_member', status: 'active', department: 'Creative', createdAt: '2025-01-10T08:00:00Z', lastLogin: '2026-04-12T11:00:00Z' },
  { id: 'USR-004', username: 'khalid.ibrahim', password: hashPassword('Khalid@2025'), name: 'Khalid Ibrahim', email: 'khalid.ibrahim@company.com', role: 'team_member', status: 'active', department: 'Design', createdAt: '2025-01-15T08:00:00Z', lastLogin: '2026-04-11T09:00:00Z' },
  { id: 'USR-005', username: 'nour.hassan', password: hashPassword('Nour@2025'), name: 'Nour Hassan', email: 'nour.hassan@company.com', role: 'team_member', status: 'active', department: 'Translation', createdAt: '2025-02-01T08:00:00Z', lastLogin: '2026-04-10T16:00:00Z' },
  { id: 'USR-006', username: 'omar.abdullah', password: hashPassword('Omar@2025'), name: 'Omar Abdullah', email: 'omar.abdullah@company.com', role: 'team_member', status: 'active', department: 'Content', createdAt: '2025-02-10T08:00:00Z', lastLogin: '2026-04-09T10:30:00Z' },
  { id: 'USR-007', username: 'lina.farid', password: hashPassword('Lina@2025'), name: 'Lina Farid', email: 'lina.farid@company.com', role: 'team_member', status: 'active', department: 'Design', createdAt: '2025-02-15T08:00:00Z', lastLogin: '2026-04-08T13:00:00Z' },
  { id: 'USR-008', username: 'maya.yousef', password: hashPassword('Maya@2025'), name: 'Maya Yousef', email: 'maya.yousef@company.com', role: 'team_member', status: 'active', department: 'Events', createdAt: '2025-03-01T08:00:00Z', lastLogin: '2026-04-07T15:45:00Z' },
  { id: 'USR-009', username: 'faisal.alamin', password: hashPassword('Faisal@2025'), name: 'Faisal Al-Amin', email: 'faisal.alamin@company.com', role: 'viewer', status: 'active', department: 'Strategy', createdAt: '2025-03-10T08:00:00Z', lastLogin: '2026-04-05T11:00:00Z' },
  { id: 'USR-010', username: 'rania.kareem', password: hashPassword('Rania@2025'), name: 'Rania Kareem', email: 'rania.kareem@company.com', role: 'team_member', status: 'inactive', department: 'Content', createdAt: '2025-03-20T08:00:00Z', lastLogin: '2026-03-15T09:00:00Z' },
  { id: 'USR-011', username: 'mansour', password: hashPassword('Mansour@2025'), name: 'Mansour', email: 'mansour@company.com', role: 'team_member', status: 'active', department: 'Creative', createdAt: '2026-04-21T08:00:00Z', lastLogin: null },
  { id: 'USR-012', username: 'areej', password: hashPassword('Areej@2025'), name: 'Areej', email: 'areej@company.com', role: 'team_member', status: 'active', department: 'Creative', createdAt: '2026-04-21T08:00:00Z', lastLogin: null },
  { id: 'USR-013', username: 'najah', password: hashPassword('Najah@2025'), name: 'Najah', email: 'najah@company.com', role: 'team_member', status: 'active', department: 'Creative', createdAt: '2026-04-21T08:00:00Z', lastLogin: null },
  { id: 'USR-014', username: 'team', password: hashPassword('Team@2025'), name: 'Team', email: 'team@company.com', role: 'team_member', status: 'active', department: 'Creative', createdAt: '2026-04-21T08:00:00Z', lastLogin: null },
]

// ─── Initial tasks (68 tasks backed up from live site) ────────────────────────
const INITIAL_TASKS = [
  {
    "id": "TASK-070",
    "notes": "",
    "title": "ارسال اعلان تذكيري لاستخدام منصة ويبكس عبر الايميل",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-09-07",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-09-07T09:04:38.753Z",
    "recurring": null,
    "startDate": null,
    "updatedAt": "2026-09-07T09:04:38.753Z",
    "assignedTo": "Mansour",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-09-07",
    "serviceTypes": [
      "announcements"
    ],
    "requestSource": "infrastructure",
    "requesterName": "محمد المغيرة",
    "completionDate": null
  },
  {
    "id": "TASK-069",
    "notes": "",
    "title": "COE Video",
    "status": "in_progress",
    "blocker": null,
    "dueDate": "2026-09-17",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-09-06T11:11:58.250Z",
    "recurring": null,
    "startDate": null,
    "updatedAt": "2026-09-06T11:11:58.250Z",
    "assignedTo": "Team",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-09-01",
    "serviceTypes": [
      "motion_graphics_video"
    ],
    "requestSource": "it_operations",
    "requesterName": "حمزة برق الليل",
    "completionDate": null
  },
  {
    "id": "TASK-068",
    "notes": "",
    "title": "Revenue Assurance Video",
    "status": "in_progress",
    "blocker": null,
    "dueDate": "2026-09-13",
    "priority": "high",
    "checklist": [],
    "createdAt": "2026-09-06T11:03:01.843Z",
    "recurring": null,
    "startDate": null,
    "updatedAt": "2026-09-06T11:03:01.843Z",
    "assignedTo": "Team",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-09-06",
    "serviceTypes": [
      "video_"
    ],
    "requestSource": "vp_office",
    "requesterName": "ماجد الجريب",
    "completionDate": null
  },
  {
    "id": "TASK-067",
    "notes": "",
    "title": "تصوير توقيع اتفاقيات مؤتمر ليب",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-09-03",
    "priority": "high",
    "checklist": [],
    "createdAt": "2026-09-06T08:54:19.831Z",
    "recurring": null,
    "startDate": null,
    "updatedAt": "2026-09-06T08:54:19.831Z",
    "assignedTo": "Team",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-08-30",
    "serviceTypes": [
      "others"
    ],
    "requestSource": "vp_office",
    "requesterName": "ماجد الجريب",
    "completionDate": null
  },
  {
    "id": "TASK-066",
    "notes": "",
    "title": " 2تسجيل صوتي للرد الالي بمركز اتصال تقنية المعلومات والتحول الرقمي",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-09-06",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-09-06T08:53:05.824Z",
    "recurring": null,
    "startDate": null,
    "updatedAt": "2026-09-06T08:53:05.824Z",
    "assignedTo": "Team",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-09-03",
    "serviceTypes": [
      "presentation_design",
      "others"
    ],
    "requestSource": "infrastructure",
    "requesterName": "محمد المغيرة",
    "completionDate": null
  },
  {
    "id": "TASK-065",
    "notes": "",
    "title": "تصوير توقيع اتفاقيات في مؤتمر ليب",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-08-31",
    "priority": "urgent",
    "checklist": [],
    "createdAt": "2026-08-31T19:25:40.838Z",
    "recurring": null,
    "startDate": null,
    "updatedAt": "2026-08-31T19:25:40.838Z",
    "assignedTo": "Team",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-08-30",
    "serviceTypes": [
      "others"
    ],
    "requestSource": "vp_office",
    "requesterName": "ماجد الجريب",
    "completionDate": null
  },
  {
    "id": "TASK-064",
    "notes": "",
    "title": "تقصير مدة فيديوهات مبادرات الذكاء الاصطناعي",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-08-20",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-08-30T11:45:49.487Z",
    "recurring": null,
    "startDate": null,
    "updatedAt": "2026-08-30T11:45:49.487Z",
    "assignedTo": "Mansour",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-08-19",
    "serviceTypes": [
      "video_"
    ],
    "requestSource": "digital_transformation",
    "requesterName": "عبيد العنزي",
    "completionDate": null
  },
  {
    "id": "TASK-063",
    "notes": "",
    "title": "عرض مبادرات الذكاء الاصطناعي",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-08-20",
    "priority": "medium",
    "checklist": [
      {
        "id": "cl-1",
        "text": "Receive content from requester",
        "completed": false
      },
      {
        "id": "cl-2",
        "text": "Apply brand template",
        "completed": false
      },
      {
        "id": "cl-3",
        "text": "Internal review",
        "completed": false
      },
      {
        "id": "cl-4",
        "text": "Deliver to requester",
        "completed": false
      }
    ],
    "createdAt": "2026-08-30T11:44:24.301Z",
    "recurring": null,
    "startDate": null,
    "updatedAt": "2026-08-30T11:44:24.301Z",
    "assignedTo": "Mansour",
    "templateId": "tpl-1",
    "attachments": [],
    "description": "",
    "requestDate": "2026-08-19",
    "serviceTypes": [
      "presentation_design"
    ],
    "requestSource": "digital_transformation",
    "requesterName": "عبيد العنزي",
    "completionDate": null
  },
  {
    "id": "TASK-062",
    "notes": "",
    "title": "قطاع العناية بالعملاء والتحول الرقمي 2026 - النسخة النهائية",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-08-24",
    "priority": "medium",
    "checklist": [
      {
        "id": "cl-1",
        "text": "Receive content from requester",
        "completed": false
      },
      {
        "id": "cl-2",
        "text": "Apply brand template",
        "completed": false
      },
      {
        "id": "cl-3",
        "text": "Internal review",
        "completed": false
      },
      {
        "id": "cl-4",
        "text": "Deliver to requester",
        "completed": false
      }
    ],
    "createdAt": "2026-08-30T11:43:14.507Z",
    "recurring": null,
    "startDate": null,
    "updatedAt": "2026-08-30T11:43:14.507Z",
    "assignedTo": "Team",
    "templateId": "tpl-1",
    "attachments": [],
    "description": "",
    "requestDate": "2026-08-23",
    "serviceTypes": [
      "presentation_design"
    ],
    "requestSource": "applications",
    "requesterName": "عمار فلاتة",
    "completionDate": null
  },
  {
    "id": "TASK-061",
    "notes": "",
    "title": "SANAD | Service Now",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-08-26",
    "priority": "medium",
    "checklist": [
      {
        "id": "cl-1",
        "text": "Receive content from requester",
        "completed": false
      },
      {
        "id": "cl-2",
        "text": "Apply brand template",
        "completed": false
      },
      {
        "id": "cl-3",
        "text": "Internal review",
        "completed": false
      },
      {
        "id": "cl-4",
        "text": "Deliver to requester",
        "completed": false
      }
    ],
    "createdAt": "2026-08-30T11:41:56.512Z",
    "recurring": null,
    "startDate": null,
    "updatedAt": "2026-08-30T11:41:56.512Z",
    "assignedTo": "Mansour",
    "templateId": "tpl-1",
    "attachments": [],
    "description": "",
    "requestDate": "2026-08-25",
    "serviceTypes": [
      "presentation_design"
    ],
    "requestSource": "applications",
    "requesterName": "عمار فلاتة ",
    "completionDate": null
  },
  {
    "id": "TASK-060",
    "notes": "",
    "title": "إعلان الإطـــــــلاق التمهيدي لمنصة الدخول الموحد",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-08-30",
    "priority": "medium",
    "checklist": [
      {
        "id": "cl-1",
        "text": "Gather brief and requirements",
        "completed": false
      },
      {
        "id": "cl-2",
        "text": "Initial concepts",
        "completed": false
      },
      {
        "id": "cl-3",
        "text": "Revisions",
        "completed": false
      },
      {
        "id": "cl-4",
        "text": "Final delivery",
        "completed": false
      }
    ],
    "createdAt": "2026-08-30T11:40:42.556Z",
    "recurring": null,
    "startDate": null,
    "updatedAt": "2026-08-30T11:40:42.556Z",
    "assignedTo": "Mansour",
    "templateId": "tpl-3",
    "attachments": [],
    "description": "",
    "requestDate": "2026-08-26",
    "serviceTypes": [
      "graphic_design"
    ],
    "requestSource": "infrastructure",
    "requesterName": "طارق المحسن",
    "completionDate": null
  },
  {
    "id": "TASK-059",
    "notes": "",
    "title": "عرض الضيافة الالكترونية",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-08-30",
    "priority": "medium",
    "checklist": [
      {
        "id": "cl-1",
        "text": "Receive content from requester",
        "completed": false
      },
      {
        "id": "cl-2",
        "text": "Apply brand template",
        "completed": false
      },
      {
        "id": "cl-3",
        "text": "Internal review",
        "completed": false
      },
      {
        "id": "cl-4",
        "text": "Deliver to requester",
        "completed": false
      }
    ],
    "createdAt": "2026-08-30T11:38:48.072Z",
    "recurring": null,
    "startDate": null,
    "updatedAt": "2026-08-30T11:38:48.072Z",
    "assignedTo": "Mansour",
    "templateId": "tpl-1",
    "attachments": [],
    "description": "",
    "requestDate": "2026-08-30",
    "serviceTypes": [
      "presentation_design"
    ],
    "requestSource": "infrastructure",
    "requesterName": "عبدالعزيز المهنا",
    "completionDate": null
  },
  {
    "id": "TASK-058",
    "notes": "",
    "title": "تصوير جدة ومكة ورابغ",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-08-27",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-08-30T11:37:51.752Z",
    "recurring": null,
    "startDate": null,
    "updatedAt": "2026-08-30T11:37:51.752Z",
    "assignedTo": "Amer Rawahneh",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-08-22",
    "serviceTypes": [
      "others"
    ],
    "requestSource": "vp_office",
    "requesterName": "ماجد الجريب",
    "completionDate": null
  },
  {
    "id": "TASK-057",
    "notes": "",
    "title": "تصميم إعلان نتائج مؤشر نضج التجربة الرقمية| DGA",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-08-16",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-08-15T13:29:01.601Z",
    "recurring": null,
    "startDate": "2026-08-15",
    "updatedAt": "2026-08-16T06:04:42.168Z",
    "assignedTo": "Mansour",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-08-13",
    "serviceTypes": [
      "graphic_design"
    ],
    "requestSource": "digital_transformation",
    "requesterName": "Abdulaziz Alshubaily",
    "completionDate": null
  },
  {
    "id": "TASK-056",
    "notes": "",
    "title": "تصميم إعلان إجراءات الأمن المرحلة الأولى ",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-08-16",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-08-15T13:25:36.723Z",
    "recurring": null,
    "startDate": "2026-08-13",
    "updatedAt": "2026-08-30T11:36:24.325Z",
    "assignedTo": "Mansour",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-08-12",
    "serviceTypes": [
      "graphic_design"
    ],
    "requestSource": "applications",
    "requesterName": "عمار فلاتة",
    "completionDate": null
  },
  {
    "id": "TASK-055",
    "notes": " تم تجهيز قائمة بالمنصات المحتملة للنشر والتواصل معها حاليا تتم مراجعة العروض المستلمة وبانتظار ردور بقية الجهات ",
    "title": "VP Executive Publishing Opportunities",
    "status": "in_progress",
    "blocker": null,
    "dueDate": "2026-08-15",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-08-13T08:29:42.157Z",
    "recurring": null,
    "startDate": "2026-08-04",
    "updatedAt": "2026-08-13T08:29:42.157Z",
    "assignedTo": "Team",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-08-04",
    "serviceTypes": [
      "others"
    ],
    "requestSource": "others",
    "requesterName": "Amer",
    "completionDate": ""
  },
  {
    "id": "TASK-054",
    "notes": "",
    "title": "تصميم إعلان إطلاق المرحلة الأولى لإصدار البطاقة ",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-08-13",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-08-12T06:03:34.696Z",
    "recurring": null,
    "startDate": "2026-08-12",
    "updatedAt": "2026-08-15T13:26:41.219Z",
    "assignedTo": "Mansour",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-08-09",
    "serviceTypes": [
      "graphic_design"
    ],
    "requestSource": "applications",
    "requesterName": "خالد المحيسن",
    "completionDate": null
  },
  {
    "id": "TASK-053",
    "notes": "",
    "title": "ورشة عمل الموائمة والتكامل لقطاع العناية بالعملاء والتحول الرقمي",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-08-05",
    "priority": "high",
    "checklist": [],
    "createdAt": "2026-08-04T10:52:03.317Z",
    "recurring": null,
    "startDate": "2026-08-04",
    "updatedAt": "2026-08-12T06:03:57.674Z",
    "assignedTo": "Team",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-08-04",
    "serviceTypes": [
      "presentation_design"
    ],
    "requestSource": "digital_transformation",
    "requesterName": "عبدالعزيز الشبيلي",
    "completionDate": null
  },
  {
    "id": "TASK-052",
    "notes": "",
    "title": "تسجيل صوتي للرد الالي بمركز اتصال تقنية المعلومات والتحول الرقمي",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-08-06",
    "priority": "high",
    "checklist": [],
    "createdAt": "2026-08-04T09:52:09.731Z",
    "recurring": null,
    "startDate": "2026-08-04",
    "updatedAt": "2026-08-09T12:07:32.753Z",
    "assignedTo": "Team",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-08-04",
    "serviceTypes": [
      "others"
    ],
    "requestSource": "infrastructure",
    "requesterName": "Majid Alghamdi",
    "completionDate": null
  },
  {
    "id": "TASK-051",
    "notes": "",
    "title": "عرض تقديمي لفلاي أكيد",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-08-06",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-08-04T09:50:39.798Z",
    "recurring": null,
    "startDate": "2026-08-05",
    "updatedAt": "2026-08-06T12:10:06.770Z",
    "assignedTo": "Team",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-08-04",
    "serviceTypes": [
      "presentation_design"
    ],
    "requestSource": "digital_transformation",
    "requesterName": "رشدي",
    "completionDate": null
  },
  {
    "id": "TASK-050",
    "notes": "",
    "title": "عرض تقديمي لورشة عمل المؤامة والتكامل لقطاع العناية بالعملاء ",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-08-04",
    "priority": "urgent",
    "checklist": [],
    "createdAt": "2026-08-03T12:07:49.142Z",
    "recurring": null,
    "startDate": "2026-08-03",
    "updatedAt": "2026-08-05T08:47:44.197Z",
    "assignedTo": "Team",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-08-03",
    "serviceTypes": [
      "presentation_design"
    ],
    "requestSource": "strategy",
    "requesterName": "أحمد الرشيد",
    "completionDate": null
  },
  {
    "id": "TASK-049",
    "notes": "",
    "title": "تصميم إعلان اطلاق نظام معاملاتي",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-08-06",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-08-03T07:57:48.223Z",
    "recurring": null,
    "startDate": "2026-08-03",
    "updatedAt": "2026-08-06T06:03:36.231Z",
    "assignedTo": "Mansour",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-08-02",
    "serviceTypes": [
      "graphic_design"
    ],
    "requestSource": "applications",
    "requesterName": "Amr Mahrous",
    "completionDate": null
  },
  {
    "id": "TASK-048",
    "notes": "",
    "title": "تصميم برزنتيشن مشروع تحسين وتطوير آلية عمل أوامر التغيير",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-07-30",
    "priority": "high",
    "checklist": [],
    "createdAt": "2026-07-30T08:01:17.059Z",
    "recurring": null,
    "startDate": "2026-07-30",
    "updatedAt": "2026-07-30T09:37:38.055Z",
    "assignedTo": "Mansour",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-07-29",
    "serviceTypes": [
      "presentation_design"
    ],
    "requestSource": "applications",
    "requesterName": "محمد عباس",
    "completionDate": null
  },
  {
    "id": "TASK-047",
    "notes": "",
    "title": "تصميم قهوة الخميس",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-07-27",
    "priority": "high",
    "checklist": [],
    "createdAt": "2026-07-26T07:35:35.336Z",
    "recurring": null,
    "startDate": "2026-07-26",
    "updatedAt": "2026-07-27T11:01:21.254Z",
    "assignedTo": "Team",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-07-26",
    "serviceTypes": [
      "graphic_design"
    ],
    "requestSource": "vp_office",
    "requesterName": "Najah",
    "completionDate": null
  },
  {
    "id": "TASK-046",
    "notes": "",
    "title": "تصميم VR",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-07-27",
    "priority": "urgent",
    "checklist": [],
    "createdAt": "2026-07-26T07:26:45.651Z",
    "recurring": null,
    "startDate": "2026-07-25",
    "updatedAt": "2026-07-28T06:57:39.509Z",
    "assignedTo": "Team",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-07-23",
    "serviceTypes": [
      "graphic_design"
    ],
    "requestSource": "digital_transformation",
    "requesterName": "Obaid Alanzi",
    "completionDate": null
  },
  {
    "id": "TASK-045",
    "notes": "",
    "title": "عرض تقديمي لضمان الإيرادات ",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-07-30",
    "priority": "urgent",
    "checklist": [],
    "createdAt": "2026-07-22T07:38:34.408Z",
    "recurring": null,
    "startDate": "2026-07-16",
    "updatedAt": "2026-08-09T05:46:01.518Z",
    "assignedTo": "Amer Rawahneh",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-07-15",
    "serviceTypes": [
      "presentation_design",
      "content_writing"
    ],
    "requestSource": "vp_office",
    "requesterName": "Majid Aljuraib",
    "completionDate": null
  },
  {
    "id": "TASK-044",
    "notes": "",
    "title": "تصميم إعلان ويبكس",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-07-22",
    "priority": "high",
    "checklist": [],
    "createdAt": "2026-07-22T07:15:48.350Z",
    "recurring": null,
    "startDate": "2026-07-21",
    "updatedAt": "2026-07-22T08:50:15.628Z",
    "assignedTo": "Mansour",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-07-20",
    "serviceTypes": [
      "graphic_design"
    ],
    "requestSource": "infrastructure",
    "requesterName": "محمد المغيرة",
    "completionDate": null
  },
  {
    "id": "TASK-043",
    "notes": "",
    "title": "ترجمة إطار أولويات ميزانية تقنية المعلومات",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-07-20",
    "priority": "urgent",
    "checklist": [
      {
        "id": "cl-1",
        "text": "Receive source file",
        "completed": false
      },
      {
        "id": "cl-2",
        "text": "Translate content",
        "completed": false
      },
      {
        "id": "cl-3",
        "text": "Format & align layout",
        "completed": false
      },
      {
        "id": "cl-4",
        "text": "Proofreading",
        "completed": false
      },
      {
        "id": "cl-5",
        "text": "Deliver final file",
        "completed": false
      }
    ],
    "createdAt": "2026-07-22T07:13:45.729Z",
    "recurring": null,
    "startDate": "2026-07-20",
    "updatedAt": "2026-07-22T07:13:45.729Z",
    "assignedTo": "Amer Rawahneh",
    "templateId": "tpl-2",
    "attachments": [],
    "description": "",
    "requestDate": "2026-07-20",
    "serviceTypes": [
      "presentation_translation"
    ],
    "requestSource": "vp_office",
    "requesterName": "najah",
    "completionDate": null
  },
  {
    "id": "TASK-042",
    "notes": "",
    "title": "Video Content Transcription",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-07-20",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-07-21T12:24:57.889Z",
    "recurring": null,
    "startDate": "2026-07-20",
    "updatedAt": "2026-07-21T12:24:57.889Z",
    "assignedTo": "Areej",
    "templateId": null,
    "attachments": [],
    "description": "Transcribed the content of the provided videos into a written document for review and future reference.",
    "requestDate": "2026-07-20",
    "serviceTypes": [
      "content_writing"
    ],
    "requestSource": "vp_office",
    "requesterName": "Amer",
    "completionDate": "2026-07-21"
  },
  {
    "id": "TASK-041",
    "notes": "",
    "title": "تحديث نشرة تقنية المعلومات ",
    "status": "in_progress",
    "blocker": null,
    "dueDate": "2026-07-23",
    "priority": "high",
    "checklist": [],
    "createdAt": "2026-07-21T12:19:54.105Z",
    "recurring": null,
    "startDate": "2026-07-12",
    "updatedAt": "2026-07-22T11:39:37.722Z",
    "assignedTo": "Areej",
    "templateId": null,
    "attachments": [],
    "description": "تحديث محتوى نشرة تقنية المعلومات ",
    "requestDate": "2026-07-12",
    "serviceTypes": [
      "content_writing"
    ],
    "requestSource": "vp_office",
    "requesterName": "Amer - Dalal ",
    "completionDate": ""
  },
  {
    "id": "TASK-040",
    "notes": "",
    "title": "IT Awards Presentation Redesign",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-07-01",
    "priority": "urgent",
    "checklist": [],
    "createdAt": "2026-07-21T12:12:54.341Z",
    "recurring": null,
    "startDate": "2026-07-01",
    "updatedAt": "2026-07-21T12:12:54.341Z",
    "assignedTo": "Areej",
    "templateId": null,
    "attachments": [],
    "description": "Redesigned the IT Awards presentation to enhance the visual identity and overall presentation quality.\n",
    "requestDate": "2026-07-01",
    "serviceTypes": [
      "presentation_design"
    ],
    "requestSource": "vp_office",
    "requesterName": "Amer",
    "completionDate": "2026-07-01"
  },
  {
    "id": "TASK-039",
    "notes": "",
    "title": "VP Thank You Card ",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-07-26",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-07-21T12:09:32.292Z",
    "recurring": null,
    "startDate": "2026-07-14",
    "updatedAt": "2026-08-04T08:29:17.127Z",
    "updatedBy": "Areej",
    "assignedTo": "Areej",
    "templateId": null,
    "attachments": [],
    "description": "Developed the concept for the VP Thank You Card coordinated the design with the designer and managed communication throughout the process.\n\n",
    "requestDate": "2026-07-14",
    "serviceTypes": [
      "others"
    ],
    "requestSource": "vp_office",
    "requesterName": "Najah",
    "completionDate": ""
  },
  {
    "id": "TASK-038",
    "notes": "",
    "title": "NWC Workshop Venue Coordination",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-08-06",
    "priority": "high",
    "checklist": [],
    "createdAt": "2026-07-21T11:58:20.174Z",
    "recurring": null,
    "startDate": "2026-07-05",
    "updatedAt": "2026-08-04T08:29:49.329Z",
    "updatedBy": "Areej",
    "assignedTo": "Areej",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-07-05",
    "serviceTypes": [
      "event_management"
    ],
    "requestSource": "vp_office",
    "requesterName": "Amer - Dalal ",
    "completionDate": ""
  },
  {
    "id": "TASK-037",
    "notes": "",
    "title": "اعادة تصميم عرض مقترح ورشة العمل الربعية",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-05-18",
    "priority": "high",
    "checklist": [],
    "createdAt": "2026-07-21T11:46:01.582Z",
    "recurring": null,
    "startDate": "2026-05-16",
    "updatedAt": "2026-07-21T11:46:01.582Z",
    "assignedTo": "Areej",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-05-16",
    "serviceTypes": [
      "presentation_design"
    ],
    "requestSource": "vp_office",
    "requesterName": "Amer",
    "completionDate": "2026-05-18"
  },
  {
    "id": "TASK-036",
    "notes": "",
    "title": "Webex Q&A Arabic Translation",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-06-25",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-07-21T11:39:44.760Z",
    "recurring": null,
    "startDate": "2026-06-25",
    "updatedAt": "2026-07-21T11:39:44.760Z",
    "assignedTo": "Areej",
    "templateId": "tpl-2",
    "attachments": [],
    "description": "",
    "requestDate": "2026-06-25",
    "serviceTypes": [
      "others"
    ],
    "requestSource": "vp_office",
    "requesterName": "Amer",
    "completionDate": "2026-06-25"
  },
  {
    "id": "TASK-035",
    "notes": "",
    "title": "Webex Presentation Redesign & Arabic Translation",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-07-19",
    "priority": "medium",
    "checklist": [
      {
        "id": "cl-1",
        "text": "Receive source presentation file",
        "completed": true
      },
      {
        "id": "cl-2",
        "text": "Translate content into Arabic",
        "completed": true
      },
      {
        "id": "cl-3",
        "text": "Redesign presentation layout",
        "completed": true
      },
      {
        "id": "cl-4",
        "text": "Review formatting & accuracy",
        "completed": true
      },
      {
        "id": "cl-5",
        "text": "Deliver final presentation ",
        "completed": true
      }
    ],
    "createdAt": "2026-07-21T11:30:26.017Z",
    "recurring": null,
    "startDate": "2026-06-18",
    "updatedAt": "2026-07-21T11:32:27.502Z",
    "updatedBy": "Areej",
    "assignedTo": "Areej",
    "templateId": "tpl-2",
    "attachments": [],
    "description": "Redesigned the Webex presentation and translated its content into Arabic while maintaining consistency with the original material.\n",
    "requestDate": "2026-06-18",
    "serviceTypes": [
      "presentation_translation",
      "presentation_design"
    ],
    "requestSource": "vp_office",
    "requesterName": "Amer",
    "completionDate": "2026-06-23"
  },
  {
    "id": "TASK-034",
    "notes": "",
    "title": "تصميم ويبكس الامتثال للانظمة",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-07-19",
    "priority": "high",
    "checklist": [
      {
        "id": "cl-1",
        "text": "Gather brief and requirements",
        "completed": false
      },
      {
        "id": "cl-2",
        "text": "Initial concepts",
        "completed": false
      },
      {
        "id": "cl-3",
        "text": "Revisions",
        "completed": false
      },
      {
        "id": "cl-4",
        "text": "Final delivery",
        "completed": false
      }
    ],
    "createdAt": "2026-07-19T11:55:24.995Z",
    "recurring": null,
    "startDate": "2026-07-19",
    "updatedAt": "2026-07-19T11:55:24.995Z",
    "assignedTo": "Amer Rawahneh",
    "templateId": "tpl-3",
    "attachments": [],
    "description": "",
    "requestDate": "2026-07-16",
    "serviceTypes": [
      "graphic_design"
    ],
    "requestSource": "infrastructure",
    "requesterName": "محمد المغيرة",
    "completionDate": ""
  },
  {
    "id": "TASK-033",
    "notes": "",
    "title": "IT service support announcement",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-07-13",
    "priority": "medium",
    "checklist": [
      {
        "id": "cl-1",
        "text": "Gather brief and requirements",
        "completed": false
      },
      {
        "id": "cl-2",
        "text": "Initial concepts",
        "completed": false
      },
      {
        "id": "cl-3",
        "text": "Revisions",
        "completed": false
      },
      {
        "id": "cl-4",
        "text": "Final delivery",
        "completed": false
      }
    ],
    "createdAt": "2026-07-13T10:07:01.750Z",
    "recurring": null,
    "startDate": "2026-07-13",
    "updatedAt": "2026-07-13T10:07:01.750Z",
    "assignedTo": "Mansour",
    "templateId": "tpl-3",
    "attachments": [],
    "description": "",
    "requestDate": "2026-07-13",
    "serviceTypes": [
      "graphic_design"
    ],
    "requestSource": "infrastructure",
    "requesterName": "Abdullah Algahtani",
    "completionDate": null
  },
  {
    "id": "TASK-032",
    "notes": "",
    "title": "برزنتيشن حفل الخدمات المدارة",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-07-08",
    "priority": "medium",
    "checklist": [
      {
        "id": "cl-1",
        "text": "Receive content from requester",
        "completed": false
      },
      {
        "id": "cl-2",
        "text": "Apply brand template",
        "completed": false
      },
      {
        "id": "cl-3",
        "text": "Internal review",
        "completed": false
      },
      {
        "id": "cl-4",
        "text": "Deliver to requester",
        "completed": false
      }
    ],
    "createdAt": "2026-07-12T07:37:13.868Z",
    "recurring": null,
    "startDate": "2026-07-07",
    "updatedAt": "2026-07-12T07:37:13.868Z",
    "assignedTo": "Team",
    "templateId": "tpl-1",
    "attachments": [],
    "description": "",
    "requestDate": "2026-07-07",
    "serviceTypes": [
      "presentation_design"
    ],
    "requestSource": "it_operations",
    "requesterName": "حمزة برق الليل",
    "completionDate": null
  },
  {
    "id": "TASK-031",
    "notes": "",
    "title": "تصميم وطباعة دروع المكرمين لحفل ITMS",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-07-09",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-07-12T07:36:01.923Z",
    "recurring": null,
    "startDate": "2026-07-06",
    "updatedAt": "2026-07-12T07:36:01.923Z",
    "assignedTo": "Team",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-07-06",
    "serviceTypes": [
      "graphic_design"
    ],
    "requestSource": "it_operations",
    "requesterName": "حمزة برق الليل",
    "completionDate": null
  },
  {
    "id": "TASK-030",
    "notes": "",
    "title": "تصميم وطباعة شهادات المكرمين",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-07-08",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-07-12T07:34:52.762Z",
    "recurring": null,
    "startDate": "2026-07-06",
    "updatedAt": "2026-07-12T07:34:52.762Z",
    "assignedTo": "Team",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-07-06",
    "serviceTypes": [
      "graphic_design"
    ],
    "requestSource": "it_operations",
    "requesterName": "حمزة برق الليل",
    "completionDate": null
  },
  {
    "id": "TASK-029",
    "notes": "",
    "title": "استبيان لموظفين تقنية المعلومات",
    "status": "new",
    "blocker": null,
    "dueDate": "2026-07-10",
    "priority": "high",
    "checklist": [],
    "createdAt": "2026-07-08T10:16:42.216Z",
    "recurring": null,
    "startDate": "2026-07-10",
    "updatedAt": "2026-07-08T10:16:42.216Z",
    "assignedTo": "Team",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-07-08",
    "serviceTypes": [
      "others"
    ],
    "requestSource": "vp_office",
    "requesterName": "Majid Aljuraib",
    "completionDate": null
  },
  {
    "id": "TASK-028",
    "notes": "",
    "title": "تصميم برزنتيشن إدارة الأتمتة والذكاء الأصطناعي",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-07-08",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-07-07T06:56:09.683Z",
    "recurring": null,
    "startDate": "2026-07-07",
    "updatedAt": "2026-07-12T07:30:57.035Z",
    "assignedTo": "Mansour",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-07-07",
    "serviceTypes": [
      "presentation_design"
    ],
    "requestSource": "digital_transformation",
    "requesterName": "Nouf Alosaimi",
    "completionDate": null
  },
  {
    "id": "TASK-027",
    "notes": "",
    "title": "ورشة عمل للمؤاءمة بين تقنية المعلومات والعناية بالعملاء ",
    "status": "in_progress",
    "blocker": null,
    "dueDate": "2026-08-20",
    "priority": "high",
    "checklist": [],
    "createdAt": "2026-07-05T10:25:29.462Z",
    "recurring": null,
    "startDate": null,
    "updatedAt": "2026-08-03T12:14:16.447Z",
    "assignedTo": "Team",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-07-02",
    "serviceTypes": [
      "event_management"
    ],
    "requestSource": "vp_office",
    "requesterName": "Majid Aljuraib",
    "completionDate": null
  },
  {
    "id": "TASK-026",
    "notes": "",
    "title": "leap 2026",
    "status": "new",
    "blocker": null,
    "dueDate": "2026-09-01",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-07-05T10:23:00.907Z",
    "recurring": null,
    "startDate": "",
    "updatedAt": "2026-07-05T10:23:00.907Z",
    "assignedTo": "Team",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-07-02",
    "serviceTypes": [
      "event_management"
    ],
    "requestSource": "vp_office",
    "requesterName": "Majid Aljuraib",
    "completionDate": null
  },
  {
    "id": "TASK-025",
    "notes": "",
    "title": "فيديو توقيع اتفاقية الرئيس مع STC",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-07-07",
    "priority": "urgent",
    "checklist": [],
    "createdAt": "2026-07-02T09:15:49.279Z",
    "recurring": null,
    "startDate": "2026-07-02",
    "updatedAt": "2026-07-07T06:56:59.678Z",
    "assignedTo": "Team",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-07-02",
    "serviceTypes": [
      "video_"
    ],
    "requestSource": "it_operations",
    "requesterName": "حمزة برق الليل",
    "completionDate": "2026-07-06"
  },
  {
    "id": "TASK-024",
    "notes": "",
    "title": "تصميم إعلان الايميل",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-06-25",
    "priority": "high",
    "checklist": [
      {
        "id": "cl-1",
        "text": "Gather brief and requirements",
        "completed": false
      },
      {
        "id": "cl-2",
        "text": "Initial concepts",
        "completed": false
      },
      {
        "id": "cl-3",
        "text": "Revisions",
        "completed": false
      },
      {
        "id": "cl-4",
        "text": "Final delivery",
        "completed": false
      }
    ],
    "createdAt": "2026-06-25T11:13:42.942Z",
    "recurring": null,
    "startDate": "2026-06-25",
    "updatedAt": "2026-06-25T11:13:42.942Z",
    "assignedTo": "Mansour",
    "templateId": "tpl-3",
    "attachments": [],
    "description": "",
    "requestDate": "2026-06-25",
    "serviceTypes": [
      "graphic_design"
    ],
    "requestSource": "infrastructure",
    "requesterName": "Mohammed Almogherah",
    "completionDate": "2026-06-25"
  },
  {
    "id": "TASK-023",
    "notes": "",
    "title": "تصميم بوست لإطلاق نظام LMS",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-06-24",
    "priority": "urgent",
    "checklist": [
      {
        "id": "cl-1",
        "text": "Gather brief and requirements",
        "completed": false
      },
      {
        "id": "cl-2",
        "text": "Initial concepts",
        "completed": false
      },
      {
        "id": "cl-3",
        "text": "Revisions",
        "completed": false
      },
      {
        "id": "cl-4",
        "text": "Final delivery",
        "completed": false
      }
    ],
    "createdAt": "2026-06-24T08:04:25.037Z",
    "recurring": null,
    "startDate": "2026-06-24",
    "updatedAt": "2026-06-24T08:04:25.037Z",
    "assignedTo": "Mansour",
    "templateId": "tpl-3",
    "attachments": [],
    "description": "",
    "requestDate": "2026-06-24",
    "serviceTypes": [
      "graphic_design"
    ],
    "requestSource": "applications",
    "requesterName": "Mohammed Abbas",
    "completionDate": "2026-06-24"
  },
  {
    "id": "TASK-022",
    "notes": "",
    "title": "NWC_Webex_VP_Summary",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-06-21",
    "priority": "high",
    "checklist": [
      {
        "id": "cl-1",
        "text": "Receive content from requester",
        "completed": false
      },
      {
        "id": "cl-2",
        "text": "Apply brand template",
        "completed": false
      },
      {
        "id": "cl-3",
        "text": "Internal review",
        "completed": false
      },
      {
        "id": "cl-4",
        "text": "Deliver to requester",
        "completed": false
      }
    ],
    "createdAt": "2026-06-21T11:13:57.861Z",
    "recurring": null,
    "startDate": "2026-06-21",
    "updatedAt": "2026-06-21T11:13:57.861Z",
    "assignedTo": "Mansour",
    "templateId": "tpl-1",
    "attachments": [],
    "description": "",
    "requestDate": "2026-06-21",
    "serviceTypes": [
      "presentation_design"
    ],
    "requestSource": "vp_office",
    "requesterName": "Majid Aljuraib",
    "completionDate": "2026-06-21"
  },
  {
    "id": "TASK-021",
    "notes": "",
    "title": "التقرير اليومي التشغيلي لتقنية المعلومات ",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-05-29",
    "priority": "urgent",
    "checklist": [
      {
        "id": "cl-1",
        "text": "Receive content from requester",
        "completed": false
      },
      {
        "id": "cl-2",
        "text": "Apply brand template",
        "completed": false
      },
      {
        "id": "cl-3",
        "text": "Internal review",
        "completed": false
      },
      {
        "id": "cl-4",
        "text": "Deliver to requester",
        "completed": false
      }
    ],
    "createdAt": "2026-06-10T11:20:29.730Z",
    "recurring": null,
    "startDate": "2026-05-20",
    "updatedAt": "2026-06-10T11:20:29.730Z",
    "assignedTo": "Mansour",
    "templateId": "tpl-1",
    "attachments": [],
    "description": "",
    "requestDate": "2026-05-17",
    "serviceTypes": [
      "presentation_design"
    ],
    "requestSource": "it_operations",
    "requesterName": "مازن عاشور",
    "completionDate": ""
  },
  {
    "id": "TASK-020",
    "notes": "تم التنسيق مع Upsourc by solutions لترتيب زيارة نادي الشركة ",
    "title": "Event STC - ITMS",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-07-05",
    "priority": "urgent",
    "checklist": [],
    "createdAt": "2026-06-10T11:17:04.013Z",
    "recurring": null,
    "startDate": "2026-06-07",
    "updatedAt": "2026-07-12T07:31:34.856Z",
    "assignedTo": "Mansour",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-06-07",
    "serviceTypes": [
      "event_management"
    ],
    "requestSource": "vp_office",
    "requesterName": "Majid Aljuraib",
    "completionDate": null
  },
  {
    "id": "TASK-019",
    "notes": "",
    "title": "ICXA Award",
    "status": "on_hold",
    "blocker": null,
    "dueDate": "2026-06-15",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-05-18T11:28:41.373Z",
    "recurring": null,
    "startDate": "2026-05-18",
    "updatedAt": "2026-07-28T06:58:18.002Z",
    "assignedTo": "Team",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-05-18",
    "serviceTypes": [
      "others"
    ],
    "requestSource": "digital_transformation",
    "requesterName": "Abdulaziz Alshubaily",
    "completionDate": null
  },
  {
    "id": "TASK-018",
    "notes": "",
    "title": "ICXA Presentation",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-05-19",
    "priority": "high",
    "checklist": [],
    "createdAt": "2026-05-18T09:04:10.587Z",
    "recurring": null,
    "startDate": "2026-05-18",
    "updatedAt": "2026-05-18T11:26:05.769Z",
    "assignedTo": "Mansour",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-05-18",
    "serviceTypes": [
      "presentation_design"
    ],
    "requestSource": "digital_transformation",
    "requesterName": "Abdulaziz Alshubaily",
    "completionDate": ""
  },
  {
    "id": "TASK-017",
    "notes": "",
    "title": "جائزة جارتنر",
    "status": "in_progress",
    "blocker": null,
    "dueDate": "2026-05-18",
    "priority": "urgent",
    "checklist": [],
    "createdAt": "2026-05-18T09:01:37.051Z",
    "recurring": null,
    "startDate": "2026-05-17",
    "updatedAt": "2026-05-18T09:01:37.051Z",
    "assignedTo": "Amer Rawahneh",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-05-17",
    "serviceTypes": [
      "others"
    ],
    "requestSource": "vp_office",
    "requesterName": "Majid Aljuraib",
    "completionDate": "2026-05-18"
  },
  {
    "id": "TASK-016",
    "notes": "",
    "title": "Create a change management plan for webex ",
    "status": "new",
    "blocker": null,
    "dueDate": "2026-05-18",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-05-13T09:14:51.560Z",
    "recurring": null,
    "startDate": null,
    "updatedAt": "2026-05-13T09:14:51.560Z",
    "assignedTo": "Amer Rawahneh",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-05-12",
    "serviceTypes": [
      "others"
    ],
    "requestSource": "vp_office",
    "requesterName": "Ayman",
    "completionDate": null
  },
  {
    "id": "TASK-015",
    "notes": "",
    "title": "انتقال مبنى عليشه ",
    "status": "new",
    "blocker": null,
    "dueDate": "2026-08-19",
    "priority": "high",
    "checklist": [],
    "createdAt": "2026-05-13T07:43:22.400Z",
    "recurring": null,
    "startDate": "",
    "updatedAt": "2026-07-12T07:32:51.815Z",
    "assignedTo": "Team",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-05-12",
    "serviceTypes": [
      "others"
    ],
    "requestSource": "vp_office",
    "requesterName": "najah",
    "completionDate": null
  },
  {
    "id": "TASK-014",
    "notes": "",
    "title": "مؤشرات الأداء الرئيسية لعرض نائب الرئيس الربع سنوي",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-05-17",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-05-12T07:20:14.351Z",
    "recurring": null,
    "startDate": null,
    "updatedAt": "2026-07-22T09:52:39.106Z",
    "assignedTo": "Areej",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-05-12",
    "serviceTypes": [
      "others"
    ],
    "requestSource": "others",
    "requesterName": "Amer ",
    "completionDate": null
  },
  {
    "id": "TASK-013",
    "notes": "",
    "title": "تصميم توقيع الايميل ",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-06-15",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-05-11T10:09:20.334Z",
    "recurring": null,
    "startDate": "",
    "updatedAt": "2026-08-03T07:47:38.546Z",
    "assignedTo": "Areej",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-05-08",
    "serviceTypes": [
      "others",
      "graphic_design"
    ],
    "requestSource": "infrastructure",
    "requesterName": "Saeed alkathery ",
    "completionDate": null
  },
  {
    "id": "TASK-012",
    "notes": "",
    "title": "اطلاق اعلان منصة ويبكس عبر الايميل",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-05-10",
    "priority": "urgent",
    "checklist": [],
    "createdAt": "2026-05-10T09:27:15.125Z",
    "recurring": null,
    "startDate": "2026-05-10",
    "updatedAt": "2026-05-10T09:27:15.125Z",
    "assignedTo": "Mansour",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-05-10",
    "serviceTypes": [
      "announcements"
    ],
    "requestSource": "vp_office",
    "requesterName": "Majid Aljuraib",
    "completionDate": "2026-05-10"
  },
  {
    "id": "TASK-011",
    "notes": "",
    "title": "اجندة ورشة عمل قادة تقنية المعلومات ",
    "status": "new",
    "blocker": null,
    "dueDate": "2026-05-10",
    "priority": "urgent",
    "checklist": [
      {
        "id": "cl-1778487982456",
        "text": "اعداد الاجندة",
        "completed": false
      }
    ],
    "createdAt": "2026-05-10T09:22:23.927Z",
    "recurring": null,
    "startDate": "2026-05-10",
    "updatedAt": "2026-05-11T08:26:27.783Z",
    "assignedTo": "Amer Rawahneh",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-05-10",
    "serviceTypes": [
      "event_management"
    ],
    "requestSource": "vp_office",
    "requesterName": "Majid Aljuraib",
    "completionDate": null
  },
  {
    "id": "TASK-010",
    "notes": "",
    "title": "فيديوهات القطاع الشرقي",
    "status": "cancelled",
    "blocker": null,
    "dueDate": "2026-05-14",
    "priority": "medium",
    "checklist": [],
    "createdAt": "2026-05-07T12:09:15.674Z",
    "recurring": null,
    "startDate": "",
    "updatedAt": "2026-07-22T09:53:01.319Z",
    "assignedTo": "Areej",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-05-07",
    "serviceTypes": [
      "video_"
    ],
    "requestSource": "vp_office",
    "requesterName": "Najah",
    "completionDate": null
  },
  {
    "id": "TASK-009",
    "notes": "",
    "title": "فيديو نظام مسار",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-05-05",
    "priority": "high",
    "checklist": [],
    "createdAt": "2026-05-07T10:18:18.128Z",
    "recurring": null,
    "startDate": "2026-05-04",
    "updatedAt": "2026-05-10T05:23:58.330Z",
    "assignedTo": "Mansour",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-05-04",
    "serviceTypes": [
      "motion_graphics_video"
    ],
    "requestSource": "it_operations",
    "requesterName": "Hawash",
    "completionDate": "2026-05-05"
  },
  {
    "id": "TASK-008",
    "notes": "",
    "title": "فيديو نظام المسح الميداني",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-05-10",
    "priority": "high",
    "checklist": [],
    "createdAt": "2026-05-07T10:16:43.434Z",
    "recurring": null,
    "startDate": "2026-05-07",
    "updatedAt": "2026-07-07T06:57:31.504Z",
    "assignedTo": "Team",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-05-05",
    "serviceTypes": [
      "motion_graphics_video"
    ],
    "requestSource": "it_operations",
    "requesterName": "Hawash",
    "completionDate": "2026-05-10"
  },
  {
    "id": "TASK-007",
    "notes": "",
    "title": "العرض التقديمي لويبكس",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-05-07",
    "priority": "high",
    "checklist": [],
    "createdAt": "2026-05-07T10:14:13.671Z",
    "recurring": null,
    "startDate": "2026-05-07",
    "updatedAt": "2026-05-07T10:17:07.715Z",
    "assignedTo": "Mansour",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-05-06",
    "serviceTypes": [
      "presentation_design"
    ],
    "requestSource": "infrastructure",
    "requesterName": "Majid Alghamdi",
    "completionDate": "2026-05-07"
  },
  {
    "id": "TASK-006",
    "notes": "",
    "title": "إعلان ويبكس",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-05-07",
    "priority": "high",
    "checklist": [],
    "createdAt": "2026-05-07T10:12:58.580Z",
    "recurring": null,
    "startDate": "2026-05-06",
    "updatedAt": "2026-05-07T10:12:58.580Z",
    "assignedTo": "Mansour",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-05-06",
    "serviceTypes": [
      "graphic_design"
    ],
    "requestSource": "infrastructure",
    "requesterName": "Majid Alghamdi",
    "completionDate": "2026-05-07"
  },
  {
    "id": "TASK-005",
    "notes": "",
    "title": "ويبكس فيديو",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-05-09",
    "priority": "high",
    "checklist": [],
    "createdAt": "2026-05-07T10:11:27.248Z",
    "recurring": null,
    "startDate": "2026-05-07",
    "updatedAt": "2026-05-18T09:08:35.274Z",
    "assignedTo": "Mansour",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-05-07",
    "serviceTypes": [
      "motion_graphics_video"
    ],
    "requestSource": "infrastructure",
    "requesterName": "Majid Alghamdi",
    "completionDate": "2026-05-09"
  },
  {
    "id": "TASK-004",
    "notes": "Email was sent for Reem  \nthe design it self it approved we need to find a supplier  \n\n****** Contact with tarq smart code *****",
    "title": "Visitors Parking ",
    "status": "on_hold",
    "blocker": null,
    "dueDate": "2026-04-12",
    "priority": "high",
    "checklist": [],
    "createdAt": "2026-05-06T07:26:57.784Z",
    "recurring": null,
    "startDate": "2026-05-06",
    "updatedAt": "2026-07-22T09:51:15.894Z",
    "assignedTo": "Areej",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-05-06",
    "serviceTypes": [
      "presentation_design"
    ],
    "requestSource": "vp_office",
    "requesterName": "Reem",
    "completionDate": "2026-05-12"
  },
  {
    "id": "TASK-003",
    "notes": "",
    "title": "UN Video",
    "status": "completed",
    "blocker": null,
    "dueDate": "2026-05-07",
    "priority": "high",
    "checklist": [],
    "createdAt": "2026-05-05T11:06:10.038Z",
    "recurring": null,
    "startDate": "2026-05-06",
    "updatedAt": "2026-05-18T09:08:10.571Z",
    "assignedTo": "Mansour",
    "templateId": null,
    "attachments": [],
    "description": "",
    "requestDate": "2026-05-05",
    "serviceTypes": [
      "motion_graphics_video"
    ],
    "requestSource": "it_operations",
    "requesterName": "Hawash",
    "completionDate": "2026-05-14"
  }
]

// ─── Initial config (includes custom services added via Admin) ────────────────
const INITIAL_CONFIG = {
  "sources": [
    {
      "id": "src-1",
      "color": "#3b82f6",
      "label": "VP Office",
      "order": 1,
      "value": "vp_office",
      "category": "source",
      "isActive": true,
      "isSystem": true
    },
    {
      "id": "src-2",
      "color": "#8b5cf6",
      "label": "Infrastructure",
      "order": 2,
      "value": "infrastructure",
      "category": "source",
      "isActive": true,
      "isSystem": true
    },
    {
      "id": "src-3",
      "color": "#ec4899",
      "label": "IT Operations",
      "order": 3,
      "value": "it_operations",
      "category": "source",
      "isActive": true,
      "isSystem": true
    },
    {
      "id": "src-4",
      "color": "#f59e0b",
      "label": "Digital Transformation",
      "order": 4,
      "value": "digital_transformation",
      "category": "source",
      "isActive": true,
      "isSystem": true
    },
    {
      "id": "src-5",
      "color": "#10b981",
      "label": "Strategy",
      "order": 5,
      "value": "strategy",
      "category": "source",
      "isActive": true,
      "isSystem": true
    },
    {
      "id": "src-6",
      "color": "#6366f1",
      "label": "Applications",
      "order": 6,
      "value": "applications",
      "category": "source",
      "isActive": true,
      "isSystem": true
    },
    {
      "id": "src-7",
      "color": "#94a3b8",
      "label": "Others",
      "order": 7,
      "value": "others",
      "category": "source",
      "isActive": true,
      "isSystem": true
    }
  ],
  "services": [
    {
      "id": "svc-1",
      "color": "#3b82f6",
      "label": "Presentation Design",
      "order": 1,
      "value": "presentation_design",
      "category": "service",
      "isActive": true,
      "isSystem": true
    },
    {
      "id": "svc-2",
      "color": "#8b5cf6",
      "label": "Presentation Translation",
      "order": 2,
      "value": "presentation_translation",
      "category": "service",
      "isActive": true,
      "isSystem": true
    },
    {
      "id": "svc-3",
      "color": "#f59e0b",
      "label": "Graphic Design",
      "order": 3,
      "value": "graphic_design",
      "category": "service",
      "isActive": true,
      "isSystem": true
    },
    {
      "id": "svc-4",
      "color": "#10b981",
      "label": "Content Writing",
      "order": 4,
      "value": "content_writing",
      "category": "service",
      "isActive": true,
      "isSystem": true
    },
    {
      "id": "svc-5",
      "color": "#ec4899",
      "label": "Event Management & Meeting Coordination",
      "order": 5,
      "value": "event_management",
      "category": "service",
      "isActive": true,
      "isSystem": true
    },
    {
      "id": "cfg-6",
      "color": "#6366f1",
      "label": "Video",
      "order": 6,
      "value": "video_",
      "category": "service",
      "isActive": true,
      "isSystem": false
    },
    {
      "id": "cfg-7",
      "color": "#6366f1",
      "label": "Motion graphics video",
      "order": 7,
      "value": "motion_graphics_video",
      "category": "service",
      "isActive": true,
      "isSystem": false
    },
    {
      "id": "cfg-8",
      "color": "#450e59",
      "label": "Others",
      "order": 8,
      "value": "others",
      "category": "service",
      "isActive": true,
      "isSystem": false
    },
    {
      "id": "cfg-9",
      "color": "#f28f64",
      "label": "announcements",
      "order": 9,
      "value": "announcements",
      "category": "service",
      "isActive": true,
      "isSystem": false
    }
  ],
  "statuses": [
    {
      "id": "sts-1",
      "color": "#94a3b8",
      "label": "New",
      "order": 1,
      "value": "new",
      "category": "status",
      "isActive": true,
      "isSystem": true
    },
    {
      "id": "sts-2",
      "color": "#f59e0b",
      "label": "In Progress",
      "order": 2,
      "value": "in_progress",
      "category": "status",
      "isActive": true,
      "isSystem": true
    },
    {
      "id": "sts-3",
      "color": "#f97316",
      "label": "On Hold",
      "order": 3,
      "value": "on_hold",
      "category": "status",
      "isActive": true,
      "isSystem": true
    },
    {
      "id": "sts-4",
      "color": "#e11d48",
      "label": "Blocked",
      "order": 4,
      "value": "blocked",
      "category": "status",
      "isActive": true,
      "isSystem": true
    },
    {
      "id": "sts-5",
      "color": "#10b981",
      "label": "Completed",
      "order": 5,
      "value": "completed",
      "category": "status",
      "isActive": true,
      "isSystem": true
    },
    {
      "id": "sts-6",
      "color": "#ef4444",
      "label": "Cancelled",
      "order": 6,
      "value": "cancelled",
      "category": "status",
      "isActive": true,
      "isSystem": true
    }
  ],
  "priorities": [
    {
      "id": "pri-1",
      "color": "#94a3b8",
      "label": "Low",
      "order": 1,
      "value": "low",
      "category": "priority",
      "isActive": true,
      "isSystem": true
    },
    {
      "id": "pri-2",
      "color": "#3b82f6",
      "label": "Medium",
      "order": 2,
      "value": "medium",
      "category": "priority",
      "isActive": true,
      "isSystem": true
    },
    {
      "id": "pri-3",
      "color": "#f97316",
      "label": "High",
      "order": 3,
      "value": "high",
      "category": "priority",
      "isActive": true,
      "isSystem": true
    },
    {
      "id": "pri-4",
      "color": "#ef4444",
      "label": "Urgent",
      "order": 4,
      "value": "urgent",
      "category": "priority",
      "isActive": true,
      "isSystem": true
    }
  ]
}

// ─── Data file path (persists across restarts) ────────────────────────────────
const DATA_FILE = join(__dirname, 'data.json')

// ─── Persistent database ──────────────────────────────────────────────────────
function loadDb() {
  if (existsSync(DATA_FILE)) {
    try {
      const raw = readFileSync(DATA_FILE, 'utf-8')
      const saved = JSON.parse(raw)
      console.log(`✅ Loaded data from file (${saved.tasks?.length ?? 0} tasks, ${saved.users?.length ?? 0} users)`)
      return {
        tasks: saved.tasks ?? INITIAL_TASKS,
        users: saved.users?.length ? saved.users : INITIAL_USERS.map(u => ({ ...u })),
        config: saved.config ?? JSON.parse(JSON.stringify(INITIAL_CONFIG)),
      }
    } catch (e) {
      console.warn('⚠️  Could not parse data file, using initial data:', e.message)
    }
  } else {
    console.log('📁 No data file — seeding from initial data (68 tasks)')
  }
  return {
    tasks: INITIAL_TASKS.map(t => ({ ...t })),
    users: INITIAL_USERS.map(u => ({ ...u })),
    config: JSON.parse(JSON.stringify(INITIAL_CONFIG)),
  }
}

function saveDb() {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8')
  } catch (e) {
    console.error('❌ Failed to save data:', e.message)
  }
}

const db = loadDb()

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateTaskId() {
  const max = db.tasks.reduce((acc, t) => {
    const n = parseInt(t.id.replace('TASK-', ''), 10)
    return isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return `TASK-${String(max + 1).padStart(3, '0')}`
}

function generateUserId() {
  const max = db.users.reduce((acc, u) => {
    const n = parseInt(u.id.replace('USR-', ''), 10)
    return isNaN(n) ? acc : Math.max(acc, n)
  }, 0)
  return `USR-${String(max + 1).padStart(3, '0')}`
}

app.use(express.json())
app.use(express.static(join(__dirname, 'dist')))

// ─── Auth API ─────────────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body ?? {}
  const user = db.users.find(u =>
    u.username.toLowerCase() === (username ?? '').toLowerCase() &&
    verifyPassword(password, u.password) &&
    u.status === 'active'
  )
  if (!user) return res.status(401).json({ error: 'Invalid username or password.' })
  user.lastLogin = new Date().toISOString()
  saveDb()
  res.json({
    token: `mock-jwt-${Date.now()}`,
    user: { id: user.id, username: user.username, name: user.name, role: user.role },
  })
})

app.post('/api/auth/admin-login', (req, res) => {
  const { username, password } = req.body ?? {}
  const user = db.users.find(u =>
    u.username.toLowerCase() === (username ?? '').toLowerCase() &&
    verifyPassword(password, u.password) &&
    u.status === 'active' &&
    (u.role === 'admin' || u.role === 'manager')
  )
  if (!user) return res.status(401).json({ error: 'Invalid username or password.' })
  user.lastLogin = new Date().toISOString()
  saveDb()
  res.json({
    token: `mock-admin-jwt-${Date.now()}`,
    user: { id: user.id, username: user.username, name: user.name, role: user.role },
  })
})

// ─── Tasks API ────────────────────────────────────────────────────────────────
app.get('/api/tasks', (_req, res) => res.json(db.tasks))

app.get('/api/tasks/:id', (req, res) => {
  const task = db.tasks.find(t => t.id === req.params.id)
  if (!task) return res.status(404).json({ error: 'Task not found' })
  res.json(task)
})

app.post('/api/tasks', (req, res) => {
  const now = new Date().toISOString()
  const task = { ...req.body, id: generateTaskId(), createdAt: now, updatedAt: now }
  db.tasks = [task, ...db.tasks]
  saveDb()
  res.status(201).json(task)
})

app.put('/api/tasks/:id', (req, res) => {
  const idx = db.tasks.findIndex(t => t.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Task not found' })
  db.tasks[idx] = { ...db.tasks[idx], ...req.body, updatedAt: new Date().toISOString() }
  saveDb()
  res.json(db.tasks[idx])
})

app.delete('/api/tasks/:id', (req, res) => {
  db.tasks = db.tasks.filter(t => t.id !== req.params.id)
  saveDb()
  res.json({ ok: true })
})

// ─── Users API ────────────────────────────────────────────────────────────────
app.get('/api/users', (_req, res) => {
  const safe = db.users.map(({ password: _p, ...u }) => u)
  res.json(safe)
})

app.post('/api/users', (req, res) => {
  const { password, ...rest } = req.body
  const user = {
    ...rest,
    password: password ? hashPassword(password) : hashPassword('ChangeMe@2025'),
    id: generateUserId(),
    createdAt: new Date().toISOString(),
    lastLogin: null,
  }
  db.users = [...db.users, user]
  saveDb()
  const { password: _p, ...safeUser } = user
  res.status(201).json(safeUser)
})

app.put('/api/users/:id', (req, res) => {
  const idx = db.users.findIndex(u => u.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'User not found' })
  const { password, ...rest } = req.body
  const update = { ...rest }
  if (password) update.password = hashPassword(password)
  db.users[idx] = { ...db.users[idx], ...update }
  saveDb()
  const { password: _p, ...safeUser } = db.users[idx]
  res.json(safeUser)
})

app.delete('/api/users/:id', (req, res) => {
  db.users = db.users.filter(u => u.id !== req.params.id)
  saveDb()
  res.json({ ok: true })
})

// ─── Config API ───────────────────────────────────────────────────────────────
app.get('/api/config', (_req, res) => res.json(db.config))

app.put('/api/config', (req, res) => {
  db.config = { ...db.config, ...req.body }
  saveDb()
  res.json(db.config)
})

// ─── SPA fallback ─────────────────────────────────────────────────────────────
app.get('/{*path}', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
