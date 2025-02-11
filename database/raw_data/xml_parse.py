import csv
from unicodedata import normalize, category
import xml.etree.ElementTree as ET
import requests
 


def xml_parse(file):
    tree = ET.parse(file)  
    root = tree.getroot()

    PUNCTUATION = ['.', ',', '·', ';']


    wordList = []
    for elem in root.iter('word'): 
        lemma = elem.get('lemma')
        urn = elem.get('cite')
        if lemma not in PUNCTUATION and lemma != None:
            normalized = strip_accents(lemma)
            eng_lemma = grk_to_eng(normalized)

            line = urn.split(':')[-1]

            ending = 'None'
            number = 'None'
            gender = 'None'
            case_dict = noun_case(lemma)
            if case_dict:
                ending = case_dict['case']
                number = case_dict['number']
                gender = case_dict['gender']

            verb_dict = verb_case(lemma)
            voice = 'None'
            tense = 'None'
            mood = 'None'
            person = 'None'
            if verb_dict:
                voice = verb_dict['voice']
                tense = verb_dict['tense']
                mood = verb_dict['mood']
                person = verb_dict['person']

            ppl_dict = ppl_case(lemma)
            ppl_voice = 'None'
            ppl_tense = 'None'
            ppl_gender = 'None'
            ppl_ending = 'None'
            if ppl_dict:
                ppl_voice = ppl_dict['voice']
                ppl_tense = ppl_dict['tense']
                ppl_gender = ppl_dict['gender']
                ppl_ending = ppl_dict['case']

            prn_dict = is_pronoun(lemma)
            prn_type = 'None'
            prn_ending = 'None'
            prn_gender = 'None'
            if prn_dict:
                prn_ending = prn_dict['case']
                prn_gender = prn_dict['gender']
                prn_type = prn_dict['type']
                
            #get_definition(lemma)

            full_eng = grk_to_eng(lemma)
            
            row = {'lemma_id': hash_word(eng_lemma), 'lemma': lemma, 'full_eng': full_eng, 'urn': urn, 'line_number': line, 'normalized': normalized, 'eng_lemma': eng_lemma, 
                   'case': ending, 'number': number, 'gender': gender, 
                    'voice': voice, 'tense': tense, 'mood': mood, 'person': person, 
                    'ppl_voice': ppl_voice, 'ppl_tense': ppl_tense, 'ppl_gender': ppl_gender, 'ppl_case': ppl_ending,
                      'prn_type': prn_type, 'prn_case': prn_ending, 'prn_gender': prn_gender}
            wordList.append(row)

    return wordList

# Stack Overflow: https://stackoverflow.com/questions/517923/what-is-the-best-way-to-remove-accents-normalize-in-a-python-unicode-string
def strip_accents(s):
   return ''.join(c for c in normalize('NFD', s)
        if category(c) != 'Mn')
            
def csv_write(wordList):
    with open('database/csv/wordList.csv', 'w', encoding='utf-8', newline='') as csvfile:
        fieldnames = ['lemma_id', 'lemma', 'full_eng', 'urn', 'line_number', 'normalized', 'eng_lemma', 'case', 'number', 'gender', 'voice', 'tense', 'mood', 'person',
                      'ppl_voice', 'ppl_tense', 'ppl_gender', 'ppl_case', 'prn_type', 'prn_case', 'prn_gender']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for row in wordList:
            writer.writerow(row)

def hash_word(eng_lemma):
    hash = 0
    for char in eng_lemma:
        hash += ord(char) ** 2
    return hash


