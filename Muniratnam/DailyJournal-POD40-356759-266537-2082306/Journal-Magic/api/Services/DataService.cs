using JournalMagic.Models;

namespace JournalMagic.Services
{
    public class DataService
    {
        // In-memory storage
        public List<User> Users { get; private set; }
        public List<JournalEntry> JournalEntries { get; private set; }

        public DataService()
        {
            // Initialize in-memory storage with sample data
            Users = new List<User>
            {
                new User
                {
                    Id = "1",
                    Username = "testuser",
                    Email = "test@example.com",
                    FirstName = "Test",
                    LastName = "User",
                    // Hash of "password"
                    PasswordHash = "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=",
                    CreatedAt = DateTime.UtcNow.AddDays(-30),
                    LastLogin = DateTime.UtcNow.AddDays(-1)
                }
            };

            JournalEntries = new List<JournalEntry>
            {
                new JournalEntry
                {
                    Id = "1",
                    UserId = "1",
                    Title = "My First Journal Entry",
                    Content = "Today was a productive day. I worked on my new project and made good progress.",
                    MoodRating = 4,
                    MoodEmoji = "😊",
                    Activities = new List<string> { "Coding", "Reading", "Exercise" },
                    Tags = new List<string> { "productive", "work", "personal" },
                    CreatedAt = DateTime.UtcNow.AddDays(-7),
                    UpdatedAt = DateTime.UtcNow.AddDays(-7)
                },
                new JournalEntry
                {
                    Id = "2",
                    UserId = "1",
                    Title = "Feeling Stressed",
                    Content = "Today was challenging. I had multiple deadlines and felt overwhelmed at times.",
                    MoodRating = 2,
                    MoodEmoji = "😔",
                    Activities = new List<string> { "Work", "Meetings" },
                    Tags = new List<string> { "stress", "work" },
                    CreatedAt = DateTime.UtcNow.AddDays(-4),
                    UpdatedAt = DateTime.UtcNow.AddDays(-4)
                },
                new JournalEntry
                {
                    Id = "3",
                    UserId = "1",
                    Title = "Weekend Relaxation",
                    Content = "Spent the weekend relaxing and recharging. Went for a hike and did some reading.",
                    MoodRating = 5,
                    MoodEmoji = "🤩",
                    Activities = new List<string> { "Hiking", "Reading", "Relaxation" },
                    Tags = new List<string> { "weekend", "relaxation", "outdoors" },
                    CreatedAt = DateTime.UtcNow.AddDays(-2),
                    UpdatedAt = DateTime.UtcNow.AddDays(-2)
                }
            };
        }

        // User methods
        public User? GetUserById(string id)
        {
            return Users.FirstOrDefault(u => u.Id == id);
        }

        public User? GetUserByEmail(string email)
        {
            return Users.FirstOrDefault(u => u.Email.ToLower() == email.ToLower());
        }

        public void AddUser(User user)
        {
            Users.Add(user);
        }

        public void UpdateUser(User updatedUser)
        {
            var existingUser = Users.FirstOrDefault(u => u.Id == updatedUser.Id);
            if (existingUser != null)
            {
                var index = Users.IndexOf(existingUser);
                Users[index] = updatedUser;
            }
        }

        // Journal methods
        public JournalEntry? GetJournalEntryById(string id)
        {
            return JournalEntries.FirstOrDefault(j => j.Id == id);
        }

