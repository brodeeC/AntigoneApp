from sqlalchemy import or_, and_, case, func
from app import db
from app.models import FullText, LemmaData, LemmaDefinition
from app.utils import clean_word, strip_accents, parse_postag
import logging

logger = logging.getLogger(__name__)

def get_line(line_num):
    """Get a single line using SQLAlchemy"""
    line = FullText.query.get(line_num)
    return (line.line_text, line.speaker) if line else (None, None)

def get_speaker(line_num):
    """Get speaker for a line"""
    line = FullText.query.get(line_num)
    return line.speaker if line else None

def get_word_defs(lemma_id):
    """Get definitions for a lemma"""
    defs = LemmaDefinition.query.filter_by(lemma_id=lemma_id).all()
    return [{
        'def_num': d.def_num,
        'short_def': d.short_definition,
        'queries': d.queries
    } for d in defs]

def add_defs(data, definitions):
    """Add definitions to response data"""
    def_list = [{
        'def_num': d['def_num'],
        'short_def': d['short_def'],
        'queries': d['queries']
    } for d in definitions]
    
    data.append({'definitions': def_list})
    return data

def lookup_word_details(word):
    """Modern SQLAlchemy version of word lookup"""
    cleaned = clean_word(word)
    normalized = strip_accents(cleaned)
    
    # Base query
    query = LemmaData.query.filter(
        or_(
            LemmaData.form == cleaned, # form
            LemmaData.lemma == cleaned, # lemma
            LemmaData.norm_form.startswith(normalized), # form
            LemmaData.normalized.startswith(normalized), # lemma
            LemmaData.form_eng.contains(cleaned), # form
            LemmaData.norm_form_eng.contains(normalized), # form
            LemmaData.full_eng.contains(cleaned), # lemma
            LemmaData.eng_lemma.contains(normalized) # norm lemma
        )
    )
    
    # Modified case statement to prioritize form matches
    query = query.order_by(
        case(
            (LemmaData.form == cleaned, 1),           # Exact form match - highest priority
            (LemmaData.lemma == cleaned, 2),            # Exact lemma match
            (LemmaData.norm_form.startswith(normalized), 3),  # Form starts with normalized
            (LemmaData.normalized.startswith(normalized), 4),  # Lemma starts with normalized
            (LemmaData.norm_form.contains(normalized), 5),   # Form contains normalized
            (LemmaData.normalized.contains(normalized), 6),   # Lemma contains normalized
            else_=7
        ),
        
        #LemmaData.line_number
    )
    
    results = query.all()
    
    if not results:
        return {}

    word_details = []
    for lemma in results:
        speaker = get_speaker(lemma.line_number)
        definitions = get_word_defs(lemma.lemma_id)
        
        word_data = [{
            'lemma_id': lemma.lemma_id,
            'lemma': lemma.lemma,
            'form': lemma.form,
            'line_number': lemma.line_number,
            'postag': lemma.postag,
            'speaker': speaker,
            #'case': parse_postag(lemma.postag)
        }, {'case': parse_postag(lemma.postag)}]
        #word_details.append(parse_postag(lemma.postag))
        
        if definitions:
            word_data = add_defs(word_data, definitions)
            
        word_details.append(word_data)
    
    return word_details

def search_by_definition(query):
    """Returns list of (lemma_id, line_number) tuples for matching definitions"""
    exact_matches = db.session.query(
        LemmaDefinition.lemma_id,
        LemmaData.line_number
    ).join(LemmaData).filter(
        LemmaDefinition.short_definition == query
    ).limit(5).all()
    
    if exact_matches:
        return exact_matches
    
    partial_matches = db.session.query(
        LemmaDefinition.lemma_id,
        LemmaData.line_number
    ).join(LemmaData).filter(
        LemmaDefinition.short_definition.contains(query)
    ).limit(10).all()
    
    return partial_matches

def get_word(lemma_id):
    """Get lemma by ID"""
    lemma = LemmaData.query.get(lemma_id)
    return lemma.form if lemma else None ## Testing how getting lemma.form will affect results