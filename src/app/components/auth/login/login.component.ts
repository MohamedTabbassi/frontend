import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import {  Router, RouterModule } from "@angular/router"
import  { AuthService } from "../../../services/auth.service"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginData = {
    email: "",
    password: "",
  }
  loading = false
  errorMessage = ""

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(["/"])
    }
  }

  onSubmit(): void {
    this.loading = true
    this.errorMessage = ""

    // Validate form
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = "Veuillez remplir tous les champs."
      this.loading = false
      return
    }

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: () => {
        this.loading = false
        this.router.navigate(["/"])
      },
      error: (error) => {
        this.loading = false
        this.errorMessage = error.message || "Échec de la connexion. Veuillez vérifier vos identifiants."
        console.error("Login error:", error)
      },
    })
  }
}
