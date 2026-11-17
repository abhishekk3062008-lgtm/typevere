/**
 * lessons.js - Progressive Touch-Typing Curriculum & Drill Sets.
 * Carefully sequenced from tactile index home keys up to professional software engineering code and literary speed tests.
 */

export const CURRICULUM = [
  {
    id: 'stage-1',
    title: 'Stage 1: Home Row Foundation',
    description: 'Learn the primary resting position. Never look down; feel for the bumps on F and J.',
    lessons: [
      {
        id: '1-1',
        title: '1.1 The Tactile Anchors: F and J',
        targetKeys: ['f', 'j', ' '],
        instruction: 'Place your left index finger on F and right index finger on J. Feel the small raised bumps! Keep your thumbs gently resting on the Spacebar.',
        targetWpm: 15,
        minAccuracy: 95,
        text: 'f j f j ff jj fj jf f f j j fff jjj jfj fjf ff jj fj jf f j f j'
      },
      {
        id: '1-2',
        title: '1.2 Middle Fingers: D and K',
        targetKeys: ['d', 'k', 'f', 'j', ' '],
        instruction: 'Curl your left middle finger onto D and your right middle finger onto K. Keep F and J lightly anchored.',
        targetWpm: 18,
        minAccuracy: 95,
        text: 'd k d k dd kk dk kd df jk fd kj dk fj df jk d k f j dd kk ff jj kdf jkd'
      },
      {
        id: '1-3',
        title: '1.3 Ring Fingers: S and L',
        targetKeys: ['s', 'l', 'd', 'k', 'f', 'j', ' '],
        instruction: 'Curl your left ring finger onto S and right ring finger onto L. Maintain a relaxed wrist angle.',
        targetWpm: 20,
        minAccuracy: 95,
        text: 's l s l ss ll sl ls as df jk ls sdk lsf sld kls lks sdl s l d k f j s l'
      },
      {
        id: '1-4',
        title: '1.4 Pinky Fingers: A and ;',
        targetKeys: ['a', ';', 's', 'l', 'd', 'k', 'f', 'j', ' '],
        instruction: 'Place your left pinky on A and right pinky on the semicolon (;). Now your full home row base is complete: A S D F   J K L ;',
        targetWpm: 22,
        minAccuracy: 95,
        text: 'a ; a ; aa ;; a; ;a asdf ;lkj asdf jkl; a s d f j k l ; ask fad fall lass jak'
      },
      {
        id: '1-5',
        title: '1.5 Inward Index Reaches: G and H',
        targetKeys: ['g', 'h', 'f', 'j'],
        instruction: 'Reach your left index finger over to G and snap back to F. Reach your right index finger over to H and snap back to J.',
        targetWpm: 24,
        minAccuracy: 95,
        text: 'f g f j h j fg jh gf hj fgh jhg gas hag had half glad flash fall dash flag'
      },
      {
        id: '1-6',
        title: '1.6 Home Row Full Words Mastery',
        targetKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
        instruction: 'Test your home row speed with real English words. Keep your fingers hovering right above the keys.',
        targetWpm: 28,
        minAccuracy: 96,
        text: 'all ask dad fall glad half salad flash glass shall flask dash lad flag fall had glad ask'
      }
    ]
  },
  {
    id: 'stage-2',
    title: 'Stage 2: The Top Row Reaches',
    description: 'Learn upward diagonal reaches. Always snap your fingers right back to home row after striking.',
    lessons: [
      {
        id: '2-1',
        title: '2.1 Core Vowels: E and I',
        targetKeys: ['e', 'i', 'd', 'k'],
        instruction: 'Reach your left middle finger up from D to E. Reach your right middle finger up from K to I.',
        targetWpm: 25,
        minAccuracy: 95,
        text: 'd e d k i k de ki ed ik see kid life feel side like else desk disk idle dike side life'
      },
      {
        id: '2-2',
        title: '2.2 Index Upward Reaches: R and U',
        targetKeys: ['r', 'u', 'f', 'j'],
        instruction: 'Reach your left index finger up to R. Reach your right index finger up to U. Quick snap-back!',
        targetWpm: 28,
        minAccuracy: 95,
        text: 'f r f j u j fr ju rf uj fur run red use rule sure rush rude fire free risk user cure'
      },
      {
        id: '2-3',
        title: '2.3 Far Reaches: T and Y',
        targetKeys: ['t', 'y', 'f', 'j'],
        instruction: 'Reach left index up and slightly right for T. Reach right index up and left for Y.',
        targetWpm: 28,
        minAccuracy: 95,
        text: 'f t f j y j ft jy tf yj yet try tell year stay they tiny true test yard city yesterday'
      },
      {
        id: '2-4',
        title: '2.4 Ring & Pinky Up: W, O, Q, P',
        targetKeys: ['w', 'o', 'q', 'p', 's', 'l', 'a', ';'],
        instruction: 'Left ring up to W; right ring up to O. Left pinky up to Q; right pinky up to P.',
        targetWpm: 30,
        minAccuracy: 95,
        text: 's w s l o l a q a ; p ; we so quit poor wire power loop quote slow drop loop work quiet'
      },
      {
        id: '2-5',
        title: '2.5 Top + Home Row Full Fluency',
        targetKeys: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'o', 'p', 'q', 'r', 's', 't', 'u', 'w', 'y'],
        instruction: 'Type these sentences smoothly. Maintain a calm, steady metronome rhythm.',
        targetWpm: 32,
        minAccuracy: 96,
        text: 'the quick red fox took water from the deep well while the sheep slept quietly under the tree'
      }
    ]
  },
  {
    id: 'stage-3',
    title: 'Stage 3: The Bottom Row Reaches',
    description: 'Learn downward diagonal reaches with precision and light finger curling.',
    lessons: [
      {
        id: '3-1',
        title: '3.1 Index Downward: V and M',
        targetKeys: ['v', 'm', 'f', 'j'],
        instruction: 'Left index curls down to V. Right index curls down to M.',
        targetWpm: 30,
        minAccuracy: 95,
        text: 'f v f j m j fv jm vf mj view move make vim visit mold volume must valve film vamp'
      },
      {
        id: '3-2',
        title: '3.2 Middle Fingers Down: C and Comma (,)',
        targetKeys: ['c', ',', 'd', 'k'],
        instruction: 'Left middle curls down to C. Right middle curls down to Comma (,).',
        targetWpm: 30,
        minAccuracy: 95,
        text: 'd c d k , k dc k, cd ,k call, calm, card, clear, clock, click, lock, come, clean,'
      },
      {
        id: '3-3',
        title: '3.3 Ring Down: X and Period (.)',
        targetKeys: ['x', '.', 's', 'l'],
        instruction: 'Left ring curls down to X. Right ring curls down to Period (.). End sentences with space.',
        targetWpm: 32,
        minAccuracy: 95,
        text: 's x s l . l sx l. fix. mix. next. exact. text. box. six. extra. wax. fox. axis.'
      },
      {
        id: '3-4',
        title: '3.4 Pinkies Down: Z and Slash (/)',
        targetKeys: ['z', '/', 'a', ';'],
        instruction: 'Left pinky curls down to Z. Right pinky curls down to Forward Slash (/).',
        targetWpm: 30,
        minAccuracy: 95,
        text: 'a z a ; / ; az ;/ zone zero zeal blaze quiz buzz maze size and/or either/or w/o'
      },
      {
        id: '3-5',
        title: '3.5 Bottom Inward: B and N',
        targetKeys: ['b', 'n', 'f', 'j'],
        instruction: 'Left index reaches down-right to B. Right index reaches down-left to N.',
        targetWpm: 34,
        minAccuracy: 95,
        text: 'f b f j n j fb jn bf nj bean burn brand bone brown bench bank bring number balance bonus'
      },
      {
        id: '3-6',
        title: '3.6 Full Alphabet Pangram Mastery',
        targetKeys: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        instruction: 'Every letter of the alphabet is now unlocked! Type cleanly without looking.',
        targetWpm: 38,
        minAccuracy: 96,
        text: 'the quick brown fox jumps over the lazy dog. pack my box with five dozen liquor jugs. sphinx of black quartz, judge my vow.'
      }
    ]
  },
  {
    id: 'stage-4',
    title: 'Stage 4: Capitalization & Shift Mastery',
    description: 'Master the Opposite Shift Hand Rule: Use the opposite hand to hold Shift while striking the key.',
    lessons: [
      {
        id: '4-1',
        title: '4.1 Right Shift Rule for Left Hand Letters',
        targetKeys: ['ShiftRight', 'A', 'S', 'D', 'F', 'Q', 'W', 'E', 'R', 'T', 'Z', 'X', 'C', 'V', 'B'],
        instruction: 'When typing a capital letter with your LEFT hand (e.g., A, T, E, C), hold RIGHT SHIFT with your right pinky.',
        targetWpm: 35,
        minAccuracy: 95,
        text: 'The First Step To Great Touch Typing Is Relaxed Shoulders And Proper Alignment'
      },
      {
        id: '4-2',
        title: '4.2 Left Shift Rule for Right Hand Letters',
        targetKeys: ['ShiftLeft', 'J', 'K', 'L', 'Y', 'U', 'I', 'O', 'P', 'H', 'N', 'M'],
        instruction: 'When typing a capital letter with your RIGHT hand (e.g., J, P, O, N), hold LEFT SHIFT with your left pinky.',
        targetWpm: 35,
        minAccuracy: 95,
        text: 'John Met Mary In New York Near June While Lucy Placed Orders In London'
      },
      {
        id: '4-3',
        title: '4.3 Natural Capitalized Prose',
        targetKeys: ['ShiftLeft', 'ShiftRight', 'all'],
        instruction: 'Switch fluidly between both shift keys depending on which hand types the letter.',
        targetWpm: 40,
        minAccuracy: 96,
        text: 'Practice Does Not Make Perfect; Only Perfect Practice Makes Perfect. Focus First On Smooth Accuracy.'
      }
    ]
  },
  {
    id: 'stage-5',
    title: 'Stage 5: Numbers & Common Symbols',
    description: 'Reach up to the number row and learn essential punctuation and symbols used in modern typing.',
    lessons: [
      {
        id: '5-1',
        title: '5.1 Number Row Reach (1 to 0)',
        targetKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        instruction: 'Reach upward from your home fingers to the number keys: 1-5 with left hand, 6-0 with right hand.',
        targetWpm: 30,
        minAccuracy: 94,
        text: 'room 101, flight 482, year 2026, 350 items, 99 percent, 742 days, 1800 meters, 5678 and 1234'
      },
      {
        id: '5-2',
        title: '5.2 Common Punctuation & Quotes',
        targetKeys: ['!', '?', '"', "'", ':', ';', '-', '(', ')'],
        instruction: 'Professional writers and coders need instant muscle memory for punctuation.',
        targetWpm: 35,
        minAccuracy: 95,
        text: 'She asked, "Is that true?" He answered: "Yes (absolutely) - we verified it today!" Don\'t hesitate; act now.'
      },
      {
        id: '5-3',
        title: '5.3 Developer Code Symbols',
        targetKeys: ['{', '}', '[', ']', '<', '>', '=', '+', '_', '*', '&', '/', '\\', '|'],
        instruction: 'Essential symbols for programmers and technical pros. Reach accurately with your pinkies.',
        targetWpm: 32,
        minAccuracy: 94,
        text: 'const list = [1, 2, 3]; if (x >= 10 && y <= 20) { return items.map(i => i * 2); }'
      }
    ]
  },
  {
    id: 'stage-6',
    title: 'Stage 6: Professional Mastery & Speed',
    description: 'Build elite muscle memory on high-frequency vocabulary, technical code, and business passages.',
    lessons: [
      {
        id: '6-1',
        title: '6.1 Top 100 English Words (Muscle Automation)',
        targetKeys: ['all'],
        instruction: 'These words account for 50% of all written English. You should type them with zero hesitation.',
        targetWpm: 50,
        minAccuracy: 97,
        text: 'the of and a to in is you that it he was for on are as with his they I at be this have from or one had by word but not what all were we when your can said there use an each which she do how their if will'
      },
      {
        id: '6-2',
        title: '6.2 JavaScript & Web Code Drill',
        targetKeys: ['code'],
        instruction: 'Real programming syntax. Maintain rhythm while dealing with brackets, semicolons, and camelCase.',
        targetWpm: 45,
        minAccuracy: 96,
        text: 'async function fetchUserData(userId) {\n  const res = await api.get(`/users/${userId}`);\n  return res.data ? res.data.profile : null;\n}'
      },
      {
        id: '6-3',
        title: '6.3 Python Data & Algorithm Drill',
        targetKeys: ['code'],
        instruction: 'Python syntax with indentation, colons, list comprehensions, and underscores.',
        targetWpm: 45,
        minAccuracy: 96,
        text: 'def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1'
      },
      {
        id: '6-4',
        title: '6.4 Professional Business Communication',
        targetKeys: ['all'],
        instruction: 'Clean, polished business English. Focus on cadence, punctuation, and rhythm.',
        targetWpm: 55,
        minAccuracy: 97,
        text: 'Thank you for your prompt response regarding the third-quarter roadmap. We have reviewed the deliverables and are confident that our updated architecture will meet all scalability targets. Let us schedule a brief alignment call on Thursday morning to finalize the deployment strategy.'
      },
      {
        id: '6-5',
        title: '6.5 Elite Speed Test: Famous Literary Passage',
        targetKeys: ['all'],
        instruction: 'The ultimate professional typing challenge. Flow like water.',
        targetWpm: 65,
        minAccuracy: 98,
        text: 'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of light, it was the season of darkness, it was the spring of hope, it was the winter of despair.'
      }
    ]
  }
];