def grk_to_eng(word):

    word_dict = {
    'α': 'a', 'ἁ': 'a(', 'ἀ': 'a)', 'ἂ': 'a)\\', 'ἃ': 'a(\\', 'ἄ': 'a)/', 'ἅ': 'a(/', 'ἇ': 'a)=', 'ἆ': 'a(=',
    'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ἐ': 'e)', 'ἑ': 'e(', 'έ': 'e/', 'ἔ': 'e)/', 'ἕ': 'e(/', # Finish this letter, I think there's a few more
    'ζ': 'z', 'η': 'h',
    'ἡ': 'h(', 'ἠ': 'h)', # Finish these
    'θ': 'q)', 'ι': 'i', 'ἰ': 'i)', 'ἱ': 'i(', 'ῖ': 'i=', 'ί': 'i/', # Finish these
    'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n',
    'ξ': 'c', 'ο': 'o', 'ὀ': 'o)', 'ό': 'o/', # Finish these get rho too
    'π': 'p', 'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'u', 'ύ': 'u/', # finish these
    'ῦ': 'u=', 'φ': 'f', 'χ': 'x', 'ψ': 'Y', 'ω': 'w', 'ὠ': 'w)', 'ὧ': 'w)=', 'ώ': 'w/', 'ῷ': 'w=', 'ὦ': 'w(=', # Figure out how to handle iota subscript and finish these
    
    # Capital letters
    'Α': 'A', 'Ἀ': 'A)', 'Ἁ': 'A(', 'Ἄ': 'A)/', 'Ἅ': 'A(/', 'Ἆ': 'A(=', #Check through the rest of these to see if all's good.
    'Β': 'B', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'H', 'Θ': 'Q)', 'Ι': 'I', 'Κ': 'K', 'Λ': 'L',
    'Μ': 'M', 'Ν': 'N', 'Ξ': 'C', 'Ο': 'O', 'Π': 'P', 'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'U', 'Φ': 'F',
    'Χ': 'X', 'Ψ': 'Y', 'Ω': 'W', 'Ὀ': 'O', 'Ὄ': 'O/', 'Ὅ': 'O/', 'Ὀ': 'O)', 'Ῥ': 'R'
}


    new_word = ''
    for char in word:
        if char in word_dict:
            new_word += word_dict[char]
        else:
            assert f"Character {char} not found in dictionary"

    return new_word

def noun_case(lemma):
    CASE_ENDINGS = {
        "feminine": {
            "sg": {
                "nominative": ["η", "α"],
                "genitive": ["ης", "ας"],
                "dative": ["ῃ", "ᾳ"],
                "accusative": ["ην", "αν"],
                "vocative": ["η", "α"]
            },
            "pl": {
                "nominative": ["αι"],
                "genitive": ["ῶν"],
                "dative": ["αις"],
                "accusative": ["ας"],
                "vocative": ["αι"]
            }
        },
        "masculine": {
            "sg": {
                "nominative": ["ος", "ον"],
                "genitive": ["ου"],
                "dative": ["ῳ"],
                "accusative": ["ον"],
                "vocative": ["ε", "ον"]
            },
            "pl": {
                "nominative": ["οι", "α"],
                "genitive": ["ων"],
                "dative": ["οις"],
                "accusative": ["ους", "α"],
                "vocative": ["οι", "α"]
            }
        },
        "neuter": {
            "sg": {
                "nominative": ["ς"],  # Some third declension nouns lack a nominative ending
                "genitive": ["ος"],
                "dative": ["ι"],
                "accusative": ["α", "ν"],
                "vocative": ["ς"]  # Vocative often mirrors nominative or stem
            },
            "pl": {
                "nominative": ["ες", "α"],
                "genitive": ["ων"],
                "dative": ["σι"],  # The (ν) appears when a vowel follows
                "accusative": ["ας", "α"],
                "vocative": ["ες", "α"]
            }
        }
    }

    # Determine CASE
    for gender in CASE_ENDINGS:
        for number in CASE_ENDINGS[gender]:
            for case in CASE_ENDINGS[gender][number]:
                for ending in CASE_ENDINGS[gender][number][case]:
                    if lemma.endswith(ending):
                        return {'case': case, 'number': number, 'gender': gender}
                    
    return None


