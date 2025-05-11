import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable, throwError } from "rxjs"
import { tap, catchError } from "rxjs/operators"
import  { Router } from "@angular/router"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:5000" 
  private currentUserSubject: BehaviorSubject<any>
  public currentUser$: Observable<any>
  private isAuthenticatedSubject: BehaviorSubject<boolean>
  public isAuthenticated$: Observable<boolean>

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(this.getUserFromLocalStorage())
    this.currentUser$ = this.currentUserSubject.asObservable()
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.getToken() ? true : false)
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable()
  }

  public get currentUserValue() {
    return this.currentUserSubject.value
  }

  getToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }

  getUserFromLocalStorage() {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
      return user ? JSON.parse(user) : null
    }
    return null
  }

  // Add the autoLogin method that was missing
  autoLogin() {
    const token = this.getToken()
    const user = this.getUserFromLocalStorage()

    if (token && user) {
      this.currentUserSubject.next(user)
      this.isAuthenticatedSubject.next(true)
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((response) => {
        // Store token in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("token", response.token)
          localStorage.setItem("user", JSON.stringify(response.user))
        }
        this.currentUserSubject.next(response.user)
        this.isAuthenticatedSubject.next(true)
      }),
      catchError((error) => {
        console.error("Login failed:", error)
        return throwError(() => new Error(error.error?.message || "Login failed. Please try again."))
      }),
    )
  }

  register(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, userData).pipe(
      catchError((error) => {
        console.error("Registration failed:", error)
        return throwError(() => new Error(error.error?.message || "Registration failed. Please try again."))
      }),
    )
  }

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
    this.currentUserSubject.next(null)
    this.isAuthenticatedSubject.next(false)
    this.router.navigate(["/login"])
  }

  isLoggedIn(): boolean {
    return !!this.getToken()
  }
}
