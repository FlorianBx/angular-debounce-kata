import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchbarComponent } from './searchbar.component';

describe('SearchbarComponent', () => {
  let component: SearchbarComponent;
  let fixture: ComponentFixture<SearchbarComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, SearchbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchbarComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter users based on search query', fakeAsync(() => {
    const mockUsers = [
      { id: 1, name: 'Leanne Graham', username: 'Bret', email: 'Sincere@april.biz' },
      { id: 2, name: 'Ervin Howell', username: 'Antonette', email: 'Shanna@melissa.tv' }
    ];

    component.searchControl.setValue('Leanne');
    tick(300);

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);

    expect(component.searchResults.length).toBe(1);
    expect(component.searchResults[0].name).toBe('Leanne Graham');
  }));

  it('should debounce input', fakeAsync(() => {
    component.searchControl.setValue('Le');
    tick(100);

    component.searchControl.setValue('Lea');
    tick(100);

    component.searchControl.setValue('Leanne');
    tick(300);

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
    expect(req.request.method).toBe('GET');
    req.flush([]);

    expect(component.searchResults.length).toBe(0);
  }));
});
