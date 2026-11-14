import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from 'src/environments/environment';

/**
 * Lo único que este servicio acepta enviar. Antes el parámetro era `any` y la
 * única comprobación era el largo del mensaje: cualquier llamada interna podía
 * mandar a EmailJS un objeto con las claves que quisiera.
 */
export interface ContactPayload {
  readonly from_name: string;
  readonly from_email: string;
  readonly company: string;
  readonly service_interest: string;
  readonly message: string;
  readonly to_email: string;
  /**
   * Cualificación opcional. Viajan también dentro de `message`, porque la
   * plantilla de EmailJS solo muestra las variables que tenga definidas y
   * estas dos son nuevas: así llegan aunque nadie toque la plantilla.
   */
  readonly company_size: string;
  readonly phone: string;
}

/** Límites por campo. Los mismos que los `maxlength` del formulario. */
export const CONTACT_LIMITS = {
  nombre: 120,
  email: 254,
  empresa: 160,
  telefono: 30,
  mensaje: 2000,
} as const;

/**
 * Tope del texto que llega en `message`. Es mayor que el del campo porque el
 * formulario antepone al mensaje los datos de cualificación (tamaño de
 * empresa, teléfono).
 */
const MAX_MESSAGE_LENGTH = CONTACT_LIMITS.mensaje + 400;

/** Segundos que deben pasar entre dos envíos desde el mismo navegador. */
const COOLDOWN_SECONDS = 60;
const COOLDOWN_KEY = 'datalentLastContactAt';

const EMAIL_PATTERN = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/;

/**
 * Quita caracteres de control. Un salto de línea dentro del nombre o del
 * email es el vector clásico de inyección de cabeceras en un correo; en el
 * mensaje sí se permiten saltos de línea y tabuladores.
 */
function limpiar(valor: string, multilinea = false): string {
  const patron = multilinea ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g;
  return valor.replace(patron, ' ').trim();
}

export type SendResult = 'ok' | 'invalid' | 'cooldown' | 'error';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  /**
   * Valida, limpia y envía. Devuelve el motivo del fallo para que el
   * formulario pueda decir algo útil en vez de un error genérico.
   *
   * Lo que esto NO es: protección real contra abuso. Todo lo que hay aquí
   * corre en el navegador de quien envía y se puede saltar llamando a la API
   * de EmailJS directamente con la clave pública. Frena envíos accidentales
   * repetidos y a los bots que rellenan formularios; el límite de verdad se
   * configura en el panel de EmailJS (ver docs/seguridad.md).
   */
  async sendMail(payload: ContactPayload): Promise<SendResult> {
    const limpio: ContactPayload = {
      from_name: limpiar(payload.from_name),
      from_email: limpiar(payload.from_email),
      company: limpiar(payload.company),
      service_interest: limpiar(payload.service_interest),
      message: limpiar(payload.message, true),
      to_email: limpiar(payload.to_email),
      company_size: limpiar(payload.company_size),
      phone: limpiar(payload.phone),
    };

    if (
      !limpio.from_name ||
      limpio.from_name.length > CONTACT_LIMITS.nombre ||
      limpio.from_email.length > CONTACT_LIMITS.email ||
      !EMAIL_PATTERN.test(limpio.from_email) ||
      limpio.company.length > CONTACT_LIMITS.empresa ||
      limpio.phone.length > CONTACT_LIMITS.telefono ||
      limpio.company_size.length > 60 ||
      !limpio.message ||
      limpio.message.length > MAX_MESSAGE_LENGTH
    ) {
      return 'invalid';
    }

    if (this.enEspera()) {
      return 'cooldown';
    }

    try {
      await emailjs.send(
        environment.emailjsServiceId,
        environment.emailjsTemplateId,
        { ...limpio },
        environment.emailjsPublicKey,
      );
      this.marcarEnvio();
      return 'ok';
    } catch {
      // No se vuelca el error a la consola: esto corre en el navegador de un
      // visitante, a quien no le sirve de nada, y el formulario ya le ofrece
      // el correo directo como alternativa.
      return 'error';
    }
  }

  private enEspera(): boolean {
    try {
      const ultimo = Number(sessionStorage.getItem(COOLDOWN_KEY));
      return Number.isFinite(ultimo) && ultimo > 0 && Date.now() - ultimo < COOLDOWN_SECONDS * 1000;
    } catch {
      return false;
    }
  }

  private marcarEnvio(): void {
    try {
      sessionStorage.setItem(COOLDOWN_KEY, String(Date.now()));
    } catch {
      // Sin almacenamiento no hay espera entre envíos; no impide enviar.
    }
  }
}
