import { Component, Input, OnInit } from '@angular/core';
import { CommonModule,CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,CurrencyPipe],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  @Input() serviceId!: string;
  @Input() servicePrice: number = 0;
  
  bookingForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private bookingService: BookingService,
    private router: Router
  ) {
    this.bookingForm = this.formBuilder.group({
      bookingDate: ['', Validators.required],
      notes: ['']
    });
  }
  
  ngOnInit(): void {
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    
    // Set maximum date to 3 months from now
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    const maxDateStr = maxDate.toISOString().split('T')[0];
    
    // Update the form control with validators
    this.bookingForm.get('bookingDate')?.setValidators([
      Validators.required,
      this.dateValidator(minDate, maxDateStr)
    ]);
  }
  
  // Custom date validator
  dateValidator(min: string, max: string) {
    return (control: any) => {
      const value = control.value;
      if (!value) {
        return null;
      }
      
      const dateValue = new Date(value);
      const minDate = new Date(min);
      const maxDate = new Date(max);
      
      if (dateValue < minDate) {
        return { dateMin: true };
      }
      
      if (dateValue > maxDate) {
        return { dateMax: true };
      }
      
      return null;
    };
  }
  
  // Convenience getter for easy access to form fields
  get f() { return this.bookingForm.controls; }
  
  onSubmit(): void {
    this.submitted = true;
    
    // Reset messages
    this.error = '';
    this.success = '';
    
    // Stop here if form is invalid
    if (this.bookingForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    this.bookingService.createBooking({
      serviceId: this.serviceId,
      bookingDate: this.f['bookingDate'].value,
      notes: this.f['notes'].value
    }).subscribe({
      next: (response) => {
        this.success = 'Réservation créée avec succès!';
        this.loading = false;
        
        // Redirect to bookings page after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/bookings']);
        }, 2000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Erreur lors de la création de la réservation';
        this.loading = false;
      }
    });
  }
}