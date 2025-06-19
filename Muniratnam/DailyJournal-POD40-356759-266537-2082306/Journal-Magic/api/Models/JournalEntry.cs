namespace JournalMagic.Models
{
    public class JournalEntry
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int MoodRating { get; set; } = 3; // Default to neutral (assuming 1-5 scale)
        public string MoodEmoji { get; set; } = "😐"; // Default emoji
        public List<string> Activities { get; set; } = new List<string>();
        public List<string> Tags { get; set; } = new List<string>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class MoodData
    {
        public DateTime Date { get; set; }
        public int MoodRating { get; set; }
        public string MoodEmoji { get; set; } = string.Empty;
        public string? JournalEntryId { get; set; }
    }

    public class MoodAnalysis
    {
        public double AverageMood { get; set; }
        public List<MoodTrend> MoodTrend { get; set; } = new List<MoodTrend>();
        public List<ActivityCorrelation> CommonActivities { get; set; } = new List<ActivityCorrelation>();
        public List<string> Insights { get; set; } = new List<string>();
    }

    public class MoodTrend
    {
        public DateTime Date { get; set; }
        public double Value { get; set; }
    }

    public class ActivityCorrelation
    {
        public string Activity { get; set; } = string.Empty;
        public double Correlation { get; set; }
    }
}
