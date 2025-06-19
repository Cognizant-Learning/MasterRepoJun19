# Daily Journal & Mood Analyzer App Requirements

## Task 1: Requirements Analysis

### Functional Requirements (FR)
1. **User Authentication & Authorization**
   - User registration and login functionality
   - Password recovery options
   - Session management

2. **Journal Management**
   - Create new journal entries with date, title, and content
   - Edit existing journal entries
   - Delete journal entries
   - View journal entries (single entry and list view)
   - Search and filter journal entries

3. **Mood Tracking**
   - Select mood from predefined options for each entry
   - Add mood intensity level (1-10 scale)
   - Add mood context/triggers
   - Optional mood notes

4. **Data Visualization**
   - Display mood trends over time (daily, weekly, monthly views)
   - Show mood distribution charts
   - Correlate mood patterns with journal content themes
   - Export mood data reports

5. **Notifications & Reminders**
   - Daily journaling reminders
   - Streak maintenance alerts
   - Insight notifications based on mood patterns

### Non-Functional Requirements (NFR)
1. **Performance**
   - Page load time under 2 seconds
   - Smooth scrolling and transitions
   - Efficient data retrieval and storage

2. **Security & Privacy**
   - End-to-end encryption for journal entries
   - Compliance with data protection regulations
   - Secure authentication methods
   - Data backup and recovery options

3. **Usability**
   - Intuitive and clean user interface
   - Responsive design for multiple devices
   - Accessibility compliance (WCAG 2.1)
   - Dark/light mode options

4. **Reliability**
   - 99.9% uptime
   - Graceful error handling
   - Offline functionality for basic journaling

5. **Scalability**
   - Support for increasing user base
   - Efficient database management
   - Optimized storage for long-term journal archives

### Scope Definition

#### In Scope
- Basic user authentication system
- Journal entry CRUD operations
- Simple mood selection and tracking
- Basic data visualizations (line charts, pie charts)
- Responsive web design
- Data encryption and security measures
- Search and filter functionality
- Basic notification system

#### Out of Scope
- Advanced AI-based mood analysis
- Social sharing features
- Integration with external mental health services
- Advanced analytics beyond basic visualizations
- Mobile native applications (focus on web app)
- Voice or image entry methods
- Multiple language support (initial version English only)

## Task 2: User Data Points

### Journal Entry Data
- Entry date and time
- Entry title
- Entry content/body
- Tags/categories
- Weather (optional, could be auto-captured)
- Location (optional)

### Mood Data
- Primary mood selection (happy, sad, anxious, calm, excited, etc.)
- Mood intensity (scale of 1-10)
- Secondary emotions (optional multi-select)
- Mood triggers/contexts (work, relationships, health, etc.)
- Time of day mood was experienced

### User Profile Data
- Basic demographics (age range, gender - optional)
- Notification preferences
- UI preferences (theme, layout options)
- Journaling goals/frequency targets

## Task 3: Additional Engagement Features

1. **Guided Journaling Prompts**
   - Daily writing prompts to inspire reflection
   - Themed weekly challenges
   - Writer's block assistance

2. **Milestone & Streak System**
   - Journaling streak tracking
   - Achievement badges for consistent use
   - Milestone celebrations (e.g., "30 days of journaling!")

3. **Mood Pattern Insights**
   - Automated observations about mood trends
   - Suggestions for potential mood improvement activities
   - Correlation of activities with mood states

4. **Customizable Templates**
   - Different journal entry templates (gratitude, reflection, goal-setting)
   - Custom template creation
   - Quick entry options for busy days

5. **Exportable Content**
   - PDF export of journal entries
   - Mood data exports for personal analysis
   - Print-friendly formatting

6. **Habit Tracking Integration**
   - Simple habit tracker connected to mood states
   - Habit correlation with mood visualization
   - Suggestion system based on positive correlations

## Task 4: User Experience Datapoints

1. **Interaction Metrics**
   - User session duration
   - Feature usage frequency
   - Navigation patterns
   - Dropout points in journaling process