def verb_case(lemma):
    VERB_ENDINGS = {
        "active": {
            "present": {
                "indicative": {
                    "singular": {
                        "1st": ["ω"],
                        "2nd": ["εις"],
                        "3rd": ["ει"]
                    },
                    "plural": {
                        "1st": ["ομεν"],
                        "2nd": ["ετε"],
                        "3rd": ["ουσι(ν)"]
                    }
                },
                "subjunctive": {
                    "singular": {
                        "1st": ["ω"],
                        "2nd": ["ῃς"],
                        "3rd": ["ῃ"]
                    },
                    "plural": {
                        "1st": ["ωμεν"],
                        "2nd": ["ητε"],
                        "3rd": ["ωσι(ν)"]
                    }
                },
                "optative": {
                    "singular": {
                        "1st": ["οιμι"],
                        "2nd": ["οις"],
                        "3rd": ["οι"]
                    },
                    "plural": {
                        "1st": ["οιμεν"],
                        "2nd": ["οιτε"],
                        "3rd": ["οιεν"]
                    }
                },
                "imperative": {
                    "singular": {
                        "2nd": ["ε"],
                        "3rd": ["ετω"]
                    },
                    "plural": {
                        "2nd": ["ετε"],
                        "3rd": ["οντων"]
                    }
                }
            },
            "imperfect": {
                "indicative": {
                    "singular": {
                        "1st": ["ον"],
                        "2nd": ["ες"],
                        "3rd": ["ε(ν)"]
                    },
                    "plural": {
                        "1st": ["ομεν"],
                        "2nd": ["ετε"],
                        "3rd": ["ον"]
                    }
                }
            },
            "future": {
                "indicative": {
                    "singular": {
                        "1st": ["σω"],
                        "2nd": ["σεις"],
                        "3rd": ["σει"]
                    },
                    "plural": {
                        "1st": ["σομεν"],
                        "2nd": ["σετε"],
                        "3rd": ["σουσι"]
                    }
                }
            },
            "aorist": {
                "indicative": {
                    "singular": {
                        "1st": ["σα"],
                        "2nd": ["σας"],
                        "3rd": ["σε(ν)"]
                    },
                    "plural": {
                        "1st": ["σαμεν"],
                        "2nd": ["σατε"],
                        "3rd": ["σαν"]
                    }
                },
                "subjunctive": {
                    "singular": {
                        "1st": ["σω"],
                        "2nd": ["σῃς"],
                        "3rd": ["σῃ"]
                    },
                    "plural": {
                        "1st": ["σωμεν"],
                        "2nd": ["σητε"],
                        "3rd": ["σωσι(ν)"]
                    }
                },
                "optative": {
                    "singular": {
                        "1st": ["σαιμι"],
                        "2nd": ["σαις"],
                        "3rd": ["σαι"]
                    },
                    "plural": {
                        "1st": ["σαιμεν"],
                        "2nd": ["σαιτε"],
                        "3rd": ["σαιεν"]
                    }
                },
                "imperative": {
                    "singular": {
                        "2nd": ["σον"],
                        "3rd": ["σατω"]
                    },
                    "plural": {
                        "2nd": ["σατε"],
                        "3rd": ["σαντων"]
                    }
                }
            },
            "perfect": {
                "indicative": {
                    "singular": {
                        "1st": ["κα"],
                        "2nd": ["κας"],
                        "3rd": ["κε"]
                    },
                    "plural": {
                        "1st": ["καμεν"],
                        "2nd": ["κατε"],
                        "3rd": ["κασι"]
                    }
                }
            },
            "pluperfect": {
                "indicative": {
                    "singular": {
                        "1st": ["η"],
                        "2nd": ["ης"],
                        "3rd": ["ει"]
                    },
                    "plural": {
                        "1st": ["εμεν"],
                        "2nd": ["ετε"],
                        "3rd": ["εσαν"]
                    }
                }
            }
        },
        "mediopassive": {
            "present": {
                "indicative": {
                    "singular": {
                        "1st": ["ομαι"],
                        "2nd": ["ῃ"],
                        "3rd": ["εται"]
                    },
                    "plural": {
                        "1st": ["ομεθα"],
                        "2nd": ["εσθε"],
                        "3rd": ["ονται"]
                    }
                },
                "subjunctive": {
                    "singular": {
                        "1st": ["ωμαι"],
                        "2nd": ["ῃ"],
                        "3rd": ["ηται"]
                    },
                    "plural": {
                        "1st": ["ωμεθα"],
                        "2nd": ["ησθε"],
                        "3rd": ["ωνται"]
                    }
                },
                "optative": {
                    "singular": {
                        "1st": ["οιμην"],
                        "2nd": ["οιο"],
                        "3rd": ["οιτο"]
                    },
                    "plural": {
                        "1st": ["οιμεθα"],
                        "2nd": ["οισθε"],
                        "3rd": ["οιντο"]
                    }
                }
            },
            "imperfect": {
                "indicative": {
                    "singular": {
                        "1st": ["ομην"],
                        "2nd": ["ου"],
                        "3rd": ["ετο"]
                    },
                    "plural": {
                        "1st": ["ομεθα"],
                        "2nd": ["εσθε"],
                        "3rd": ["οντο"]
                    }
                }
            },
            "future": {
                "indicative": {
                    "singular": {
                        "1st": ["σομαι"],
                        "2nd": ["σῃ"],
                        "3rd": ["σεται"]
                    },
                    "plural": {
                        "1st": ["σομεθα"],
                        "2nd": ["σεσθε"],
                        "3rd": ["σονται"]
                    }
                }
            },
            "aorist": {
                "indicative": {
                    "singular": {
                        "1st": ["σαμην"],
                        "2nd": ["σω"],
                        "3rd": ["σατο"]
                    },
                    "plural": {
                        "1st": ["σαμεθα"],
                        "2nd": ["σασθε"],
                        "3rd": ["σαντο"]
                    }
                }
            }
        },
        "passive": {
            "aorist": {
                "indicative": {
                    "singular": {
                        "1st": ["θην"],
                        "2nd": ["θης"],
                        "3rd": ["θη"]
                    },
                    "plural": {
                        "1st": ["θημεν"],
                        "2nd": ["θητε"],
                        "3rd": ["θησαν"]
                    }
                }
            },
            "future": {
                "indicative": {
                    "singular": {
                        "1st": ["θησομαι"],
                        "2nd": ["θησῃ"],
                        "3rd": ["θησεται"]
                    },
                    "plural": {
                        "1st": ["θησομεθα"],
                        "2nd": ["θησεσθε"],
                        "3rd": ["θησονται"]
                    }
                }
            }
        }
    }

    for voice in VERB_ENDINGS:
        for tense in VERB_ENDINGS[voice]:
            for mood in VERB_ENDINGS[voice][tense]:
                for number in VERB_ENDINGS[voice][tense][mood]:
                    for person in VERB_ENDINGS[voice][tense][mood][number]:
                        for ending in VERB_ENDINGS[voice][tense][mood][number][person]:
                            if lemma.endswith(ending):
                                return {'voice': voice, 'tense': tense, 'mood': mood, 'person': person, 'number': number}
                        
    return None

