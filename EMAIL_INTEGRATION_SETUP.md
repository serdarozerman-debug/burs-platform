# Email Entegrasyon Kurulum Rehberi

## Mevcut Durum

Supabase otomatik olarak şu email'leri gönderir:
- Kayıt sonrası e-posta doğrulama email'i
- Şifre sıfırlama email'i

## Özel Email Servisleri Entegrasyonu

Özel hoş geldiniz email'leri ve diğer email'ler için aşağıdaki servislerden birini kullanabilirsiniz:

### Seçenek 1: Resend (Önerilen)

Resend modern ve kullanımı kolay bir email servisidir.

#### Kurulum:

1. [Resend](https://resend.com/) adresine gidin ve hesap oluşturun
2. API Key oluşturun: **API Keys** > **Create API Key**
3. `.env.local` dosyasına ekleyin:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

4. Resend paketini yükleyin:
   ```bash
   npm install resend
   ```

5. `app/api/send-welcome-email/route.ts` dosyasını güncelleyin:
   ```typescript
   import { Resend } from 'resend';

   const resend = new Resend(process.env.RESEND_API_KEY);

   export async function POST(request: NextRequest) {
     const { email, fullName } = await request.json();
     
     await resend.emails.send({
       from: 'Tüm Burslar <noreply@yourdomain.com>',
       to: email,
       subject: 'Hoş Geldiniz - Tüm Burslar',
       html: `
         <h1>Hoş Geldiniz ${fullName}!</h1>
         <p>Tüm Burslar platformuna kaydınız başarıyla tamamlandı.</p>
         <p>Artık yurtiçi ve yurtdışındaki tüm burs fırsatlarına erişebilirsiniz.</p>
       `,
     });
   }
   ```

#### Kaynaklar:
- [Resend Documentation](https://resend.com/docs)
- [Resend Next.js Guide](https://resend.com/docs/send-with-nextjs)

---

### Seçenek 2: SendGrid

SendGrid popüler bir email servisidir.

#### Kurulum:

1. [SendGrid](https://sendgrid.com/) adresine gidin ve hesap oluşturun
2. API Key oluşturun: **Settings** > **API Keys** > **Create API Key**
3. `.env.local` dosyasına ekleyin:
   ```env
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   ```

4. SendGrid paketini yükleyin:
   ```bash
   npm install @sendgrid/mail
   ```

5. `app/api/send-welcome-email/route.ts` dosyasını güncelleyin:
   ```typescript
   import sgMail from '@sendgrid/mail';

   sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

   export async function POST(request: NextRequest) {
     const { email, fullName } = await request.json();
     
     await sgMail.send({
       to: email,
       from: 'noreply@yourdomain.com',
       subject: 'Hoş Geldiniz - Tüm Burslar',
       html: `
         <h1>Hoş Geldiniz ${fullName}!</h1>
         <p>Tüm Burslar platformuna kaydınız başarıyla tamamlandı.</p>
       `,
     });
   }
   ```

#### Kaynaklar:
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [SendGrid Node.js Guide](https://docs.sendgrid.com/for-developers/sending-email/v3-nodejs-code-example)

---

### Seçenek 3: AWS SES

AWS SES maliyet-etkin bir çözümdür.

#### Kurulum:

1. [AWS Console](https://console.aws.amazon.com/) adresine gidin
2. SES servisini açın ve email adresinizi doğrulayın
3. IAM kullanıcısı oluşturun ve SES erişim izni verin
4. Access Key ve Secret Key oluşturun
5. `.env.local` dosyasına ekleyin:
   ```env
   AWS_ACCESS_KEY_ID=xxxxxxxxxxxxx
   AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxx
   AWS_REGION=us-east-1
   ```

6. AWS SDK paketini yükleyin:
   ```bash
   npm install @aws-sdk/client-ses
   ```

#### Kaynaklar:
- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
- [AWS SES Node.js Guide](https://docs.aws.amazon.com/ses/latest/dg/send-email-nodejs.html)

---

### Seçenek 4: Supabase Email Templates (Ücretsiz)

Supabase'in kendi email template sistemini kullanabilirsiniz.

#### Kurulum:

1. Supabase Dashboard > **Authentication** > **Email Templates** sayfasına gidin
2. "Confirm signup" template'ini özelleştirin
3. HTML içeriğini düzenleyin:
   ```html
   <h1>Hoş Geldiniz!</h1>
   <p>Kaydınız başarıyla tamamlandı.</p>
   <p><a href="{{ .ConfirmationURL }}">E-postanızı doğrulamak için tıklayın</a></p>
   ```

#### Avantajlar:
- Ücretsiz
- Kolay kurulum
- Supabase ile entegre

#### Dezavantajlar:
- Özelleştirme sınırlı
- Sadece Supabase auth email'leri için

---

## Email Template Örnekleri

### Hoş Geldiniz Email'i

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4A90E2; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .button { background-color: #4A90E2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Tüm Burslar</h1>
    </div>
    <div class="content">
      <h2>Hoş Geldiniz {{fullName}}!</h2>
      <p>Kaydınız başarıyla tamamlandı. Artık yurtiçi ve yurtdışındaki tüm burs fırsatlarına erişebilirsiniz.</p>
      <a href="{{siteUrl}}" class="button">Bursları Keşfet</a>
    </div>
  </div>
</body>
</html>
```

## Öneriler

1. **Development için**: Supabase'in varsayılan email'lerini kullanın
2. **Production için**: Resend veya SendGrid gibi profesyonel bir servis kullanın
3. **Email doğrulama**: Supabase otomatik olarak yapar, ekstra kod gerekmez
4. **Email template'leri**: Markdown veya HTML kullanarak profesyonel görünüm sağlayın

## Test Etme

1. Kayıt ol sayfasından yeni bir kullanıcı oluşturun
2. E-postanızı kontrol edin
3. Email'in geldiğini ve içeriğin doğru olduğunu kontrol edin

