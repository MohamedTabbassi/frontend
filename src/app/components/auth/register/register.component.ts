import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { AuthService } from "../../../services/auth.service"

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  registerData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  }
  loading = false
  errorMessage = ""
  successMessage = ""

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.loading = true
    this.errorMessage = ""
    this.successMessage = ""

    // Validate form
    if (
      !this.registerData.firstName ||
      !this.registerData.lastName ||
      !this.registerData.email ||
      !this.registerData.password
    ) {
      this.errorMessage = "Veuillez remplir tous les champs obligatoires."
      this.loading = false
      return
    }

    // Validate password match
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = "Les mots de passe ne correspondent pas."
      this.loading = false
      return
    }

    // Validate password strength (optional)
    if (this.registerData.password.length < 6) {
      this.errorMessage = "Le mot de passe doit contenir au moins 6 caractères."
      this.loading = false
      return
    }

    // Create user object (exclude confirmPassword)
    const userData = {
      name: `${this.registerData.firstName} ${this.registerData.lastName}`,
      email: this.registerData.email,
      password: this.registerData.password,
    }

    this.authService.register(userData).subscribe({
      next: () => {
        this.loading = false
        this.successMessage = "Inscription réussie! Vous pouvez maintenant vous connecter."
        setTimeout(() => {
          this.router.navigate(["/login"])
        }, 2000)
      },
      error: (error) => {
        this.loading = false
        this.errorMessage = error.message || "Échec de l'inscription. Veuillez réessayer."
        console.error("Registration error:", error)
      },
    })
  }
}