def ppl_case(lemma):
    PARTICIPLE_ENDINGS = {
        "active": {
            "present": {
                "masculine": {"nominative": ["ων"], "genitive": ["οντος"], "dative": ["οντι"], "accusative": ["οντα"]},
                "feminine": {"nominative": ["ουσα"], "genitive": ["ουσης"], "dative": ["ουσῃ"], "accusative": ["ουσαν"]},
                "neuter": {"nominative": ["ον"], "genitive": ["οντος"], "dative": ["οντι"], "accusative": ["ον"]}
            },
            "future": {
                "masculine": {"nominative": ["σων"], "genitive": ["σοντος"], "dative": ["σοντι"], "accusative": ["σοντα"]},
                "feminine": {"nominative": ["σουσα"], "genitive": ["σουσης"], "dative": ["σουσῃ"], "accusative": ["σουσαν"]},
                "neuter": {"nominative": ["σον"], "genitive": ["σοντος"], "dative": ["σοντι"], "accusative": ["σον"]}
            },
            "aorist": {
                "masculine": {"nominative": ["σας"], "genitive": ["σαντος"], "dative": ["σαντι"], "accusative": ["σαντα"]},
                "feminine": {"nominative": ["σασα"], "genitive": ["σασης"], "dative": ["σασῃ"], "accusative": ["σασαν"]},
                "neuter": {"nominative": ["σαν"], "genitive": ["σαντος"], "dative": ["σαντι"], "accusative": ["σαν"]}
            },
            "perfect": {
                "masculine": {"nominative": ["κως"], "genitive": ["κοτος"], "dative": ["κοτι"], "accusative": ["κοτα"]},
                "feminine": {"nominative": ["κυια"], "genitive": ["κυιας"], "dative": ["κυιᾳ"], "accusative": ["κυιαν"]},
                "neuter": {"nominative": ["κος"], "genitive": ["κοτος"], "dative": ["κοτι"], "accusative": ["κος"]}
            }
        },
        "mediopassive": {
            "present": {
                "masculine": {"nominative": ["ομενος"], "genitive": ["ομενου"], "dative": ["ομενῳ"], "accusative": ["ομενον"]},
                "feminine": {"nominative": ["ομενη"], "genitive": ["ομενης"], "dative": ["ομενῃ"], "accusative": ["ομενην"]},
                "neuter": {"nominative": ["ομενον"], "genitive": ["ομενου"], "dative": ["ομενῳ"], "accusative": ["ομενον"]}
            },
            "future": {
                "masculine": {"nominative": ["σομενος"], "genitive": ["σομενου"], "dative": ["σομενῳ"], "accusative": ["σομενον"]},
                "feminine": {"nominative": ["σομενη"], "genitive": ["σομενης"], "dative": ["σομενῃ"], "accusative": ["σομενην"]},
                "neuter": {"nominative": ["σομενον"], "genitive": ["σομενου"], "dative": ["σομενῳ"], "accusative": ["σομενον"]}
            },
            "aorist": {
                "masculine": {"nominative": ["σαμενος"], "genitive": ["σαμενου"], "dative": ["σαμενῳ"], "accusative": ["σαμενον"]},
                "feminine": {"nominative": ["σαμενη"], "genitive": ["σαμενης"], "dative": ["σαμενῃ"], "accusative": ["σαμενην"]},
                "neuter": {"nominative": ["σαμενον"], "genitive": ["σαμενου"], "dative": ["σαμενῳ"], "accusative": ["σαμενον"]}
            }
        },
        "passive": {
            "aorist": {
                "masculine": {"nominative": ["θεις"], "genitive": ["θεντος"], "dative": ["θεντι"], "accusative": ["θεντα"]},
                "feminine": {"nominative": ["θεισα"], "genitive": ["θεισης"], "dative": ["θεισῃ"], "accusative": ["θεισαν"]},
                "neuter": {"nominative": ["θεν"], "genitive": ["θεντος"], "dative": ["θεντι"], "accusative": ["θεν"]}
            },
            "future": {
                "masculine": {"nominative": ["θησομενος"], "genitive": ["θησομενου"], "dative": ["θησομενῳ"], "accusative": ["θησομενον"]},
                "feminine": {"nominative": ["θησομενη"], "genitive": ["θησομενης"], "dative": ["θησομενῃ"], "accusative": ["θησομενην"]},
                "neuter": {"nominative": ["θησομενον"], "genitive": ["θησομενου"], "dative": ["θησομενῳ"], "accusative": ["θησομενον"]}
            },
            "perfect": {
                "masculine": {"nominative": ["μενος"], "genitive": ["μενου"], "dative": ["μενῳ"], "accusative": ["μενον"]},
                "feminine": {"nominative": ["μενη"], "genitive": ["μενης"], "dative": ["μενῃ"], "accusative": ["μενην"]},
                "neuter": {"nominative": ["μενον"], "genitive": ["μενου"], "dative": ["μενῳ"], "accusative": ["μενον"]}
            }
        }
    }



    for voice in PARTICIPLE_ENDINGS:
        for tense in PARTICIPLE_ENDINGS[voice]:
            for gender in PARTICIPLE_ENDINGS[voice][tense]:
                for case_ending in PARTICIPLE_ENDINGS[voice][tense][gender]:
                    for ending in PARTICIPLE_ENDINGS[voice][tense][gender][case_ending]:
                        if lemma.endswith(ending):
                            return {'voice': voice, 'tense': tense, 'gender': gender, 'case': case_ending}
                    
    return None


