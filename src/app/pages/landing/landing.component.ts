import { Component } from '@angular/core';
import { OcrOpenaiService } from '../../services/ocr-openai.service';
import { EmailContactRequest } from '../../models/backend-dto.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  constructor(private ocrOpenaiService: OcrOpenaiService) {}

  sendContactMail(name: string, email: string, message: string) {
    const contactRequest: EmailContactRequest = new EmailContactRequest(name, email, message);
    this.ocrOpenaiService.sendContactMail(contactRequest).subscribe(response => {
      console.log('Email sent successfully', response);
    }, error => {
      console.error('Error sending email', error);
    });
  }
}
