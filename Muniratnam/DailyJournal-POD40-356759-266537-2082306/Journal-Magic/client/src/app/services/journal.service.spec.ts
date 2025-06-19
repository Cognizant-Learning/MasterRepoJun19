import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JournalService } from './journal.service';
import { environment } from '../../../environments/environment';

describe('JournalService', () => {
  let service: JournalService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JournalService]
    });
    
    service = TestBed.inject(JournalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getJournalEntries', () => {
    it('should return journal entries from the API', () => {
      const mockEntries = [
        { id: '1', title: 'Test Entry 1', content: 'Content 1', mood: 5, date: new Date(), tags: ['work'] },
        { id: '2', title: 'Test Entry 2', content: 'Content 2', mood: 3, date: new Date(), tags: ['personal'] }
      ];

      service.getJournalEntries().subscribe(entries => {
        expect(entries.length).toBe(2);
        expect(entries).toEqual(mockEntries);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/journal`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEntries);
    });
  });

  describe('getJournalEntryById', () => {
    it('should return a single journal entry by ID', () => {
      const mockEntry = { 
        id: '1', 
        title: 'Test Entry', 
        content: 'Content', 
        mood: 5, 
        date: new Date(), 
        tags: ['work'] 
      };

      service.getJournalEntryById('1').subscribe(entry => {
        expect(entry).toEqual(mockEntry);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/journal/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEntry);
    });
  });

  describe('createJournalEntry', () => {
    it('should create a new journal entry', () => {
      const mockEntry = { 
        title: 'New Entry', 
        content: 'New Content', 
        mood: 4, 
        date: new Date(), 
        tags: ['personal'] 
      };

      const mockResponse = { 
        id: '3', 
        ...mockEntry 
      };

      service.createJournalEntry(mockEntry).subscribe(entry => {
        expect(entry).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/journal`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockEntry);
      req.flush(mockResponse);
    });
  });

  describe('updateJournalEntry', () => {
    it('should update an existing journal entry', () => {
      const mockEntry = { 
        id: '1', 
        title: 'Updated Entry', 
        content: 'Updated Content', 
        mood: 2, 
        date: new Date(), 
        tags: ['work', 'update'] 
      };

      service.updateJournalEntry('1', mockEntry).subscribe(entry => {
        expect(entry).toEqual(mockEntry);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/journal/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockEntry);
      req.flush(mockEntry);
    });
  });

  describe('deleteJournalEntry', () => {
    it('should delete a journal entry', () => {
      service.deleteJournalEntry('1').subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/journal/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});
