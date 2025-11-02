import { Component, signal, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { CONTACT_SUBJECT_OPTIONS } from '../../shared/constants/contact-subjects';

@Component({
  selector: 'app-contact',
  imports: [RouterLink, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements OnInit {
  // Form fields
  name = signal('');
  email = signal('');
  subject = signal('');
  message = signal('');

  // Form state
  isSubmitting = signal(false);
  isSuccess = signal(false);
  errorMessage = signal('');

  // Subject options (importadas desde constantes compartidas)
  subjectOptions = CONTACT_SUBJECT_OPTIONS;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Check for query params
    this.route.queryParams.subscribe(params => {
      if (params['subject']) {
        this.subject.set(params['subject']);
      }
      if (params['message']) {
        this.message.set(params['message']);
      }
    });
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    // Reset states
    this.errorMessage.set('');
    this.isSuccess.set(false);

    // Validate required fields
    if (!this.name() || !this.email() || !this.subject() || !this.message()) {
      this.errorMessage.set('Por favor, completa todos los campos requeridos.');
      return;
    }

    // Validate email format
    if (!this.validateEmail(this.email())) {
      this.errorMessage.set('Por favor, ingresa un email válido.');
      return;
    }

    this.isSubmitting.set(true);

    try {
      const response = await fetch(`${environment.supabase.url}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${environment.supabase.anonKey}`
        },
        body: JSON.stringify({
          name: this.name(),
          email: this.email(),
          subject: this.subject(),
          message: this.message()
        })
      });

      if (!response.ok) {
        throw new Error('Error al enviar el mensaje');
      }

      // Success
      this.isSuccess.set(true);
      // Reset form
      this.name.set('');
      this.email.set('');
      this.subject.set('');
      this.message.set('');
    } catch (error) {
      console.error('Error sending contact form:', error);
      this.errorMessage.set('Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente o contáctame directamente por Instagram.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
