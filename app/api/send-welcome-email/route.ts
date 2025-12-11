import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, fullName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email gerekli' },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: 'BursBuldum <onboarding@resend.dev>', // Geçici test adresi - production'da domain doğrulaması gerekli
      to: email,
      subject: 'Hoş Geldiniz - BursBuldum',
      html: `
        <h1>Hoş Geldiniz ${fullName || 'Değerli Kullanıcı'}!</h1>
        <p>BursBuldum platformuna kaydınız başarıyla tamamlandı.</p>
        <p>Artık yurtiçi ve yurtdışındaki tüm burs fırsatlarına erişebilirsiniz.</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Hoş geldiniz email\'i başarıyla gönderildi',
    });
  } catch (error: any) {
    console.error('Email gönderme hatası:', error);
    return NextResponse.json(
      { error: 'Email gönderilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
