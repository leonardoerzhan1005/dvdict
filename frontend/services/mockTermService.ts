import { Language, TermResult } from '../types';
import { validateSearchQuery } from '../utils/validation';
import { CONFIG } from '../config';

const MOCK_DATA: Record<string, TermResult> = {
  sovereignty: {
    word: 'Sovereignty',
    pronunciation: '/ˈsɒv.rɪn.ti/',
    translations: {
      [Language.EN]: 'Sovereignty',
      [Language.RU]: 'Суверенитет',
      [Language.KK]: 'Егемендік',
    },
    definitions: {
      [Language.EN]: {
        meaning: 'Supreme power or authority over a territory, especially in political context.',
        examples: [
          'The country asserted its sovereignty over the disputed region.',
          'National sovereignty is a fundamental principle of international law.',
        ],
        synonyms: ['Autonomy', 'Independence', 'Self-rule'],
      },
      [Language.RU]: {
        meaning: 'Верховная власть или полномочия над территорией, особенно в политическом контексте.',
        examples: [
          'Страна утвердила свой суверенитет над спорным регионом.',
          'Национальный суверенитет является фундаментальным принципом международного права.',
        ],
        synonyms: ['Автономия', 'Независимость', 'Самоуправление'],
      },
      [Language.KK]: {
        meaning: 'Аумақ бойынша жоғары билік немесе билік, әсіресе саяси контексте.',
        examples: [
          'Ел даулы аймақ бойынша өз егемендігін бекітті.',
          'Ұлттық егемендік халықаралық құқықтың негізгі принципі болып табылады.',
        ],
        synonyms: ['Автономия', 'Тәуелсіздік', 'Өзін-өзі басқару'],
      },
    },
    etymology: 'From Old French "soverainete", meaning supreme power or authority.',
  },
  infrastructure: {
    word: 'Infrastructure',
    pronunciation: '/ˈɪn.frəˌstrʌk.tʃər/',
    translations: {
      [Language.EN]: 'Infrastructure',
      [Language.RU]: 'Инфраструктура',
      [Language.KK]: 'Инфрақұрылым',
    },
    definitions: {
      [Language.EN]: {
        meaning: 'The basic physical and organizational structures and facilities needed for the operation of a society or enterprise.',
        examples: [
          'The government invested heavily in transportation infrastructure.',
          'Digital infrastructure is crucial for modern economies.',
        ],
        synonyms: ['Foundation', 'Framework', 'System'],
      },
      [Language.RU]: {
        meaning: 'Основные физические и организационные структуры и объекты, необходимые для функционирования общества или предприятия.',
        examples: [
          'Правительство вложило значительные средства в транспортную инфраструктуру.',
          'Цифровая инфраструктура имеет решающее значение для современных экономик.',
        ],
        synonyms: ['Основа', 'Каркас', 'Система'],
      },
      [Language.KK]: {
        meaning: 'Қоғам немесе кәсіпорынның жұмысы үшін қажетті негізгі физикалық және ұйымдастырушылық құрылымдар мен объектілер.',
        examples: [
          'Үкімет көлік инфрақұрылымына айтарлықтай қаражат салды.',
          'Цифрлық инфрақұрылым заманауи экономикалар үшін маңызды.',
        ],
        synonyms: ['Негіз', 'Каркас', 'Жүйе'],
      },
    },
    etymology: 'From French "infrastructure", combining "infra-" (below) and "structure".',
  },
  digitalization: {
    word: 'Digitalization',
    pronunciation: '/ˌdɪdʒ.ɪ.təl.aɪˈzeɪ.ʃən/',
    translations: {
      [Language.EN]: 'Digitalization',
      [Language.RU]: 'Цифровизация',
      [Language.KK]: 'Цифрландыру',
    },
    definitions: {
      [Language.EN]: {
        meaning: 'The process of converting information into digital format or using digital technologies to transform business processes.',
        examples: [
          'Digitalization of government services improved efficiency.',
          'The company accelerated its digitalization strategy.',
        ],
        synonyms: ['Digitization', 'Digital transformation', 'Automation'],
      },
      [Language.RU]: {
        meaning: 'Процесс преобразования информации в цифровой формат или использования цифровых технологий для трансформации бизнес-процессов.',
        examples: [
          'Цифровизация государственных услуг повысила эффективность.',
          'Компания ускорила свою стратегию цифровизации.',
        ],
        synonyms: ['Оцифровка', 'Цифровая трансформация', 'Автоматизация'],
      },
      [Language.KK]: {
        meaning: 'Ақпаратты сандық форматқа түрлендіру процесі немесе бизнес-процестерді түрлендіру үшін сандық технологияларды пайдалану.',
        examples: [
          'Мемлекеттік қызметтерді цифрландыру тиімділікті арттырды.',
          'Компания өз цифрландыру стратегиясын жеделдетті.',
        ],
        synonyms: ['Сандықтандыру', 'Сандық түрлендіру', 'Автоматтандыру'],
      },
    },
    etymology: 'From "digital" + "-ization", first used in the 1990s.',
  },
  pragmatism: {
    word: 'Pragmatism',
    pronunciation: '/ˈpræɡ.mə.tɪ.zəm/',
    translations: {
      [Language.EN]: 'Pragmatism',
      [Language.RU]: 'Прагматизм',
      [Language.KK]: 'Прагматизм',
    },
    definitions: {
      [Language.EN]: {
        meaning: 'A practical approach to problems and affairs, prioritizing practical consequences over theoretical considerations.',
        examples: [
          'His pragmatism helped the company navigate the crisis.',
          'Political pragmatism often requires compromise.',
        ],
        synonyms: ['Practicality', 'Realism', 'Practical approach'],
      },
      [Language.RU]: {
        meaning: 'Практический подход к проблемам и делам, приоритизирующий практические последствия над теоретическими соображениями.',
        examples: [
          'Его прагматизм помог компании преодолеть кризис.',
          'Политический прагматизм часто требует компромиссов.',
        ],
        synonyms: ['Практичность', 'Реализм', 'Практический подход'],
      },
      [Language.KK]: {
        meaning: 'Проблемалар мен істерге практикалық тәсіл, теориялық ойларға қарағанда практикалық салдарларды басымдыққа қою.',
        examples: [
          'Оның прагматизмі компанияға дағдарысты жеңуге көмектесті.',
          'Саяси прагматизм жиі компромисстерді талап етеді.',
        ],
        synonyms: ['Практикалық', 'Реализм', 'Практикалық тәсіл'],
      },
    },
    etymology: 'From Greek "pragma" (deed, act) + "-ism", coined in the 19th century.',
  },
  investment: {
    word: 'Investment',
    pronunciation: '/ɪnˈvest.mənt/',
    translations: {
      [Language.EN]: 'Investment',
      [Language.RU]: 'Инвестиция',
      [Language.KK]: 'Инвестиция',
    },
    definitions: {
      [Language.EN]: {
        meaning: 'The action or process of investing money for profit or material result.',
        examples: [
          'Foreign investment boosted the local economy.',
          'Long-term investment requires careful planning.',
        ],
        synonyms: ['Capital', 'Funding', 'Financing'],
      },
      [Language.RU]: {
        meaning: 'Действие или процесс вложения денег для получения прибыли или материального результата.',
        examples: [
          'Иностранные инвестиции стимулировали местную экономику.',
          'Долгосрочные инвестиции требуют тщательного планирования.',
        ],
        synonyms: ['Капитал', 'Финансирование', 'Вложение'],
      },
      [Language.KK]: {
        meaning: 'Табыс немесе материалдық нәтиже үшін ақша салу әрекеті немесе процесі.',
        examples: [
          'Шетелдік инвестициялар жергілікті экономиканы күшейтті.',
          'Ұзақ мерзімді инвестициялар мұқият жоспарлауды талап етеді.',
        ],
        synonyms: ['Капитал', 'Қаржыландыру', 'Салу'],
      },
    },
    etymology: 'From Latin "investire" (to clothe, to surround), later meaning to commit money.',
  },
  sustainability: {
    word: 'Sustainability',
    pronunciation: '/səˌsteɪ.nəˈbɪl.ə.ti/',
    translations: {
      [Language.EN]: 'Sustainability',
      [Language.RU]: 'Устойчивость',
      [Language.KK]: 'Тұрақтылық',
    },
    definitions: {
      [Language.EN]: {
        meaning: 'The ability to be maintained at a certain rate or level, especially regarding environmental and economic practices.',
        examples: [
          'Environmental sustainability is crucial for future generations.',
          'The company focuses on sustainable business practices.',
        ],
        synonyms: ['Durability', 'Endurance', 'Long-term viability'],
      },
      [Language.RU]: {
        meaning: 'Способность поддерживаться на определенном уровне, особенно в отношении экологических и экономических практик.',
        examples: [
          'Экологическая устойчивость имеет решающее значение для будущих поколений.',
          'Компания фокусируется на устойчивых бизнес-практиках.',
        ],
        synonyms: ['Долговечность', 'Выносливость', 'Долгосрочная жизнеспособность'],
      },
      [Language.KK]: {
        meaning: 'Белгілі бір деңгейде сақталу қабілеті, әсіресе экологиялық және экономикалық тәжірибелерге қатысты.',
        examples: [
          'Экологиялық тұрақтылық болашақ буындар үшін маңызды.',
          'Компания тұрақты бизнес-тәжірибелерге назар аударады.',
        ],
        synonyms: ['Тұрақтылық', 'Төзімділік', 'Ұзақ мерзімді өмір сүру қабілеті'],
      },
    },
    etymology: 'From "sustain" + "-ability", first used in environmental context in the 1980s.',
  },
  heritage: {
    word: 'Heritage',
    pronunciation: '/ˈher.ɪ.tɪdʒ/',
    translations: {
      [Language.EN]: 'Heritage',
      [Language.RU]: 'Наследие',
      [Language.KK]: 'Мұра',
    },
    definitions: {
      [Language.EN]: {
        meaning: 'Property that is or may be inherited; valued objects and qualities passed down from previous generations.',
        examples: [
          'Cultural heritage must be preserved for future generations.',
          'The museum showcases the country\'s rich heritage.',
        ],
        synonyms: ['Legacy', 'Inheritance', 'Tradition'],
      },
      [Language.RU]: {
        meaning: 'Имущество, которое может быть унаследовано; ценные объекты и качества, переданные от предыдущих поколений.',
        examples: [
          'Культурное наследие должно быть сохранено для будущих поколений.',
          'Музей демонстрирует богатое наследие страны.',
        ],
        synonyms: ['Наследие', 'Наследование', 'Традиция'],
      },
      [Language.KK]: {
        meaning: 'Мұраға қалдырылуы мүмкін мүлік; алдыңғы буындардан берілген құнды объектілер мен сапалар.',
        examples: [
          'Мәдени мұра болашақ буындар үшін сақталуы тиіс.',
          'Мұражай елдің бай мұрасын көрсетеді.',
        ],
        synonyms: ['Мұра', 'Мұрагерлік', 'Дәстүр'],
      },
    },
    etymology: 'From Old French "heritage", from "heriter" (to inherit).',
  },
};

const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const normalizeWord = (word: string): string => {
  return word.toLowerCase().trim();
};

const findMockData = (word: string): TermResult | null => {
  const normalized = normalizeWord(word);
  
  for (const [key, value] of Object.entries(MOCK_DATA)) {
    if (normalizeWord(key) === normalized || normalizeWord(value.word) === normalized) {
      return value;
    }
  }
  
  return null;
};

export const fetchTermDetailsMock = async (
  word: string,
  from: Language,
  to: Language
): Promise<TermResult> => {
  if (!validateSearchQuery(word)) {
    throw new Error('Поисковый запрос не может быть пустым');
  }

  await delay(CONFIG.API_DELAY_MS);

  const mockData = findMockData(word);

  if (!mockData) {
    throw new Error(
      `Термин "${word}" не найден в базе данных. Доступные термины: ${Object.keys(MOCK_DATA).join(', ')}`
    );
  }

  return mockData;
};

