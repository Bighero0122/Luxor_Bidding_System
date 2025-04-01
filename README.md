# Luxor Bidding System

A full-stack bidding platform built with Next.js, Prisma, and PostgreSQL.

![Luxor Bidding System](./public/UI-preview.jpg)

## Features

- User authentication (mock implementation)
- Collection management (create, update, delete)
- Bidding system with status tracking (pending, accepted, rejected)
- Real-time feedback and responsive UI

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Custom components with ShadCN inspiration
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- PostgreSQL 14.0 or later
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Bighero0122/Luxor_Bidding_System.git
   cd luxor-bidding-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure the database**

   Create a `.env` file in the project root with your PostgreSQL connection details:

   ```
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/luxor_bidding_system"
   ```

4. **Create the database**

   In PostgreSQL:

   ```sql
   CREATE DATABASE luxor_bidding_system;
   ```

5. **Set up database schema and seed data**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev --name init

   # Seed the database with test data
   npx prisma db seed
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Access the application**

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### User Selection

- Select a user from the dropdown to simulate authentication
- Different users have different permissions (collection owners vs. bidders)

### Collections

- View all available collections
- Expand a collection to see its details and bids
- Create new collections with the "Create Collection" button
- Edit or delete collections you own

### Bidding

- Place bids on collections you don't own
- Edit or cancel your pending bids
- Accept bids for collections you own (will automatically reject other bids)

## Application Monitoring

To ensure the Luxor Bidding System runs smoothly in production, I would implement:

### 1. Performance Monitoring

- **Application Performance Monitoring (APM)**: Implement New Relic or Datadog to track application performance, response times, and error rates.
- **Real User Monitoring (RUM)**: Track actual user experiences, including page load times, interactions, and client-side errors.
- **Server Monitoring**: Monitor server resources (CPU, memory, disk I/O) to identify bottlenecks.

### 2. Error Tracking

- **Centralized Error Logging**: Implement Sentry for real-time error tracking and notifications.
- **Custom Error Boundaries**: Add React error boundaries to prevent entire UI crashes.
- **Structured Logging**: Implement structured logging with Winston or Pino for better searchability and analysis.

### 3. Health Checks

- **Endpoint Monitoring**: Create dedicated health check endpoints to verify system components.
- **Database Connection Monitoring**: Regularly verify database connectivity and performance.
- **Dependency Monitoring**: Monitor third-party API dependencies for outages or performance degradation.

### 4. Alerting System

- **Threshold-based Alerts**: Configure alerts for unusual error rates, response times, or resource utilization.
- **Paging Integration**: Connect alerts to on-call systems like PagerDuty for critical issues.
- **Status Pages**: Implement a public status page to communicate system health to users.

## Scalability and Performance

To scale the Luxor Bidding System for high-volume usage:

### 1. Database Optimization

- **Connection Pooling**: Implement proper connection pooling to handle concurrent requests efficiently.
- **Query Optimization**: Add database indexes for frequently queried fields and optimize SQL queries.
- **Database Sharding**: For very large datasets, implement horizontal sharding by collection categories.
- **Read Replicas**: Separate read and write operations to different database instances.

### 2. Application Architecture

- **Serverless Deployment**: Deploy using AWS Lambda or Vercel Serverless Functions for automatic scaling.
- **Microservices**: Break down the application into separate services for bids, collections, and users.
- **Caching Strategy**: Implement Redis for caching frequently accessed collections and user data.
- **Rate Limiting**: Add rate limiting to prevent API abuse.

### 3. Frontend Performance

- **Code Splitting**: Split JavaScript bundles to reduce initial load times.
- **Image Optimization**: Use Next.js Image component with proper sizing and formats.
- **Server-Side Rendering (SSR)**: Utilize SSR for faster initial page loads.
- **Progressive Web App (PWA)**: Implement service workers for offline capabilities and faster repeat visits.

### 4. Content Delivery

- **CDN Integration**: Use a CDN like Cloudflare or AWS CloudFront for static assets.
- **Edge Caching**: Deploy critical API routes to edge locations for faster global access.

## Trade-offs and Future Improvements

With more time and resources, I would improve the application in the following ways:

### 1. Authentication and Security

- **Proper Authentication**: Replace mock users with OAuth, NextAuth.js, or a dedicated auth provider.
- **Role-Based Access Control**: Implement more sophisticated permission systems.
- **API Security**: Add rate limiting, CSRF protection, and input validation.

### 2. Real-time Features

- **WebSockets Integration**: Implement WebSockets for real-time bid updates and notifications.
- **Optimistic UI Updates**: Implement optimistic updates for better UX during API calls.
- **Notification System**: Add in-app and email notifications for bid activity.

### 3. Testing and Quality Assurance

- **Comprehensive Test Suite**: Add unit, integration, and end-to-end tests with Jest and Cypress.
- **Automated CI/CD**: Set up GitHub Actions for automated testing and deployment.
- **Accessibility Testing**: Ensure WCAG compliance for all users.

### 4. Enhanced UX/UI

- **Mobile Optimization**: Further improve the mobile experience.
- **Advanced Filtering**: Add more sophisticated search and filtering options.
- **Data Visualization**: Add charts and graphs to display bidding trends.
- **Pagination/Infinite Scroll**: Implement for better handling of large collection lists.

### 5. Infrastructure as Code

- **Terraform/CloudFormation**: Define infrastructure as code for consistent deployments.
- **Docker Containerization**: Package the application for consistent development and deployment.
