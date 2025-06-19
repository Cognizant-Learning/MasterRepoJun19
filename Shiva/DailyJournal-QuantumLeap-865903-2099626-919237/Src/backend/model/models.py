from sqlalchemy import Column, ForeignKey, Integer, String, Text, TIMESTAMP, SmallInteger, CheckConstraint
from sqlalchemy.orm import relationship
from db import Base, engine

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, server_default='CURRENT_TIMESTAMP')
    last_login = Column(TIMESTAMP)
    active = Column(Integer, default=1)

    preferences = relationship("UserPreferences", back_populates="user", uselist=False)
    journal_entries = relationship("JournalEntry", back_populates="user")


class UserPreferences(Base):
    __tablename__ = 'user_preferences'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    dark_mode = Column(Integer, default=0)
    time_zone = Column(String(50), default='UTC')
    email_notifications = Column(Integer, default=1)
    reminder_time = Column(String(10))
    theme_preference = Column(String(20), default='DEFAULT')

    user = relationship("User", back_populates="preferences")


class JournalEntry(Base):
    __tablename__ = 'journal_entries'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    entry_date = Column(TIMESTAMP, nullable=False)
    created_at = Column(TIMESTAMP, server_default='CURRENT_TIMESTAMP')
    updated_at = Column(TIMESTAMP, server_default='CURRENT_TIMESTAMP', onupdate='CURRENT_TIMESTAMP')
    mood_id = Column(Integer, ForeignKey('moods.id'))
    mood_intensity = Column(SmallInteger, CheckConstraint('mood_intensity BETWEEN 1 AND 10'))
    weather = Column(String(100))
    location = Column(String(255))

    user = relationship("User", back_populates="journal_entries")
    mood = relationship("Mood")
    tags = relationship("Tag", secondary="journal_entry_tags")


class Mood(Base):
    __tablename__ = 'moods'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    description = Column(String(255))
    color = Column(String(20), nullable=False)
    category = Column(String(10), nullable=False)

    journal_entries = relationship("JournalEntry")


class Tag(Base):
    __tablename__ = 'tags'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))

    user = relationship("User")
    journal_entries = relationship("JournalEntry", secondary="journal_entry_tags")


class JournalEntryTags(Base):
    __tablename__ = 'journal_entry_tags'

    journal_entry_id = Column(Integer, ForeignKey('journal_entries.id'), primary_key=True)
    tag_id = Column(Integer, ForeignKey('tags.id'), primary_key=True)


# At the end of the file, add:
def create_tables():
    Base.metadata.create_all(bind=engine)