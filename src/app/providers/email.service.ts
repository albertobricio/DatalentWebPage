import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  async sendMail(payload: any): Promise<boolean> {
    try {
      await emailjs.send(
        environment.emailjsServiceId,
        environment.emailjsTemplateId,
        payload,
        environment.emailjsPublicKey
      );
      return true;
    } catch (err) {
      console.error('EmailJS send error:', err);
      return false;
    }
  }
}
