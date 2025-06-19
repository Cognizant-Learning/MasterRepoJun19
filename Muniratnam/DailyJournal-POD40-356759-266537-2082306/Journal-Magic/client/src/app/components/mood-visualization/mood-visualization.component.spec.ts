import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { MoodVisualizationComponent } from './mood-visualization.component';
import { JournalService } from '../../services/journal.service';

describe('MoodVisualizationComponent', () => {
  let component: MoodVisualizationComponent;
  let fixture: ComponentFixture<MoodVisualizationComponent>;
  let journalService: jasmine.SpyObj<JournalService>;

  const mockJournalEntries = [
    { id: '1', title: 'Entry 1', content: 'Content 1', mood: 5, date: new Date('2025-06-10'), tags: ['work'] },
    { id: '2', title: 'Entry 2', content: 'Content 2', mood: 3, date: new Date('2025-06-11'), tags: ['personal'] },
    { id: '3', title: 'Entry 3', content: 'Content 3', mood: 4, date: new Date('2025-06-12'), tags: ['health'] },
    { id: '4', title: 'Entry 4', content: 'Content 4', mood: 2, date: new Date('2025-06-13'), tags: ['work'] },
    { id: '5', title: 'Entry 5', content: 'Content 5', mood: 5, date: new Date('2025-06-14'), tags: ['personal'] }
  ];

  beforeEach(async () => {
    const journalServiceSpy = jasmine.createSpyObj('JournalService', ['getJournalEntries']);
    journalServiceSpy.getJournalEntries.and.returnValue(of(mockJournalEntries));

    await TestBed.configureTestingModule({
      declarations: [MoodVisualizationComponent],
      providers: [{ provide: JournalService, useValue: journalServiceSpy }]
    }).compileComponents();

    journalService = TestBed.inject(JournalService) as jasmine.SpyObj<JournalService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoodVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch journal entries on init', () => {
    expect(journalService.getJournalEntries).toHaveBeenCalled();
    expect(component.journalEntries.length).toBe(5);
  });

  it('should calculate average mood correctly', () => {
    // Average mood = (5 + 3 + 4 + 2 + 5) / 5 = 3.8
    expect(component.averageMood).toBeCloseTo(3.8);
  });

  it('should identify mood trends correctly', () => {
    // This will depend on your implementation, but here's an example test
    expect(component.moodTrends).toBeDefined();
    // Further assertions based on your trend calculation logic
  });

  it('should render the chart component', () => {
    const chartElement = fixture.debugElement.query(By.css('.mood-chart'));
    expect(chartElement).toBeTruthy();
  });

  it('should display mood insights', () => {
    const insightsElement = fixture.debugElement.query(By.css('.mood-insights'));
    expect(insightsElement).toBeTruthy();
    // Add more specific assertions based on your component's template
  });
});