2. **Performance Metrics**
   - Load times across devices
   - API response times
   - Storage utilization
   - Error frequency and types

3. **User Preferences**
   - Most used mood categories
   - Preferred visualization types
   - Journaling time patterns (morning, evening, etc.)
   - Template preferences

4. **Feature Adoption**
   - New feature usage rates
   - Feature abandonment patterns
   - Feature discovery metrics
   - Help documentation access rates

5. **Satisfaction Indicators**
   - Optional micro-feedback system
   - Feature satisfaction ratings
   - Net Promoter Score (NPS)
   - Return user rate and patterns

## Task 5: Technical Requirements

### Technology Stack
- **Frontend**: Angular 13+
  - Angular Material for UI components
  - NgRx for state management
  - Chart.js or D3.js for data visualization
  - Progressive Web App capabilities

- **Backend**: Python fastAPI
  -  Security for authentication
  - database operations with MySQL
  - RESTful API design
  - JWT for stateless authentication

- **Database**:
  - PostgreSQL for relational data
  - Redis for caching and session management

- **DevOps**:
  - Docker containerization
  - CI/CD pipeline with Jenkins or GitHub Actions
  - AWS/Azure cloud hosting

### Technical Specifications
1. **API Design**
   - RESTful endpoints following standard conventions
   - Swagger/OpenAPI documentation
   - Rate limiting and throttling for security
   - Versioned API for future compatibility

2. **Security Implementation**
   - HTTPS encryption
   - OAuth 2.0 authentication
   - Password hashing (BCrypt)
   - CSRF protection
   - Input validation and sanitization

3. **Data Management**
   - Database migration strategy
   - Backup procedures
   - Data retention policies
   - GDPR compliance measures

4. **Performance Optimization**
   - Frontend bundle optimization
   - Lazy loading for Angular modules
   - Database query optimization
   - Image and asset optimization
   - Caching strategies

5. **Testing Requirements**
   - Unit testing with JUnit and Jasmine
   - Integration testing
   - End-to-end testing with Cypress
   - Accessibility testing (WCAG compliance)
   - Security testing (OWASP guidelines)

6. **Monitoring & Analytics**
   - Application performance monitoring
   - Error tracking and logging
   - User analytics implementation
   - Health check endpoints
   - Alerting system for critical issues

# Technical Design Specifications

## Data Models

### User Model
```python
public class User {
    private Long id;
    private String username;
    private String email;
    private String passwordHash;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    private UserPreferences preferences;
    private List<JournalEntry> journalEntries;
}

public class UserPreferences {
    private Long id;
    private Long userId;
    private boolean darkMode;
    private String timeZone;
    private boolean emailNotifications;
    private String reminderTime;
    private ThemePreference themePreference;
}
```

### Journal Entry Model
```java
public class JournalEntry {
    private Long id;
    private Long userId;
    private String title;
    private String content;
    private LocalDateTime entryDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Mood mood;
    private Integer moodIntensity; // 1-10 scale
    private List<Tag> tags;
    private Weather weather; // Optional
    private Location location; // Optional
}

public class Tag {
    private Long id;
    private String name;
    private Long userId; // For user-specific tags
}
```

### Mood Model
```java
public class Mood {
    private Long id;
    private String name;
    private String description;
    private String color; // For visualization
    private MoodCategory category;
}

public enum MoodCategory {
    POSITIVE, NEGATIVE, NEUTRAL
}
```

### Analytics Model
```java
public class MoodSummary {
    private Long userId;
    private Map<String, Integer> moodFrequency;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double averageMoodIntensity;
    private Mood mostFrequentMood;
}
```

## Database Design

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);
```

#### User Preferences Table
```sql
CREATE TABLE user_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    dark_mode BOOLEAN DEFAULT FALSE,
    time_zone VARCHAR(50) DEFAULT 'UTC',
    email_notifications BOOLEAN DEFAULT TRUE,
    reminder_time VARCHAR(10),
    theme_preference VARCHAR(20) DEFAULT 'DEFAULT',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Journal Entries Table
