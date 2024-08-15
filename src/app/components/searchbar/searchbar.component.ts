import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { User } from '../../types/user';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css',
})
export class SearchbarComponent {
  searchControl = new FormControl();
  searchResults: User[] = [];

constructor(private http: UsersService) {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(query => this.searchUsers(query))
      )
      .subscribe((results: User[]) => {
        this.searchResults = results;
      });
  }

  searchUsers(query: string): Observable<User[]> {
    return this.http.getUsers()
      .pipe(
        map((users: User[]) =>
          users.filter((user: any) =>
            user.name.toLowerCase().includes(query.toLowerCase())
          )
        )
      );
  }
}
