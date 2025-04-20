import re
from unicodedata import normalize, category
import unicodedata
import logging

logger = logging.getLogger(__name__)

FIRST_PAGE = 1
LAST_PAGE = 123
MIN_LINE = 1
MAX_LINE = 1353

def strip_accents(s):
    return ''.join(c for c in normalize('NFD', s)
           if category(c) != 'Mn' and c != "'")

def clean_word(word):
    word = re.sub(r'[\u0313\u02BC]', '', word)
    word = re.sub(r'[\u00B7\u002C\u002E\u037E\u0387;]+$', '', word)
    return word

def hash_word(eng_lemma):
    hash = 0
    for char in eng_lemma:
        idx = eng_lemma.index(char)
        hash += (ord(char) * (ord(char)//(idx+1))) ** 2 
    return hash

def grk_to_eng(word):

    word_dict = {
        'α': 'a', 'ἁ': 'a(', 'ἀ': 'a)', 'ἂ': 'a)\\', 'ἃ': 'a(\\', 'ἄ': 'a)/', 'ἅ': 'a(/', 'ἆ': 'a)=' , 'ἇ': 'a(=', 
        'ά': 'a/', 'ὰ': 'a\\', 'ᾶ': 'a=', 'ᾳ': 'a|', 'ᾷ': 'a|=', 'ᾴ': 'a|/', 'ᾲ': 'a|\\', 'ᾱ': 'a=', 'ᾰ': 'a', 'ά':'a/',
        'β': 'b', 'γ': 'g', 'δ': 'd', 
        'ε': 'e', 'ἐ': 'e)', 'ἑ': 'e(', 'έ': 'e/', 'ὲ': 'e\\', 
        'ἔ': 'e)/', 'ἕ': 'e(/', 'ἒ': 'e)\\', 'ἓ': 'e(\\', 
        'ζ': 'z', 
        'η': 'h', 'ἡ': 'h(', 'ἠ': 'h)', 'ἤ': 'h)/', 'ἥ': 'h(/', 'ἦ': 'h)=', 'ἧ': 'h(=',  
        'ή': 'h/', 'ὴ': 'h\\', 'ῆ': 'h=', 'ῃ': 'h|', 'ῄ': 'h|/', 'ῂ': 'h|\\', 'ῇ': 'h|=',
        'θ': 'q', 
        'ι': 'i', 'ἰ': 'i)', 'ἱ': 'i(', 'ἲ': 'i)\\', 'ἳ': 'i(\\', 'ἴ': 'i)/', 'ἵ': 'i(/', 'ἶ': 'i)=', 'ἷ': 'i(=',  
        'ί': 'i/', 'ὶ': 'i\\', 'ῖ': 'i=', 'ϊ': 'i+', 'ΐ': 'i+/', 'ῒ': 'i+\\', 'ῗ': 'i+=', 
        'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n',
        'ξ': 'c', 
        'ο': 'o', 'ὀ': 'o)', 'ὁ': 'o(', 'ὄ': 'o)/', 'ὅ': 'o(/', 'ὂ': 'o)\\', 'ὃ': 'o(\\',  
        'ό': 'o/', 'ὸ': 'o\\', 
        'π': 'p', 
        'ρ': 'r', 'ῤ': 'r)', 'ῥ': 'r(', 
        'σ': 's', 'ς': 's', 'τ': 't', 
        'υ': 'u', 'ὐ': 'u)', 'ὑ': 'u(', 'ὒ': 'u)\\', 'ὓ': 'u(\\', 'ὔ': 'u)/', 'ὕ': 'u(/', 'ὖ': 'u)=', 'ὗ': 'u(=',  
        'ύ': 'u/', 'ὺ': 'u\\', 'ῦ': 'u=', 'ϋ': 'u+', 'ΰ': 'u+/', 'ῢ': 'u+\\', 'ῧ': 'u+=', 
        'φ': 'f', 'χ': 'x', 'ψ': 'Y', 
        'ω': 'w', 'ὠ': 'w)', 'ὡ': 'w(', 'ὤ': 'w)/', 'ὥ': 'w(/', 'ὦ': 'w)=', 'ὧ': 'w(=', 'ώ': 'w/',
        'ώ': 'w/', 'ὼ': 'w\\', 'ῶ': 'w=', 'ῳ': 'w|', 'ῴ': 'w|/', 'ῲ': 'w|\\', 'ῷ': 'w|=', 

        # Capital letters 
        'Α': 'A', 'Ἀ': 'A)', 'Ἁ': 'A(', 'Ἄ': 'A)/', 'Ἅ': 'A(/', 'Ἆ': 'A(=', 'Ἇ': 'A)=', 'Ά': 'A/', 'Ᾱ': 'A=', 'Ᾰ': 'A', 
        'Β': 'B', 'Γ': 'G', 'Δ': 'D', 
        'Ε': 'E', 'Ἐ': 'E)', 'Ἑ': 'E(', 'Ἔ': 'E)/', 'Ἕ': 'E(/', 'Ἒ': 'E)\\', 'Ἓ': 'E(\\', 'Έ': 'E/', 
        'Ζ': 'Z', 
        'Η': 'H', 'Ἠ': 'H)', 'Ἡ': 'H(', 'Ἤ': 'H)/', 'Ἥ': 'H(/', 'Ἦ': 'H)=', 'Ἧ': 'H(=', 'Ή': 'H/', 'ῌ': 'H|', 'Ή': 'H|/', 
        'Θ': 'Q)', 
        'Ι': 'I', 'Ἰ': 'I)', 'Ἱ': 'I(', 'Ἴ': 'I)/', 'Ἵ': 'I(/', 'Ἶ': 'I)=', 'Ἷ': 'I(=', 'Ί': 'I/', 'Ῑ': 'I=', 'Ῐ': 'I', 
        'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 
        'Ξ': 'C', 
        'Ο': 'O', 'Ὀ': 'O)', 'Ὁ': 'O(', 'Ὄ': 'O)/', 'Ὅ': 'O(/', 'Ό': 'O/', 
        'Π': 'P', 
        'Ρ': 'R', 'Ῥ': 'R(', 
        'Σ': 'S', 'Τ': 'T', 
        'Υ': 'U', 'Ὑ': 'U(', 'Ὕ': 'U(/', 'Ὓ': 'U(\\', 'Ὗ': 'U(=', 'Ύ': 'U/', 'Ῡ': 'U=', 'Ῠ': 'U', 
        'Φ': 'F', 'Χ': 'X', 'Ψ': 'Y', 
        'Ω': 'W', 'Ὠ': 'W)', 'Ὡ': 'W(', 'Ὤ': 'W)/', 'Ὥ': 'W(/', 'Ὦ': 'W)=', 'Ὧ': 'W(=', 'Ώ': 'W/', 'ῼ': 'W|', 'Ώ': 'W|/' 
    }




    new_word = ''
    for char in word:
        try:
            new_word += word_dict[char]
        except KeyError:
            logger.warning(f"Unknown Greek character: {char}")
            new_word += char

    return new_word

def is_ancient_greek(word):
    for char in word:
        unicode_block = unicodedata.name(char, "").split()[0]
        if unicode_block != "GREEK":
            return False
    return True

def parse_postag(postag):
    pos_dict = {"n": "noun", "v": "verb", "a": "adjective", "d": "adverb", "l": "article", "g": "particle",
        "c": "conjunction", "r": "preposition", "p": "pronoun", "m": "numeral", "i": "interjection",
        "u": "punctuation", "x": "not available"}
    
    person_dict = {"1": "first person", "2": "second person", "3": "third person"}
    
    number_dict = {"s": "singular", "p": "plural", "d": "dual", "-": "category does not apply"}
    
    tense_dict = {"p": "present", "i": "imperfect", "r": "perfect", "l": "pluperfect", "t": "future perfect", 
        "f": "future", "a": "aorist"}
    
    mood_dict = {"i": "indicative", "s": "subjunctive", "o": "optative", "n": "infinitive", "m": "imperative",
        "p": "participle"}
    
    voice_dict = {"a": "active", "p": "passive", "m": "middle", "e": "medio-passive"}

    
    gender_dict = {"m": "masculine", "f": "feminine", "n": "neuter"}

    case_dict = {"n": "nominative", "g": "genitive", "d": "dative", "a": "accusative", "v": "vocative",
        "l": "locative"}
    
    degree_dict = {"c": "comparative", "s": "superlative"}

    full_arr = {}
    for i in range(1,10):
        char = postag[i-1]
        if char == '-':
            full_arr.update({i:'-'})
            continue
        # Part of speech
        if i == 1:
            full_arr.update({i:pos_dict[char]})
        # Person
        elif i == 2:
            full_arr.update({i:person_dict[char]})
        # Number
        elif i == 3:
            full_arr.update({i:number_dict[char]})
        # Tense
        elif i == 4:
            full_arr.update({i:tense_dict[char]})
        # Mood
        elif i == 5:
            full_arr.update({i:mood_dict[char]})
        # Voice
        elif i == 6:
            full_arr.update({i:voice_dict[char]})
        # Gender
        elif i == 7:
            full_arr.update({i:gender_dict[char]})
        # Case
        elif i == 8:
            full_arr.update({i:case_dict[char]})
        # Degree
        elif i == 9:
            full_arr.update({i:degree_dict[char]})
        else:
            break
            
    return full_arr