def is_pronoun(lemma):
    PRONOUN_ENDINGS = {
        "personal": {
            "first_person": {
                "singular": {
                    "nominative": ["ἐγώ"],
                    "genitive": ["ἐμοῦ", "μου"],
                    "dative": ["ἐμοί", "μοι"],
                    "accusative": ["ἐμέ", "με"]
                },
                "plural": {
                    "nominative": ["ἡμεῖς"],
                    "genitive": ["ἡμῶν"],
                    "dative": ["ἡμῖν"],
                    "accusative": ["ἡμᾶς"]
                }
            },
            "second_person": {
                "singular": {
                    "nominative": ["σύ"],
                    "genitive": ["σοῦ", "σου"],
                    "dative": ["σοί", "σοι"],
                    "accusative": ["σέ", "σε"]
                },
                "plural": {
                    "nominative": ["ὑμεῖς"],
                    "genitive": ["ὑμῶν"],
                    "dative": ["ὑμῖν"],
                    "accusative": ["ὑμᾶς"]
                }
            },
            "third_person": {
                "singular": {
                    "masculine": {
                        "nominative": ["αὐτός"],
                        "genitive": ["αὐτοῦ"],
                        "dative": ["αὐτῷ"],
                        "accusative": ["αὐτόν"]
                    },
                    "feminine": {
                        "nominative": ["αὐτή"],
                        "genitive": ["αὐτῆς"],
                        "dative": ["αὐτῇ"],
                        "accusative": ["αὐτήν"]
                    },
                    "neuter": {
                        "nominative": ["αὐτό"],
                        "genitive": ["αὐτοῦ"],
                        "dative": ["αὐτῷ"],
                        "accusative": ["αὐτό"]
                    }
                },
                "plural": {
                    "masculine": {
                        "nominative": ["αὐτοί"],
                        "genitive": ["αὐτῶν"],
                        "dative": ["αὐτοῖς"],
                        "accusative": ["αὐτούς"]
                    },
                    "feminine": {
                        "nominative": ["αὐταί"],
                        "genitive": ["αὐτῶν"],
                        "dative": ["αὐταῖς"],
                        "accusative": ["αὐτάς"]
                    },
                    "neuter": {
                        "nominative": ["αὐτά"],
                        "genitive": ["αὐτῶν"],
                        "dative": ["αὐτοῖς"],
                        "accusative": ["αὐτά"]
                    }
                }
            }
        },
        "demonstrative": {
            "singular": {
                "masculine": {
                    "nominative": ["οὗτος"],
                    "genitive": ["τούτου"],
                    "dative": ["τούτῳ"],
                    "accusative": ["τοῦτον"]
                },
                "feminine": {
                    "nominative": ["αὕτη"],
                    "genitive": ["ταύτης"],
                    "dative": ["ταύτῃ"],
                    "accusative": ["ταύτην"]
                },
                "neuter": {
                    "nominative": ["τοῦτο"],
                    "genitive": ["τούτου"],
                    "dative": ["τούτῳ"],
                    "accusative": ["τοῦτο"]
                }
            },
            "singular": {
                "masculine": {
                    "nominative": ["ἐκεῖνος"],
                    "genitive": ["ἐκείνου"],
                    "dative": ["ἐκείνῳ"],
                    "accusative": ["ἐκεῖνον"]
                },
                "feminine": {
                    "nominative": ["ἐκείνη"],
                    "genitive": ["ἐκείνης"],
                    "dative": ["ἐκείνῃ"],
                    "accusative": ["ἐκείνην"]
                },
                "neuter": {
                    "nominative": ["ἐκεῖνο"],
                    "genitive": ["ἐκείνου"],
                    "dative": ["ἐκείνῳ"],
                    "accusative": ["ἐκεῖνο"]
                }
            }
        },
        "relative": {
                "singular": {
                    "masculine": {
                        "nominative": ["ὅς"],
                        "genitive": ["οὗ"],
                        "dative": ["ᾧ"],
                        "accusative": ["ὅν"]
                    },
                    "feminine": {
                        "nominative": ["ἥ"],
                        "genitive": ["ἧς"],
                        "dative": ["ᾗ"],
                        "accusative": ["ἥν"]
                    },
                    "neuter": {
                        "nominative": ["ὅ"],
                        "genitive": ["οὗ"],
                        "dative": ["ᾧ"],
                        "accusative": ["ὅ"]
                    }
                }
            
        },
        "interrogative": {
                "singular": {
                    "masculine_feminine": {
                        "nominative": ["τίς"],
                        "genitive": ["τίνος"],
                        "dative": ["τίνι"],
                        "accusative": ["τίνα"]
                    },
                    "neuter": {
                        "nominative": ["τί"],
                        "genitive": ["τίνος"],
                        "dative": ["τίνι"],
                        "accusative": ["τί"]
                    }
                }
        },
        "indefinite": {
                "singular": {
                    "masculine_feminine": {
                        "nominative": ["τις"],
                        "genitive": ["τινός"],
                        "dative": ["τινί"],
                        "accusative": ["τινά"]
                    },
                    "neuter": {
                        "nominative": ["τι"],
                        "genitive": ["τινός"],
                        "dative": ["τινί"],
                        "accusative": ["τι"]
                    }
                }
        }
    }

    for type in PRONOUN_ENDINGS:
        for number in PRONOUN_ENDINGS[type]:
            for gender in PRONOUN_ENDINGS[type][number]:
                for ending in PRONOUN_ENDINGS[type][number][gender]:
                    for pronoun in PRONOUN_ENDINGS[type][number][gender][ending]:
                        if lemma in pronoun:
                            return {'type': type, 'number': number, 'gender': gender, 'case': ending}
    


def get_definition(lemma):
    print(lemma)


def main():
    r = requests.get('https://www.perseus.tufts.edu/hopper/vocablist?works=Perseus%3Atext%3A1999.01.0185&sort=keyword_score&filt=50&filt_custom=&output=table&lang=greek')

    # check status code for response received
    # success code - 200
    print(r)

    # print content of request
    print(r.content)
    
    wordlist = xml_parse('database/raw_data/treebank.xml')

    csv_write(wordlist)


if __name__ == '__main__':
    main()