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
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes HTTP en attente
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter users based on search query', fakeAsync(() => {
    // Simuler les données retournées par l'API
    const mockUsers = [
      { id: 1, name: 'Leanne Graham', username: 'Bret', email: 'Sincere@april.biz' },
      { id: 2, name: 'Ervin Howell', username: 'Antonette', email: 'Shanna@melissa.tv' }
    ];

    // Simuler l'entrée de l'utilisateur
    component.searchControl.setValue('Leanne');
    tick(300); // Simuler le délai du debounce

    // Vérifier que la requête HTTP est envoyée
    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers); // Retourner les données simulées

    // Vérifier que les résultats sont correctement filtrés
    expect(component.searchResults.length).toBe(1);
    expect(component.searchResults[0].name).toBe('Leanne Graham');
  }));

  it('should debounce input', fakeAsync(() => {
    component.searchControl.setValue('Le');
    tick(100); // Première frappe

    component.searchControl.setValue('Lea');
    tick(100); // Deuxième frappe

    component.searchControl.setValue('Leanne');
    tick(300); // Attendre le délai du debounce

    // Vérifier qu'une seule requête HTTP est envoyée après le debounce
    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
    expect(req.request.method).toBe('GET');
    req.flush([]);

    expect(component.searchResults.length).toBe(0); // Pas de résultats car la réponse est vide
  }));
});
