// Edge Function para enviar email con PDF de la guía usando SendGrid
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')

console.log('Edge Function: send-guide-email iniciada (SendGrid)')

Deno.serve(async (req) => {
  try {
    // Parse el payload del trigger
    const payload = await req.json()
    console.log('Payload recibido:', JSON.stringify(payload))

    // Extraer el email del registro insertado
    const userEmail = payload.record?.email || payload.email

    if (!userEmail) {
      console.error('No se encontró email en el payload')
      return new Response(
        JSON.stringify({ error: 'Email no encontrado en el payload' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Enviando guía a:', userEmail)

    // Validar que existe la API key de SendGrid
    if (!SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY no está configurada')
      return new Response(
        JSON.stringify({ error: 'SENDGRID_API_KEY no configurada' }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // URL del PDF en Supabase Storage
    const pdfUrl = `${SUPABASE_URL}/storage/v1/object/public/guide-pdfs/guia-crianza-consciente.pdf`
    console.log('URL del PDF:', pdfUrl)

    // Descargar el PDF para adjuntarlo
    console.log('Descargando PDF...')
    const pdfResponse = await fetch(pdfUrl)

    if (!pdfResponse.ok) {
      console.error('Error descargando PDF:', pdfResponse.status, pdfResponse.statusText)
      return new Response(
        JSON.stringify({ error: 'No se pudo descargar el PDF' }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const pdfBuffer = await pdfResponse.arrayBuffer()

    // Convertir a base64 de forma segura (sin stack overflow para archivos grandes)
    const uint8Array = new Uint8Array(pdfBuffer)
    let binary = ''
    const chunkSize = 8192 // Procesar en chunks para evitar stack overflow
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length))
      binary += String.fromCharCode.apply(null, Array.from(chunk))
    }
    const pdfBase64 = btoa(binary)

    console.log('PDF descargado y convertido a base64, tamaño:', pdfBuffer.byteLength, 'bytes')

    // Enviar email con SendGrid
    console.log('Enviando email con SendGrid...')
    const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: userEmail }],
            subject: '¡Tu guía de Crianza Consciente está lista! 🌱'
          }
        ],
        from: {
          email: 'hola@mailensteinbrenner.com',
          name: 'Crianzas Conscientes'
        },
        reply_to: {
          email: 'mailensteinbrenner@gmail.com',
          name: 'Mailen'
        },
        content: [
          {
            type: 'text/html',
            value: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #4A5568; text-align: center;">¡Gracias por tu interés! 💚</h1>

                <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">
                  Hola,
                </p>

                <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">
                  Me alegra mucho que hayas decidido comenzar este camino hacia una crianza más consciente y conectada.
                </p>

                <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">
                  Adjunto encontrarás la <strong>Guía de Primeros Pasos en Crianza Consciente</strong> con herramientas prácticas que podrás empezar a aplicar hoy mismo.
                </p>

                <div style="background-color: #F7FAFC; border-left: 4px solid #B8E6D5; padding: 15px; margin: 20px 0;">
                  <p style="color: #4A5568; margin: 0;">
                    💡 <strong>Tip:</strong> Te recomiendo que empieces por el ejercicio de autoconocimiento de la página 3.
                    Recuerda: los adultos primero debemos mirarnos para criar diferente.
                  </p>
                </div>

                <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">
                  Si tienes alguna pregunta o quieres conocer más sobre las sesiones de acompañamiento, no dudes en responder este email.
                </p>

                <p style="color: #4A5568; font-size: 16px; line-height: 1.6;">
                  Con cariño,<br>
                  <strong>Mailen</strong><br>
                  Crianzas Conscientes
                </p>

                <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 30px 0;">

                <p style="color: #718096; font-size: 14px; text-align: center;">
                  ¿Quieres más contenido? Sígueme en Instagram
                </p>
              </div>
            `
          }
        ],
        attachments: [
          {
            content: pdfBase64,
            filename: 'Guia-Crianza-Consciente.pdf',
            type: 'application/pdf',
            disposition: 'attachment'
          }
        ]
      }),
    })

    // SendGrid devuelve 202 (Accepted) en caso de éxito, no 200
    if (sendGridResponse.status === 202) {
      console.log('Email enviado exitosamente via SendGrid')
      return new Response(
        JSON.stringify({ success: true, message: 'Email enviado' }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
      )
    } else {
      const errorText = await sendGridResponse.text()
      console.error('Error de SendGrid:', sendGridResponse.status, errorText)
      return new Response(
        JSON.stringify({
          error: 'Error enviando email',
          status: sendGridResponse.status,
          details: errorText
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
      )
    }
  } catch (error) {
    console.error('Error en Edge Function:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error desconocido' }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

/* Para invocar manualmente (testing):

curl -i --location --request POST 'https://TU_PROJECT_REF.supabase.co/functions/v1/send-guide-email' \
  --header 'Authorization: Bearer TU_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"record":{"email":"test@example.com"}}'

*/