```sql
CREATE TABLE journal_entries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    entry_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    mood_id BIGINT,
    mood_intensity INT CHECK (mood_intensity BETWEEN 1 AND 10),
    weather VARCHAR(100),
    location VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (mood_id) REFERENCES moods(id)
);
```

#### Moods Table
```sql
CREATE TABLE moods (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    color VARCHAR(20) NOT NULL,
    category ENUM('POSITIVE', 'NEGATIVE', 'NEUTRAL') NOT NULL
);
```

#### Tags Table
```sql
CREATE TABLE tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tag_user (name, user_id)
);
```

#### Journal Entry Tags Table (Many-to-Many)
```sql
CREATE TABLE journal_entry_tags (
    journal_entry_id BIGINT,
    tag_id BIGINT,
    PRIMARY KEY (journal_entry_id, tag_id),
    FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

#### Indexes
```sql
CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX idx_journal_entries_entry_date ON journal_entries(entry_date);
CREATE INDEX idx_journal_entries_mood_id ON journal_entries(mood_id);
CREATE INDEX idx_tags_user_id ON tags(user_id);
```

## API Design

### RESTful Endpoints

#### Authentication
```
POST /api/v1/auth/register - User registration
POST /api/v1/auth/login - User login
POST /api/v1/auth/refresh - Refresh token
POST /api/v1/auth/logout - User logout
POST /api/v1/auth/forgot-password - Password reset request
POST /api/v1/auth/reset-password - Set new password
```

#### User Management
```
GET /api/v1/users/me - Get current user profile
PUT /api/v1/users/me - Update user profile
PUT /api/v1/users/me/password - Update password
GET /api/v1/users/me/preferences - Get user preferences
PUT /api/v1/users/me/preferences - Update user preferences
```

#### Journal Entries
```
GET /api/v1/journals - Get all journal entries (paginated)
POST /api/v1/journals - Create new journal entry
GET /api/v1/journals/{id} - Get specific journal entry
PUT /api/v1/journals/{id} - Update journal entry
DELETE /api/v1/journals/{id} - Delete journal entry
GET /api/v1/journals/search?query={query} - Search journal entries
```

#### Mood Tracking
```
GET /api/v1/moods - Get all available moods
GET /api/v1/moods/categories - Get mood categories
GET /api/v1/journals/moods/summary - Get mood summary/statistics
GET /api/v1/journals/moods/timeline - Get mood timeline
```

#### Tags
```
GET /api/v1/tags - Get all user tags
POST /api/v1/tags - Create new tag
PUT /api/v1/tags/{id} - Update tag
DELETE /api/v1/tags/{id} - Delete tag
GET /api/v1/journals/tags/{tagId} - Get entries by tag
```

### API Security
- JWT-based authentication
- Token validation middleware
- Role-based access control
- Rate limiting (max 100 requests per minute per user)
- Request validation using Bean Validation (JSR 380)

## Frontend Design

### Page Layout
1. **Landing Page**
   - Brief application overview
   - Login/Registration forms
   - Application highlights

2. **Dashboard**
   - Summary of recent journal entries
   - Mood visualization (weekly/monthly)
   - Quick entry form
   - Streak calendar

3. **Journal Entry Page**
   - Rich text editor (with formatting options)
   - Mood selection component
   - Tag selection/creation
   - Optional metadata (weather, location)

4. **Journal List Page**
   - Paginated list of journal entries
   - Filtering options (by date, mood, tags)
   - Search functionality
   - Sorting options

5. **Mood Analytics Page**
   - Timeline mood chart
   - Mood distribution pie chart
   - Mood intensity line graph
   - Correlation insights

6. **Settings Page**
   - User profile management
   - Notification preferences
   - Theme selection
   - Privacy settings

### Component Structure

#### Angular Components
```typescript
// Core Components
- AppComponent
- HeaderComponent
- FooterComponent
- SideNavigationComponent
- NotificationComponent

// Authentication Components
- LoginComponent
- RegisterComponent
- ForgotPasswordComponent
- ResetPasswordComponent

