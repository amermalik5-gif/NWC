# BRF: Internal Task Tracking App

## 1. Project Title
**Internal Task Tracking App**

## 2. Purpose
Build a simple internal web app to track, organize, and monitor incoming tasks from different departments, while managing the services provided by the team.

The app should help users:
- Log and track all incoming tasks
- Identify which department requested each task
- Categorize tasks by service type
- Monitor task volume, status, and ownership
- View a dashboard with totals and filtering options

## 3. Main Objective
Create a centralized dashboard-based task management system that gives visibility into:
- Total number of tasks
- Source of each task request
- Type of service requested
- Current task status
- Filtering and reporting by different criteria

## 4. Users
Primary users may include:
- Team members handling requests
- Managers supervising workload
- Department coordinators
- Admin users

## 5. Task Request Sources
These are the main departments or sources from which tasks come:

1. VP Office  
2. Infrastructure  
3. IT Operations  
4. Digital Transformation  
5. Strategy  
6. Applications  
7. Others  

## 6. Services Provided
These are the service categories the team provides:

1. Presentation Design  
2. Presentation Translation  
3. Graphic Design  
4. Content Writing  
5. Event Management and Meeting Coordination  

## 7. Core App Idea
The app will track every task from submission to completion.

Each task should be linked to:
- Request source
- Service type
- Task title
- Task description
- Priority
- Status
- Assigned person
- Due date
- Request date
- Notes or attachments if needed

## 8. Homepage / Dashboard Requirements
The homepage should be a dashboard that gives an immediate overview of all tasks.

### Dashboard should show:
- Total number of tasks
- Number of open tasks
- Number of in-progress tasks
- Number of completed tasks
- Number of overdue tasks
- Tasks by request source
- Tasks by service type

### Dashboard filters should include:
- Request source
- Service type
- Status
- Priority
- Assigned person
- Date range
- Requester / department

### Dashboard visual elements:
- Summary cards for totals
- Charts showing task distribution
- Table of recent or active tasks
- Filter panel
- Section showing where tasks are coming from

## 9. Key Functional Requirements

### A. Task Creation
Users should be able to create a new task with:
- Task title
- Task description
- Request source
- Service type
- Priority
- Requester name
- Assigned team member
- Start date
- Due date
- Status
- Comments or notes

### B. Task Management
Users should be able to:
- Edit task details
- Change task status
- Reassign tasks
- Add comments or updates
- Mark tasks as completed
- Track overdue items

### C. Task Status Options
Suggested statuses:
- New
- In Progress
- On Hold
- Completed
- Cancelled

### D. Priority Levels
Suggested priorities:
- Low
- Medium
- High
- Urgent

### E. Filtering and Search
Users should be able to:
- Search by keyword
- Filter by source
- Filter by service type
- Filter by date
- Filter by assigned person
- Filter by status and priority

### F. Reporting
The app should provide basic reporting such as:
- Number of tasks per department
- Number of tasks per service type
- Completion rates
- Overdue tasks
- Monthly task trends

## 10. Required Data Fields for Each Task
Suggested fields:
- Task ID
- Task Title
- Description
- Request Source
- Service Type
- Requester Name
- Assigned To
- Status
- Priority
- Request Date
- Start Date
- Due Date
- Completion Date
- Notes
- Attachments

## 11. Homepage Layout Suggestion

### Top Section
- Page title
- Quick summary cards:
  - Total Tasks
  - Open Tasks
  - In Progress
  - Completed
  - Overdue

### Middle Section
- Filters bar
- Charts:
  - Tasks by request source
  - Tasks by service type
  - Tasks by status

### Bottom Section
- Detailed task table
- Recent updates
- Upcoming deadlines

## 12. Important Dashboard Insight
One of the main goals of the homepage is to clearly show:

**Where the tasks are coming from**

This should appear as:
- A chart by department/source
- A table summary by source
- Filters to isolate one source or compare several sources

Example:
- VP Office: 18 tasks
- Infrastructure: 12 tasks
- IT Operations: 9 tasks
- Digital Transformation: 15 tasks
- Strategy: 7 tasks
- Applications: 11 tasks
- Others: 4 tasks

## 13. Suggested Admin Features
- Manage task categories
- Add or edit request sources
- Add or edit service types
- Manage users and roles
- Export task data to Excel or CSV

## 14. Non-Functional Requirements
- Simple and clean interface
- Fast filtering and search
- Mobile-friendly or responsive design
- Easy data entry
- Clear dashboard visuals
- Secure user access

## 15. Future Enhancements
Possible future features:
- Notifications and reminders
- Email integration
- SLA tracking
- Approval workflow
- Attachment management
- Audit log
- Performance analytics by team member

## 16. Success Criteria
The app is successful if it allows the team to:
- Track all incoming tasks in one place
- See task volume clearly
- Understand which department creates the most requests
- Monitor workload by service type
- Improve follow-up and completion

---

# Starting Prompt for Claude Agent

Use the following prompt to start the project with Claude:

```text
I want you to build an internal task tracking web app.

Project goal:
Create a clean, modern task tracking app with a dashboard homepage that allows a team to monitor incoming requests, track progress, filter tasks, and understand where tasks are coming from.

Main request sources:
1. VP Office
2. Infrastructure
3. IT Operations
4. Digital Transformation
5. Strategy
6. Applications
7. Others

Services provided:
1. Presentation Design
2. Presentation Translation
3. Graphic Design
4. Content Writing
5. Event Management and Meeting Coordination

Core requirements:
- Build a dashboard homepage
- Show total number of tasks
- Show open, in-progress, completed, and overdue tasks
- Show where tasks are coming from
- Show task distribution by request source and by service type
- Add filters for request source, service type, status, priority, assigned person, and date range
- Include a task table for active or recent tasks

Each task should support these fields:
- Task ID
- Title
- Description
- Request source
- Service type
- Requester name
- Assigned to
- Status
- Priority
- Request date
- Start date
- Due date
- Completion date
- Notes
- Attachments

Suggested statuses:
- New
- In Progress
- On Hold
- Completed
- Cancelled

Suggested priorities:
- Low
- Medium
- High
- Urgent

I want you to:
1. Define the app architecture
2. Suggest the best frontend stack
3. Create a clean folder structure
4. Create reusable components
5. Build the dashboard first
6. Use mock data first
7. Then prepare the app so it can connect to a real backend later

Dashboard should include:
- Summary cards
- Charts for source, service type, and status
- Filter bar
- Tasks table
- Recent updates or upcoming deadlines

Design direction:
- Clean professional UI
- Internal business tool style
- Fast and simple to use
- Responsive layout

Important:
- Start by generating a detailed implementation plan
- Then create the project structure
- Then build the dashboard page first
- Use clear naming conventions and scalable code
- Keep the code clean and production-ready
- If any assumption is needed, choose the most practical option and proceed

Before writing code, summarize the architecture, pages, components, data model, and implementation phases.
```

## Optional Stronger Prompt for Better Output

```text
Act as a senior product engineer and UI architect.
Build an internal task tracking app for a business team.
Prioritize clean architecture, maintainable components, and a polished dashboard.
Use mock data first but structure the project so it can later connect to an API.

Deliver in this order:
1. Architecture summary
2. Folder structure
3. Data model and constants
4. Reusable UI components
5. Layout components
6. Dashboard page
7. Task listing page
8. Task details page
9. Create task form
10. Routing and app entry
11. Build verification

Do not skip steps.
After each major step, explain what was created and why.
If a tool action fails, show the exact error and propose the simplest fix instead of switching tools unnecessarily.
```
