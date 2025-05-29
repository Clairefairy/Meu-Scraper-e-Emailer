const fetch = require('node-fetch'); // Para buscar dados da URL
const cheerio = require('cheerio'); // Para manipular e buscar dados no HTML

const url = 'https://www.aksysgames.com/news/';

async function fetchData() {
    try {
        // Faz a requisição da página
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        const noticias = [];

        // Itera sobre cada artigo de notícia
        $('.post').each(function () {
            const titulo = $(this).find('.entry-title').text().trim().replace(/\s+/g, ' ');
            const data = $(this).find('.published').text().trim();
            const link = $(this).find('a').attr('href');

            // Verifica se os dados foram coletados corretamente
            if (titulo && data && link) {
                noticias.push({
                    titulo,
                    data,
                    link
                });
            }
        });

        // Exibe os dados no console de forma mais organizada
        console.log('\nLatest News:');
        noticias.forEach((noticia, index) => {
            console.log(`\n${index + 1}. ${noticia.titulo}`);
            console.log(`   Published: ${noticia.data}`);
            console.log(`   Link: ${noticia.link}`);
        });

        return noticias; // Retorna o array de notícias

    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        return []; // Retorna array vazio em caso de erro
    }
}

// Exporta a função para ser usada em outros arquivos
module.exports = fetchData;