        public List<JournalEntry> GetJournalEntriesByUser(string userId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = JournalEntries.Where(j => j.UserId == userId);

            if (startDate.HasValue)
                query = query.Where(j => j.CreatedAt >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(j => j.CreatedAt <= endDate.Value);

            return query.OrderByDescending(j => j.CreatedAt).ToList();
        }

        public void AddJournalEntry(JournalEntry entry)
        {
            JournalEntries.Add(entry);
        }

        public void UpdateJournalEntry(JournalEntry updatedEntry)
        {
            var existingEntry = JournalEntries.FirstOrDefault(j => j.Id == updatedEntry.Id);
            if (existingEntry != null)
            {
                updatedEntry.UpdatedAt = DateTime.UtcNow;
                var index = JournalEntries.IndexOf(existingEntry);
                JournalEntries[index] = updatedEntry;
            }
        }

        public void DeleteJournalEntry(string id)
        {
            var entry = JournalEntries.FirstOrDefault(j => j.Id == id);
            if (entry != null)
            {
                JournalEntries.Remove(entry);
            }
        }

        // Mood analysis methods
        public List<MoodData> GetMoodDataByUser(string userId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var entries = GetJournalEntriesByUser(userId, startDate, endDate);
            return entries.Select(e => new MoodData
            {
                Date = e.CreatedAt,
                MoodRating = e.MoodRating,
                MoodEmoji = e.MoodEmoji,
                JournalEntryId = e.Id
            }).ToList();
        }

        public MoodAnalysis GetMoodAnalysis(string userId, string timeframe)
        {
            var startDate = timeframe switch
            {
                "week" => DateTime.UtcNow.AddDays(-7),
                "month" => DateTime.UtcNow.AddMonths(-1),
                "year" => DateTime.UtcNow.AddYears(-1),
                _ => DateTime.UtcNow.AddDays(-30) // Default to month
            };

            var entries = GetJournalEntriesByUser(userId, startDate);
            var moodData = GetMoodDataByUser(userId, startDate);

            if (!entries.Any())
            {
                return new MoodAnalysis
                {
                    AverageMood = 0,
                    Insights = new List<string> { "Not enough data for analysis yet." }
                };
            }

            // Calculate average mood
            var averageMood = entries.Average(e => e.MoodRating);

            // Calculate mood trends
            var moodTrends = CalculateMoodTrends(entries, timeframe);

            // Calculate activity correlations
            var activityCorrelations = CalculateActivityCorrelations(entries);

            // Generate insights
            var insights = GenerateInsights(entries, averageMood, activityCorrelations);

            return new MoodAnalysis
            {
                AverageMood = averageMood,
                MoodTrend = moodTrends,
                CommonActivities = activityCorrelations,
                Insights = insights
            };
        }

        private List<MoodTrend> CalculateMoodTrends(List<JournalEntry> entries, string timeframe)
        {
            var trends = new List<MoodTrend>();

            if (!entries.Any())
                return trends;

            // Group by date based on timeframe
            var groupedEntries = timeframe switch
            {
                "week" => entries.GroupBy(e => e.CreatedAt.Date),
                "month" => entries.GroupBy(e => e.CreatedAt.Date),
                "year" => entries.GroupBy(e => new DateTime(e.CreatedAt.Year, e.CreatedAt.Month, 1)),
                _ => entries.GroupBy(e => e.CreatedAt.Date)
            };

            // Calculate average mood for each group
            foreach (var group in groupedEntries)
            {
                trends.Add(new MoodTrend
                {
                    Date = group.Key,
                    Value = group.Average(e => e.MoodRating)
                });
            }

            return trends.OrderBy(t => t.Date).ToList();
        }

        private List<ActivityCorrelation> CalculateActivityCorrelations(List<JournalEntry> entries)
        {
            var result = new List<ActivityCorrelation>();

            // Get all unique activities
            var activities = entries
                .SelectMany(e => e.Activities)
                .GroupBy(a => a)
                .Select(g => g.Key)
                .ToList();

            // For each activity, find the average mood rating when that activity is present
            foreach (var activity in activities)
            {
                var entriesWithActivity = entries.Where(e => e.Activities.Contains(activity)).ToList();
                
                if (entriesWithActivity.Any())
                {
                    var correlation = entriesWithActivity.Average(e => e.MoodRating);
                    
                    result.Add(new ActivityCorrelation
                    {
                        Activity = activity,
                        Correlation = correlation
                    });
                }
            }

            // Sort by correlation (highest to lowest)
            return result.OrderByDescending(a => a.Correlation).ToList();
        }

        private List<string> GenerateInsights(List<JournalEntry> entries, double averageMood, List<ActivityCorrelation> activities)
        {
            var insights = new List<string>();

            // Add insight about average mood
            var moodDescription = averageMood switch
            {
                >= 4.5 => "excellent",
                >= 3.5 => "good",
                >= 2.5 => "average",
                >= 1.5 => "below average",
                _ => "poor"
            };

            insights.Add($"Your average mood has been {moodDescription} during this period.");

            // Add insights about activities
            if (activities.Any())
            {
                var topActivities = activities.Take(3).ToList();
                
                if (topActivities.Any(a => a.Correlation >= 4))
                {
                    var positiveActivities = topActivities
                        .Where(a => a.Correlation >= 4)
                        .Select(a => a.Activity)
                        .ToList();
                    
                    if (positiveActivities.Count == 1)
                    {
                        insights.Add($"{positiveActivities[0]} appears to have a positive effect on your mood.");
                    }
                    else if (positiveActivities.Count > 1)
                    {
                        var activitiesString = string.Join(", ", positiveActivities.Take(positiveActivities.Count - 1)) + 
                                            " and " + positiveActivities.Last();
                        insights.Add($"{activitiesString} appear to have a positive effect on your mood.");
                    }
                }

                if (topActivities.Any(a => a.Correlation <= 2))
                {
                    var negativeActivities = topActivities
                        .Where(a => a.Correlation <= 2)
                        .Select(a => a.Activity)
                        .ToList();
                    
                    if (negativeActivities.Count == 1)
                    {
                        insights.Add($"{negativeActivities[0]} appears to be associated with lower mood.");
                    }
                    else if (negativeActivities.Count > 1)
                    {
                        var activitiesString = string.Join(", ", negativeActivities.Take(negativeActivities.Count - 1)) + 
                                            " and " + negativeActivities.Last();
                        insights.Add($"{activitiesString} appear to be associated with lower mood.");
                    }
                }
            }

            // Add insight about entries frequency
            var daySpan = (entries.Max(e => e.CreatedAt) - entries.Min(e => e.CreatedAt)).Days + 1;
            var entriesPerDay = (double)entries.Count / daySpan;

            if (entriesPerDay >= 1)
            {
                insights.Add("You've been consistently journaling during this period. Great work!");
            }
            else if (entriesPerDay >= 0.5)
            {
                insights.Add("You're journaling regularly, but might benefit from increasing your frequency.");
            }
            else
            {
                insights.Add("Consider journaling more frequently to get better insights into your mood patterns.");
            }

            return insights;
        }
    }
}