// Journal Components
- JournalListComponent
- JournalEntryComponent
- JournalEditorComponent
- MoodSelectorComponent
- TagSelectorComponent

// Analytics Components
- MoodTimelineComponent
- MoodDistributionComponent
- MoodIntensityGraphComponent
- StreakCalendarComponent

// Settings Components
- UserProfileComponent
- UserPreferencesComponent
- ThemeSettingsComponent
- NotificationSettingsComponent
```

### Angular Services
```typescript
// Core Services
- AuthService
- JournalService
- MoodService
- TagService
- AnalyticsService
- UserService
- NotificationService
- ThemeService
- LocalStorageService
- ErrorHandlingService
```

### State Management
Using NgRx for state management:
```typescript
// Store slices
- Auth State
- Journal State
- Mood State
- User State
- UI State

// Effects
- AuthEffects
- JournalEffects
- MoodEffects
- UserEffects
```

## Technical Infrastructure

### Development Environment
- Java 21 with Spring Boot 3.x
- Angular 20 with TypeScript
- MySQL 8.0
- Docker for containerization
- Git for version control
- Maven for Java dependency management
- npm for JavaScript dependency management

### CI/CD Pipeline
- GitHub Actions for continuous integration
- Automated tests on pull requests
- Build and deployment automation
- Code quality checks (SonarQube)

### Deployment Architecture
- Frontend: Nginx serving Angular SPA
- Backend: Spring Boot application in Docker container
- Database: MySQL in Docker container
- Load balancer for horizontal scaling
- Redis for caching and session management

### Performance Optimization
- Angular Ahead-of-Time compilation
- Lazy loading of Angular modules
- API response caching
- Database query optimization
- Compression of HTTP responses
- CDN for static assets

### Security Measures
- HTTPS with TLS 1.3
- Content Security Policy
- XSS protection
- CSRF protection
- SQL injection prevention
- Regular dependency security audits

## Monitoring and Analytics
- Application performance monitoring with Spring Actuator
- Custom metrics for business insights
- Error tracking and logging with ELK stack
- User behavior analytics (opt-in)
- Health check endpoints

## Spring Boot Project Structure Generation

To create the base project structure for the backend API using Java Spring Boot, run the following command (replace `com.example.dailyjournal` with your desired package name):

```sh
mvn archetype:generate -DgroupId=com.example.dailyjournal -DartifactId=dailyjournal-backend -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
```

Or, use [Spring Initializr](https://start.spring.io/) with these settings:
- Project: Maven Project
- Language: Java
- Spring Boot: 3.x
- Group: `com.example.dailyjournal`
- Artifact: `dailyjournal-backend`
- Dependencies: Spring Web, Spring Security, Spring Data JPA, MySQL Driver, Lombok, Validation, Spring Boot DevTools, JWT, Spring Boot Actuator

After downloading/unzipping, your structure will look like:

```
dailyjournal-backend/
├── src/
│   ├── main/
│   │   ├── java/com/example/dailyjournal/
│   │   │   ├── controller/
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   ├── service/
│   │   │   └── DailyjournalBackendApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/
│   └── test/
│       └── java/com/example/dailyjournal/
├── pom.xml
└── README.md
```

This technical design provides a comprehensive blueprint for implementing the Daily Journal & Mood Analyzer application using Java 21, Angular 20, MySQL, REST APIs, and Bootstrap.

---

## How to Run the FastAPI Backend (Local)

1. **Install Python dependencies**  
   Open a terminal in the project root and run:
   ```
   pip install -r requirements.txt
   ```

2. **Configure MySQL**  
   - Ensure MySQL is running.
   - Database: `daily_journal`
   - User: `root`
   - Password: `pass@word1`
   - Update `.env` if needed.

3. **Create Database Tables**  
   In the terminal, run Python and execute:
   ```python
   from model.models import create_tables
   create_tables()
   ```

4. **Start the FastAPI server**  
   From the `src/backend` directory, run:
   ```
   uvicorn main:app --reload
   ```

5. **Open API docs**  
   Visit [http://localhost:8000/docs](http://localhost:8000/docs) in your browser.
