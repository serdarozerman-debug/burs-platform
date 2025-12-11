# Google OAuth Kurulum Rehberi

## Adım 1: Google Cloud Console'da Proje Oluşturma

1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Yeni bir proje oluşturun veya mevcut bir projeyi seçin
3. Proje adı: "Tüm Burslar" veya istediğiniz bir isim

## Adım 2: OAuth Consent Screen Yapılandırması

1. Sol menüden **APIs & Services** > **OAuth consent screen** seçin
2. User Type olarak **External** seçin ve **Create** butonuna tıklayın
3. Aşağıdaki bilgileri doldurun:
   - **App name**: Tüm Burslar
   - **User support email**: Kendi e-posta adresiniz
   - **Developer contact information**: Kendi e-posta adresiniz
4. **Save and Continue** butonuna tıklayın
5. **Scopes** sayfasında **Save and Continue** (varsayılan scopes yeterli)
6. **Test users** sayfasında **Save and Continue** (production için gerekli değil)
7. **Summary** sayfasında bilgileri kontrol edip **Back to Dashboard** tıklayın

## Adım 3: OAuth 2.0 Client ID Oluşturma

1. Sol menüden **APIs & Services** > **Credentials** seçin
2. Üstteki **+ CREATE CREDENTIALS** butonuna tıklayın
3. **OAuth client ID** seçin
4. Application type olarak **Web application** seçin
5. **Name**: Tüm Burslar Web Client
6. **Authorized JavaScript origins** bölümüne ekleyin:
   ```
   http://localhost:3000
   https://yourdomain.com (production için)
   ```
7. **Authorized redirect URIs** bölümüne ekleyin:
   ```
   https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
   ```
   > Not: `YOUR_SUPABASE_PROJECT_ID` yerine Supabase proje ID'nizi yazın. Supabase Dashboard > Settings > API > Project URL'den bulabilirsiniz.

8. **Create** butonuna tıklayın
9. **Client ID** ve **Client Secret** değerlerini kopyalayın (bir daha gösterilmeyecek!)

## Adım 4: Supabase'de Google Provider Yapılandırması

1. [Supabase Dashboard](https://app.supabase.com/) adresine gidin
2. Projenizi seçin
3. Sol menüden **Authentication** > **Providers** seçin
4. **Google** provider'ını bulun ve **Enable** butonuna tıklayın
5. Aşağıdaki bilgileri girin:
   - **Client ID (for OAuth)**: Google Cloud Console'dan kopyaladığınız Client ID
   - **Client Secret (for OAuth)**: Google Cloud Console'dan kopyaladığınız Client Secret
6. **Save** butonuna tıklayın

## Adım 5: Redirect URL Kontrolü

Supabase Dashboard'da:
1. **Authentication** > **URL Configuration** sayfasına gidin
2. **Redirect URLs** bölümünde şu URL'nin olduğundan emin olun:
   ```
   http://localhost:3000/**
   https://yourdomain.com/** (production için)
   ```

## Test Etme

1. Uygulamanızı çalıştırın: `npm run dev`
2. Kayıt Ol veya Giriş Yap sayfasına gidin
3. "Google ile Kayıt Ol" veya "Google ile Giriş Yap" butonuna tıklayın
4. Google hesabınızla giriş yapın
5. Başarılı bir şekilde yönlendirilmelisiniz

## Sorun Giderme

### "redirect_uri_mismatch" Hatası
- Google Cloud Console'da **Authorized redirect URIs** listesinde Supabase callback URL'inin olduğundan emin olun
- URL formatı: `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`

### "Access blocked" Hatası
- OAuth consent screen'de uygulama henüz "Testing" modunda olabilir
- Production için uygulamayı Google'a göndermeniz gerekebilir
- Test kullanıcıları ekleyin veya uygulamayı publish edin

### "Invalid client" Hatası
- Client ID ve Client Secret'ın doğru kopyalandığından emin olun
- Supabase Dashboard'da Google provider ayarlarını kontrol edin

## Kaynaklar

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

