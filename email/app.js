require('dotenv').config();
const nodemailer = require('nodemailer');
const fetchData = require('../scraper/app.js');

// Verifica se as variáveis de ambiente estão configuradas
console.log('Verificando configurações de email...');
if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Erro: Variáveis de ambiente não configuradas corretamente.');
    console.error('Por favor, verifique se o arquivo .env existe e contém todas as configurações necessárias:');
    console.error('EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS');
    process.exit(1);
}

// Criação do transportador de e-mail com base nas variáveis de ambiente
console.log('Criando transportador de email...');
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Função para formatar as notícias em HTML
function formatNewsToHTML(noticias) {
  let html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333; text-align: center;">Últimas Notícias da AKSYS</h1>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
  `;

  noticias.forEach((noticia, index) => {
    html += `
      <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
        <h2 style="color: #444; margin-bottom: 10px;">${noticia.titulo}</h2>
        <p style="color: #666; margin-bottom: 10px;">Publicado em: ${noticia.data}</p>
        <a href="${noticia.link}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ler mais</a>
      </div>
    `;
  });

  html += `
      </div>
      <p style="text-align: center; color: #666; margin-top: 20px;">
        Este é um email automático. Por favor, não responda.
      </p>
    </div>
  `;

  return html;
}

// Função para enviar o e-mail com as notícias
async function sendEmail() {
  try {
    console.log('Buscando notícias...');
    const noticias = await fetchData();
    
    if (!noticias || noticias.length === 0) {
      console.log('Nenhuma notícia encontrada para enviar.');
      return;
    }

    console.log(`Encontradas ${noticias.length} notícias.`);
    console.log('Formatando email...');
    const htmlContent = formatNewsToHTML(noticias);
    
    console.log('Enviando email...');
    const info = await transporter.sendMail({
      from: `"AKSYS News" <${process.env.EMAIL_USER}>`,
      to: 'biscuitdaclaire@gmail.com',
      subject: 'Últimas Notícias da AKSYS Games',
      html: htmlContent,
      text: noticias.map(n => `${n.titulo}\nPublicado em: ${n.data}\nLink: ${n.link}\n\n`).join(''),
    });

    console.log('E-mail enviado com sucesso! ID:', info.messageId);
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error);
    console.error('Detalhes do erro:', error.message);
  }
}

// Dispara o e-mail
console.log('Iniciando processo de envio de email...');
sendEmail();
