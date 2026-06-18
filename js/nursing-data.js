// Vocabulaire infirmier - contenu original créé par Claude, à valider avec ta prof (voir disclaimer dans l'app)
const NURSING_DATA = {
 "disclaimer": "Ces phrases sont des constructions originales basées sur les structures grammaticales et le style de transcription déjà vus dans tes cours (LACC Amman). Elles n'ont pas été vérifiées par un·e professeur·e natif·ve : montre-les à Leen, Motea ou Ziena avant de les utiliser en stage pour confirmer la prononciation et les ajuster si besoin.",
 "legend": [
  {
   "symbol": "H",
   "desc": "« h » profond et rauque (comme un souffle venant du fond de la gorge) — ح"
  },
  {
   "symbol": "kh",
   "desc": "« kh » raclé, comme en allemand « Bach » — خ"
  },
  {
   "symbol": "3",
   "desc": "son du « ع » — une petite constriction dans la gorge, sans équivalent en français"
  },
  {
   "symbol": "'",
   "desc": "coup de glotte léger (arrêt bref de la voix) — ء"
  },
  {
   "symbol": "gh",
   "desc": "« r » grasseyé à la française, à l'arrière de la gorge — غ"
  }
 ],
 "categories": [
  {
   "id": "nurse1",
   "title": "Accueillir le patient",
   "theme": "Premier contact",
   "words": [
    {
     "arabic": "مرحبا، أهلين!",
     "phonetic": "marHaba, ahlein!",
     "french": "Bonjour, bienvenue !",
     "complete": true,
     "id": "nurse1-1",
     "tag": null
    },
    {
     "arabic": "كيف حالك اليوم؟",
     "phonetic": "kif Halak? (m) / kif Halek? (f)",
     "french": "Comment allez-vous aujourd'hui ?",
     "complete": true,
     "id": "nurse1-2",
     "tag": null
    },
    {
     "arabic": "شو اسمك؟",
     "phonetic": "chou ismak? (m) / chou ismek? (f)",
     "french": "Quel est votre nom ?",
     "complete": true,
     "id": "nurse1-3",
     "tag": null
    },
    {
     "arabic": "انا اسمي... وانا الممرضة اللي رح تساعدك اليوم",
     "phonetic": "ana ismi... w ana il-mmarrida yali raH tsa3edak ilyoum",
     "french": "Je m'appelle... et je suis l'infirmière qui va vous aider aujourd'hui",
     "complete": true,
     "id": "nurse1-4",
     "tag": null
    },
    {
     "arabic": "تفضل / تفضلي، اقعد",
     "phonetic": "tfaddal (m) / tfaddali (f), ‘a3ed",
     "french": "Je vous en prie, asseyez-vous",
     "complete": true,
     "id": "nurse1-5",
     "tag": null
    }
   ]
  },
  {
   "id": "nurse2",
   "title": "Rassurer le patient",
   "theme": "Mettre en confiance",
   "words": [
    {
     "arabic": "ما تخاف، كلنا هون نساعدك",
     "phonetic": "ma t-khaf, kellna hown nsa3dak",
     "french": "N'ayez pas peur, nous sommes tous ici pour vous aider",
     "complete": true,
     "id": "nurse2-1",
     "tag": null
    },
    {
     "arabic": "كل شي تمام",
     "phonetic": "kell shi tamam",
     "french": "Tout va bien",
     "complete": true,
     "id": "nurse2-2",
     "tag": null
    },
    {
     "arabic": "خد نفس عميق، لو سمحت",
     "phonetic": "khod nafas 3amiq, low samaHt",
     "french": "Prenez une grande respiration, s'il vous plaît",
     "complete": true,
     "id": "nurse2-3",
     "tag": null
    },
    {
     "arabic": "رح اكون جنبك",
     "phonetic": "raH akoun jambak",
     "french": "Je vais rester à côté de vous",
     "complete": true,
     "id": "nurse2-4",
     "tag": null
    },
    {
     "arabic": "ما في شي يخوف، هاي بس فحص بسيط",
     "phonetic": "ma fi shi ykhawwef, hay bas faHess basit",
     "french": "Il n'y a rien d'inquiétant, c'est juste un examen simple",
     "complete": true,
     "id": "nurse2-5",
     "tag": null
    }
   ]
  },
  {
   "id": "nurse3",
   "title": "Questions de base sur l'état",
   "theme": "Évaluer la situation",
   "words": [
    {
     "arabic": "وين بتحس بالألم؟",
     "phonetic": "wein bteHess bil-alam?",
     "french": "Où ressentez-vous la douleur ?",
     "complete": true,
     "id": "nurse3-1",
     "tag": null
    },
    {
     "arabic": "من إمتى وانت حاسس هيك؟",
     "phonetic": "min eimta w inta Hasses heik?",
     "french": "Depuis quand ressentez-vous cela ?",
     "complete": true,
     "id": "nurse3-2",
     "tag": null
    },
    {
     "arabic": "بتقدر تتحرك؟",
     "phonetic": "bti'dar titHarrak?",
     "french": "Pouvez-vous bouger ?",
     "complete": true,
     "id": "nurse3-3",
     "tag": null
    },
    {
     "arabic": "اكلت اليوم؟",
     "phonetic": "akalt ilyoum?",
     "french": "Avez-vous mangé aujourd'hui ?",
     "complete": true,
     "id": "nurse3-4",
     "tag": null
    },
    {
     "arabic": "نمت منيح الليلة؟",
     "phonetic": "nimt mnih ilayle?",
     "french": "Avez-vous bien dormi cette nuit ?",
     "complete": true,
     "id": "nurse3-5",
     "tag": null
    }
   ]
  },
  {
   "id": "nurse4",
   "title": "Évaluer la douleur",
   "theme": "La douleur",
   "words": [
    {
     "arabic": "قديش الألم من ١ لـ ١٠؟",
     "phonetic": "'addeish il-alam min waHad la 3ashara?",
     "french": "Sur une échelle de 1 à 10, combien est la douleur ?",
     "complete": true,
     "id": "nurse4-1",
     "tag": null
    },
    {
     "arabic": "وين بالضبط بيوجعك؟",
     "phonetic": "wein bid-dabt byewja3ak?",
     "french": "Où exactement avez-vous mal ?",
     "complete": true,
     "id": "nurse4-2",
     "tag": null
    },
    {
     "arabic": "الألم ثابت ولا بيجي ويروح؟",
     "phonetic": "il-alam thabet wala byiji w byrouH?",
     "french": "La douleur est-elle constante ou par intermittence ?",
     "complete": true,
     "id": "nurse4-3",
     "tag": null
    },
    {
     "arabic": "حسيت بهيك ألم قبل هلأ؟",
     "phonetic": "Hassait bheik alam abel hala'?",
     "french": "Avez-vous déjà ressenti cette douleur auparavant ?",
     "complete": true,
     "id": "nurse4-4",
     "tag": null
    }
   ]
  },
  {
   "id": "nurse5",
   "title": "Donner des instructions simples",
   "theme": "Pendant les soins",
   "words": [
    {
     "arabic": "تنفس بعمق، لو سمحت",
     "phonetic": "tnaffas bi3omq, low samaHt",
     "french": "Respirez profondément, s'il vous plaît",
     "complete": true,
     "id": "nurse5-1",
     "tag": null
    },
    {
     "arabic": "ارتاح شوي",
     "phonetic": "irtaH shway",
     "french": "Reposez-vous un peu",
     "complete": true,
     "id": "nurse5-2",
     "tag": null
    },
    {
     "arabic": "ارفع ايدك، لو سمحت",
     "phonetic": "irfa3 idak, low samaHt",
     "french": "Levez le bras, s'il vous plaît",
     "complete": true,
     "id": "nurse5-3",
     "tag": null
    },
    {
     "arabic": "ما تتحرك ثانية وحدة",
     "phonetic": "ma titHarrak thanye waHde",
     "french": "Ne bougez pas une seconde",
     "complete": true,
     "id": "nurse5-4",
     "tag": null
    },
    {
     "arabic": "لح يوخذ دقيقتين بس",
     "phonetic": "laH youkhod di'i'tein bass",
     "french": "Cela ne prendra que deux minutes",
     "complete": true,
     "id": "nurse5-5",
     "tag": null
    }
   ]
  },
  {
   "id": "nurse6",
   "title": "Formules de politesse en soins",
   "theme": "Clôturer l'échange",
   "words": [
    {
     "arabic": "شكرا على تعاونك",
     "phonetic": "shukran 3ala ta3awonak",
     "french": "Merci pour votre coopération",
     "complete": true,
     "id": "nurse6-1",
     "tag": null
    },
    {
     "arabic": "خليك مبسوط / مبسوطة",
     "phonetic": "khallik mabsout (m) / mabsoute (f)",
     "french": "Prenez soin de vous (litt. « reste content·e »)",
     "complete": true,
     "id": "nurse6-2",
     "tag": null
    },
    {
     "arabic": "تعافى بسرعة!",
     "phonetic": "ta3afa bisor3a!",
     "french": "Rétablissez-vous vite !",
     "complete": true,
     "id": "nurse6-3",
     "tag": null
    },
    {
     "arabic": "اذا بدك اي شي، نادي علي",
     "phonetic": "iza biddak ay shi, nadi 3alay",
     "french": "Si vous avez besoin de quelque chose, appelez-moi",
     "complete": true,
     "id": "nurse6-4",
     "tag": null
    }
   ]
  }
 ]
};
