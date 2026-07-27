import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  async sendMail(payload: any): Promise<boolean> {
    // Validación básica de payload para evitar XSS y abuso
    if (!payload || typeof payload !== 'object') return false;
    // todo: agregar más validaciones según el esquema esperado
    // if (!payload.user_email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(payload.user_email)) return false;
    if (payload.message && payload.message.length > 2000) return false;
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
