import styles from "./BibleQuotes.module.css";

type Props = {};

type BibleQuotes = {
  author: string;
  message: string;
};

const BibleQuotes = (props: Props) => {
  const bibleQuotes: BibleQuotes[] = [
    {
      author: "Psaume 23:1-2",
      message:
        "L'Éternel est mon berger : je ne manquerai de rien. Il me fait reposer dans de verts pâturages, Il me dirige près des eaux paisibles.",
    },
    {
      author: "Proverbes 3:5-6",
      message:
        "Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta sagesse; reconnais-le dans toutes tes voies, et il aplanira tes sentiers.",
    },
    {
      author: "Ésaïe 41:10",
      message:
        "Ne crains rien, car je suis avec toi; ne promène pas des regards inquiets, car je suis ton Dieu. Je te fortifie, je viens à ton secours, je te soutiens de ma droite triomphante",
    },
    {
      author: "Romains 8:28",
      message:
        "Nous savons du reste que tout concourt au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein",
    },
    {
      author: "Philippiens 4:13",
      message: "Je puis tout par celui qui me fortifie.",
    },
  ];

  return (
    <div className={styles.container}>
      {bibleQuotes.map((bibleQuote) => {
        return (
          <div className={styles.bibleQuotes}>
            <h4>{bibleQuote.author}</h4>
            <p>{bibleQuote.message}</p>
          </div>
        );
      })}
    </div>
  );
};

export default BibleQuotes;
