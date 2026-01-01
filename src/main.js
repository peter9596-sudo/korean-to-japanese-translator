import './style.css'

function numberToJapanese(num) {
  if (num === 0) return 'れい';
  const units = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう'];
  const tens = ['', 'じゅう', 'にじゅう', 'さんじゅう', 'よんじゅう', 'ごじゅう', 'ろくじゅう', 'ななじゅう', 'はちじゅう', 'きゅうじゅう'];
  const hundreds = ['', 'ひゃく', 'にひゃく', 'さんびゃく', 'よんひゃく', 'ごひゃく', 'ろっぴゃく', 'ななひゃく', 'はっぴゃく', 'きゅうひゃく'];
  const thousands = ['', 'せん', 'にせん', 'さんぜん', 'よんせん', 'ごせん', 'ろくせん', 'ななせん', 'はっせん', 'きゅうせん'];

  let result = '';
  let n = Math.abs(num);
  if (n >= 1000) {
    const t = Math.floor(n / 1000);
    result += thousands[t % 10];
    n %= 1000;
  }
  if (n >= 100) {
    const h = Math.floor(n / 100);
    result += hundreds[h % 10];
    n %= 100;
  }
  if (n >= 10) {
    const te = Math.floor(n / 10);
    result += tens[te % 10];
    n %= 10;
  }
  if (n > 0) {
    result += units[n];
  }
  return result || 'れい';
}

function hiraganaToHepburn(hira) {
  const map = {
    'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
    'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
    'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
    'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
    'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
    'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
    'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
    'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
    'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
    'わ': 'wa', 'を': 'wo', 'ん': 'n',
    'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
    'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
    'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
    'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
    'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
    'ゃ': 'ya', 'ゅ': 'yu', 'ょ': 'yo', 'っ': 'tsu', 'ー': '-'
  };
  return hira.replace(/[ぁ-ゖ]/g, c => map[c] || c);
}

const input = document.getElementById('input');
const button = document.getElementById('translate');
const output = document.getElementById('output');

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    button.click();
  }
});

button.addEventListener('click', async () => {
  const text = input.value;
  if (!text) return;

  try {
    const response = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=ja&dt=t&dt=rm&q=' + encodeURIComponent(text));
    const data = await response.json();
    const translation = data[0][0][0];
    const romanization = data[0][1] ? data[0][1][2] : '';
    let displayTranslation = translation.replace(/\d+/g, (match) => numberToJapanese(parseInt(match)));
    let displayRomanization = hiraganaToHepburn(romanization).replace(/\d+/g, (match) => numberToJapanese(parseInt(match)));
    output.innerHTML = displayTranslation + (displayRomanization ? `<br>(${displayRomanization})` : '');
    output.style.color = 'black';
  } catch (error) {
    output.textContent = 'Translation failed: ' + error.message;
  }
});