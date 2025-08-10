import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.content.count();
  if (count > 0) {
    console.log('Seed ignorado: conteúdos já existem');
    return;
  }

  await prisma.content.createMany({
    data: [
      {
        title: 'Lilo e Stitch',
        genre: 'Animação',
        description: 'Lilo e Stitch são amigos que se encontram em uma ilha e se tornam melhores amigos.',
        imageUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/bLQN6DUNYN4NVzSY3Q53JwBRlgV.jpg',
      },
      {
        title: 'Quarteto Fantástico: Primeiros Passos',
        genre: 'Ação',
        description: 'Um grupo de astronautas passa por uma tempestade cósmica durante seu voo experimental. Ao retornar à Terra, os tripulantes descobrem que possuem novas e bizarras habilidades. ',
        imageUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/hlWOAWRKSno6UxaE0IXDFVvmzTf.jpg',
      },
      {
        title: 'Interstellar',
        genre: 'Aventura',
        description: 'Exploradores viajam através de um buraco de minhoca no espaço.',
        imageUrl: 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
      },
      {
        title: 'Breaking Bad',
        genre: 'Drama',
        description: 'Professor de química vira fabricante de metanfetamina.',
        imageUrl: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
      },
      {
        title: 'Stranger Things',
        genre: 'Ficção Científica',
        description: 'Crianças enfrentam forças sobrenaturais em sua cidade.',
        imageUrl: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
      },
    ],
  });

  console.log('Seed concluído');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
