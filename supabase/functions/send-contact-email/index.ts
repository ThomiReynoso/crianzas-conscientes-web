// Edge Function para enviar email de formulario de contacto
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')

console.log('Edge Function: send-contact-email iniciada')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse el payload
    const payload = await req.json()
    console.log('Payload recibido:', JSON.stringify(payload))

    const { name, email, subject, message } = payload

    // Validar datos requeridos
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos requeridos' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Enviando mensaje de contacto de:', email)

    // Validar que existe la API key de SendGrid
    if (!SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY no está configurada')
      return new Response(
        JSON.stringify({ error: 'SENDGRID_API_KEY no configurada' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Mapear subject a texto legible
    // IMPORTANTE: Mantener sincronizado con src/app/shared/constants/contact-subjects.ts
    const subjectMap: Record<string, string> = {
      'session': 'Consulta sobre sesiones 1:1',
      'ebook-free': 'Pregunta sobre la guía gratuita',
      'ebook-paid': 'Quiero comprar el ebook (5€)',
      'collaboration': 'Propuesta de colaboración',
      'other': 'Otro tema'
    }

    const subjectText = subjectMap[subject] || subject

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
            to: [{ email: 'mailensteinbrenner@gmail.com', name: 'Mailen' }],
            subject: `[Crianzas Conscientes] ${subjectText}`
          }
        ],
        from: {
          email: 'hola@mailensteinbrenner.com',
          name: 'Formulario Web - Crianzas Conscientes'
        },
        reply_to: {
          email: email,
          name: name
        },
        content: [
          {
            type: 'text/html',
            value: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #4A5568; border-bottom: 3px solid #B8E6D5; padding-bottom: 15px;">
                  Nuevo mensaje de contacto
                </h1>

                <div style="background-color: #F7FAFC; border-left: 4px solid #B8E6D5; padding: 20px; margin: 20px 0;">
                  <p style="margin: 0 0 10px 0;"><strong>De:</strong> ${name}</p>
                  <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                  <p style="margin: 0;"><strong>Asunto:</strong> ${subjectText}</p>
                </div>

                <h2 style="color: #4A5568; margin-top: 30px;">Mensaje:</h2>
                <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; white-space: pre-wrap; line-height: 1.6;">
                  ${message}
                </div>

                <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 30px 0;">

                <p style="color: #718096; font-size: 14px; text-align: center;">
                  Este email fue enviado desde el formulario de contacto de tu sitio web Crianzas Conscientes.
                  <br>
                  Para responder, simplemente responde a este email y llegará directamente a ${email}.
                </p>
              </div>
            `
          }
        ]
      }),
    })

    // SendGrid devuelve 202 (Accepted) en caso de éxito
    if (sendGridResponse.status === 202) {
      console.log('Email de contacto enviado exitosamente')
      return new Response(
        JSON.stringify({ success: true, message: 'Mensaje enviado correctamente' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
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
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
  } catch (error) {
    console.error('Error en Edge Function:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error desconocido' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

/* Para invocar manualmente (testing):

curl -i --location --request POST 'https://TU_PROJECT_REF.supabase.co/functions/v1/send-contact-email' \
  --header 'Authorization: Bearer TU_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"name":"Juan Pérez","email":"juan@example.com","subject":"session","message":"Hola, me interesa agendar una sesión"}'

*/