export const COMMON_WORDS = [
  'about', 'above', 'across', 'action', 'activity', 'actually', 'after', 'again', 'against',
  'almost', 'alone', 'along', 'already', 'always', 'american', 'among', 'amount', 'analysis',
  'animal', 'another', 'answer', 'anyone', 'anything', 'appear', 'apply', 'approach', 'area',
  'argue', 'around', 'arrive', 'article', 'artist', 'assume', 'attack', 'attention', 'author',
  'authority', 'available', 'avoid', 'away', 'baby', 'back', 'balance', 'ball', 'bank', 'base',
  'beat', 'beautiful', 'because', 'become', 'before', 'begin', 'behavior', 'behind', 'believe',
  'benefit', 'better', 'between', 'beyond', 'bill', 'billion', 'black', 'blood', 'blue', 'board',
  'body', 'book', 'born', 'both', 'break', 'bring', 'brother', 'budget', 'build', 'building',
  'business', 'call', 'camera', 'campaign', 'cancer', 'candidate', 'capital', 'care', 'career',
  'carry', 'case', 'catch', 'cause', 'cell', 'center', 'central', 'century', 'certain', 'chair',
  'challenge', 'chance', 'change', 'character', 'charge', 'check', 'child', 'choice', 'choose',
  'church', 'citizen', 'city', 'civil', 'claim', 'class', 'clear', 'clearly', 'close', 'coach',
  'cold', 'collection', 'college', 'color', 'come', 'commercial', 'common', 'community', 'company',
  'compare', 'computer', 'concern', 'condition', 'conference', 'congress', 'consider', 'contain',
  'continue', 'control', 'cost', 'could', 'country', 'couple', 'course', 'court', 'cover', 'create',
  'crime', 'cultural', 'culture', 'cup', 'current', 'customer', 'cut', 'dark', 'data', 'daughter',
  'day', 'dead', 'deal', 'death', 'debate', 'decade', 'decide', 'decision', 'deep', 'defense',
  'degree', 'democrat', 'describe', 'design', 'despite', 'detail', 'determine', 'develop', 'device',
  'difference', 'different', 'difficult', 'dinner', 'direction', 'director', 'discover', 'discuss',
  'disease', 'doctor', 'door', 'down', 'draw', 'dream', 'drive', 'drop', 'drug', 'during', 'each',
  'early', 'east', 'easy', 'economic', 'economy', 'edge', 'education', 'effect', 'effort', 'eight',
  'either', 'election', 'electric', 'element', 'energy', 'enjoy', 'enough', 'enter', 'entire',
  'environment', 'environmental', 'especially', 'establish', 'evening', 'event', 'every', 'everybody',
  'everyone', 'everything', 'evidence', 'exact', 'example', 'executive', 'exist', 'expect', 'experience',
  'expert', 'explain', 'factor', 'fail', 'family', 'fast', 'father', 'fear', 'feature', 'federal',
  'feel', 'feeling', 'field', 'fight', 'figure', 'fill', 'film', 'final', 'finally', 'financial',
  'find', 'finger', 'finish', 'fire', 'firm', 'first', 'fish', 'five', 'floor', 'focus', 'follow',
  'food', 'foot', 'force', 'foreign', 'forest', 'forget', 'form', 'former', 'forward', 'four',
  'friend', 'front', 'full', 'fund', 'future', 'game', 'garden', 'general', 'generation', 'girl',
  'give', 'glass', 'goal', 'good', 'government', 'great', 'green', 'ground', 'group', 'grow',
  'growth', 'guess', 'hand', 'hang', 'happen', 'happy', 'hard', 'head', 'health', 'hear', 'heart',
  'heat', 'heavy', 'help', 'here', 'high', 'history', 'hold', 'home', 'hope', 'hospital', 'hotel',
  'hour', 'house', 'human', 'huge', 'hundred', 'husband', 'idea', 'identify', 'image', 'imagine',
  'impact', 'important', 'improve', 'include', 'including', 'increase', 'indeed', 'indicate', 'individual',
  'industry', 'information', 'inside', 'instead', 'institution', 'interest', 'interesting', 'international',
  'interview', 'into', 'investment', 'involve', 'issue', 'item', 'itself', 'job', 'join', 'just',
  'keep', 'kill', 'kind', 'kitchen', 'know', 'knowledge', 'land', 'language', 'large', 'last', 'late',
  'later', 'laugh', 'law', 'lawyer', 'lay', 'lead', 'leader', 'learn', 'least', 'leave', 'left',
  'legal', 'less', 'letter', 'level', 'lie', 'life', 'light', 'like', 'likely', 'line', 'list',
  'listen', 'little', 'live', 'local', 'long', 'look', 'lose', 'loss', 'love', 'machine', 'magazine',
  'main', 'maintain', 'major', 'majority', 'make', 'manage', 'management', 'manager', 'many', 'market',
  'marriage', 'material', 'matter', 'maybe', 'mean', 'measure', 'media', 'medical', 'meet', 'meeting',
  'member', 'memory', 'mention', 'message', 'method', 'middle', 'might', 'military', 'million', 'mind',
  'minute', 'mission', 'model', 'modern', 'moment', 'money', 'month', 'more', 'morning', 'most',
  'mother', 'mouth', 'move', 'movement', 'movie', 'music', 'must', 'myself', 'name', 'nation',
  'national', 'natural', 'nature', 'near', 'nearly', 'necessary', 'need', 'network', 'never', 'news',
  'newspaper', 'next', 'nice', 'night', 'none', 'north', 'note', 'nothing', 'notice', 'number',
  'occur', 'officer', 'official', 'often', 'once', 'online', 'open', 'operation', 'opportunity',
  'option', 'order', 'organization', 'others', 'outside', 'page', 'pain', 'paper', 'parent', 'part',
  'participant', 'particular', 'particularly', 'partner', 'party', 'pass', 'past', 'patient', 'pattern',
  'peace', 'people', 'perform', 'performance', 'perhaps', 'period', 'person', 'personal', 'phone',
  'physical', 'picture', 'piece', 'place', 'plan', 'plant', 'player', 'point', 'police', 'policy',
  'political', 'politics', 'poor', 'popular', 'population', 'position', 'positive', 'possible', 'power',
  'practice', 'prepare', 'present', 'president', 'pressure', 'pretty', 'prevent', 'price', 'private',
  'probably', 'problem', 'process', 'produce', 'product', 'production', 'professional', 'program',
  'project', 'property', 'protect', 'prove', 'provide', 'public', 'purpose', 'push', 'quality',
  'question', 'quickly', 'quite', 'race', 'radio', 'raise', 'range', 'rate', 'rather', 'reach',
  'read', 'ready', 'real', 'reality', 'realize', 'really', 'reason', 'receive', 'recent', 'recently',
  'recognize', 'record', 'reduce', 'reflect', 'region', 'relate', 'relationship', 'religious', 'remain',
  'remember', 'remove', 'report', 'represent', 'require', 'research', 'resource', 'respond', 'response',
  'responsibility', 'rest', 'result', 'return', 'reveal', 'rich', 'right', 'rise', 'risk', 'road',
  'rock', 'role', 'room', 'rule', 'safe', 'same', 'save', 'scene', 'school', 'science', 'scientist',
  'score', 'season', 'seat', 'second', 'section', 'security', 'seek', 'seem', 'sell', 'send', 'senior',
  'sense', 'series', 'serious', 'serve', 'service', 'seven', 'several', 'shake', 'share', 'shoot',
  'short', 'shot', 'should', 'shoulder', 'show', 'side', 'sign', 'significant', 'similar', 'simple',
  'simply', 'since', 'sing', 'single', 'sister', 'site', 'situation', 'six', 'size', 'skill', 'skin',
  'small', 'smile', 'social', 'society', 'soldier', 'some', 'somebody', 'someone', 'something',
  'sometimes', 'song', 'soon', 'sort', 'sound', 'source', 'south', 'southern', 'space', 'speak',
  'special', 'specific', 'speech', 'spend', 'sport', 'spring', 'staff', 'stage', 'stand', 'standard',
  'star', 'start', 'state', 'statement', 'station', 'stay', 'step', 'still', 'stock', 'stop', 'store',
  'story', 'strategy', 'street', 'strong', 'structure', 'student', 'study', 'stuff', 'style', 'subject',
  'success', 'successful', 'such', 'suddenly', 'suffer', 'suggest', 'summer', 'support', 'sure', 'surface',
  'system', 'table', 'take', 'talk', 'task', 'teach', 'teacher', 'team', 'technology', 'television',
  'tell', 'tend', 'term', 'test', 'than', 'thank', 'theory', 'thing', 'think', 'third', 'thought',
  'threat', 'three', 'through', 'throughout', 'throw', 'time', 'today', 'together', 'tonight', 'total',
  'tough', 'toward', 'town', 'trade', 'traditional', 'training', 'travel', 'treat', 'treatment',
  'tree', 'trial', 'trip', 'trouble', 'true', 'truth', 'turn', 'type', 'under', 'understand', 'unit',
  'until', 'upon', 'usually', 'value', 'various', 'victim', 'view', 'violence', 'visit', 'voice',
  'vote', 'wait', 'walk', 'wall', 'want', 'watch', 'water', 'weapon', 'wear', 'week', 'weight',
  'well', 'west', 'western', 'whatever', 'when', 'where', 'whether', 'which', 'while', 'white',
  'whole', 'whom', 'whose', 'wide', 'wife', 'wind', 'window', 'wish', 'with', 'within', 'without',
  'woman', 'wonder', 'word', 'work', 'worker', 'world', 'worry', 'would', 'write', 'writer', 'wrong',
  'yard', 'yeah', 'year', 'young'
];

/**
 * Generates random words for timed speed tests.
 * @param {number} count Number of words to generate
 */
export function getRandomWords(count = 50) {
  const result = [];
  for (let i = 0; i < count; i++) {
    const word = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
    result.push(word);
  }
  return result.join(' ');
}
