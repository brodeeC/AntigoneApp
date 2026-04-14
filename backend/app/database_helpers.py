from sqlalchemy import or_, and_, case, func
from app import db
from app.models import FullText, LemmaData, LemmaDefinition
from app.utils import clean_word, strip_accents, parse_postag
import logging

logger = logging.getLogger(__name__)

def get_line(line_num):
    """Get a single line using SQLAlchemy"""
    line = db.session.get(FullText, line_num)
    return (line.line_text, line.speaker) if line else (None, None)

def get_speaker(line_num):
    """Get speaker for a line"""
    line = db.session.get(FullText, line_num)
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


def _word_details_from_lemmas(lemmas):
    """Turn LemmaData ORM rows into the API payload shape."""
    word_details = []
    for lemma in lemmas:
        speaker = get_speaker(lemma.line_number)
        definitions = get_word_defs(lemma.lemma_id)

        word_data = [{
            'lemma_id': lemma.lemma_id,
            'lemma': lemma.lemma,
            'form': lemma.form,
            'line_number': lemma.line_number,
            'postag': lemma.postag,
            'speaker': speaker,
        }, {'case': parse_postag(lemma.postag)}]

        if definitions:
            word_data = add_defs(word_data, definitions)

        word_details.append(word_data)

    return word_details


def _lookup_word_details_short_query(cleaned, normalized):
    """
    Queries of length 1–2: return exact matches first, then prefix matches, then substring.
    Avoids flooding results with weak `contains` hits before strong ties (e.g. single letter 'o').
    """
    seen = set()
    ordered_rows = []

    def take_unique(query):
        for row in query.limit(500).all():
            key = (row.lemma_id, row.line_number)
            if key not in seen:
                seen.add(key)
                ordered_rows.append(row)

    exact_filter = or_(
        LemmaData.form == cleaned,
        LemmaData.lemma == cleaned,
        LemmaData.normalized == normalized,
        LemmaData.norm_form == normalized,
        LemmaData.form_eng == cleaned,
        LemmaData.norm_form_eng == normalized,
        LemmaData.eng_lemma == cleaned,
        LemmaData.eng_lemma == normalized,
    )
    q_exact = LemmaData.query.filter(exact_filter).order_by(
        func.length(LemmaData.form).asc(),
        LemmaData.line_number.asc(),
    )
    take_unique(q_exact)

    prefix_filter = or_(
        LemmaData.norm_form.startswith(normalized),
        LemmaData.normalized.startswith(normalized),
        LemmaData.form_eng.startswith(cleaned),
        LemmaData.norm_form_eng.startswith(normalized),
        LemmaData.full_eng.startswith(cleaned),
        LemmaData.eng_lemma.startswith(normalized),
    )
    q_prefix = LemmaData.query.filter(prefix_filter).order_by(
        func.length(LemmaData.form).asc(),
        LemmaData.line_number.asc(),
    )
    take_unique(q_prefix)

    contains_filter = or_(
        LemmaData.form_eng.contains(cleaned),
        LemmaData.norm_form_eng.contains(normalized),
        LemmaData.full_eng.contains(cleaned),
        LemmaData.eng_lemma.contains(normalized),
        LemmaData.norm_form.contains(normalized),
        LemmaData.normalized.contains(normalized),
    )
    q_contains = LemmaData.query.filter(contains_filter).order_by(
        func.length(LemmaData.form).asc(),
        LemmaData.line_number.asc(),
    )
    take_unique(q_contains)

    return ordered_rows[:500]


def lookup_word_details(word):
    """Look up dictionary rows for a word search; exact matches rank above fuzzy matches."""
    if isinstance(word, str):
        word = word.strip()
    cleaned = clean_word(word)
    normalized = strip_accents(cleaned)

    if not normalized:
        return []

    if len(normalized) <= 2:
        results = _lookup_word_details_short_query(cleaned, normalized)
    else:
        broad_filter = or_(
            LemmaData.form == cleaned,
            LemmaData.lemma == cleaned,
            LemmaData.normalized == normalized,
            LemmaData.norm_form == normalized,
            LemmaData.norm_form.startswith(normalized),
            LemmaData.normalized.startswith(normalized),
            LemmaData.form_eng == cleaned,
            LemmaData.norm_form_eng == normalized,
            LemmaData.form_eng.startswith(cleaned),
            LemmaData.norm_form_eng.startswith(normalized),
            LemmaData.full_eng.startswith(cleaned),
            LemmaData.eng_lemma.startswith(normalized),
            LemmaData.eng_lemma == cleaned,
            LemmaData.eng_lemma == normalized,
            LemmaData.norm_form.contains(normalized),
            LemmaData.normalized.contains(normalized),
            LemmaData.form_eng.contains(cleaned),
            LemmaData.norm_form_eng.contains(normalized),
            LemmaData.full_eng.contains(cleaned),
            LemmaData.eng_lemma.contains(normalized),
        )

        query = LemmaData.query.filter(broad_filter).order_by(
            case(
                (LemmaData.form == cleaned, 1),
                (LemmaData.lemma == cleaned, 2),
                (LemmaData.normalized == normalized, 3),
                (LemmaData.norm_form == normalized, 4),
                (LemmaData.form_eng == cleaned, 5),
                (LemmaData.norm_form_eng == normalized, 6),
                (LemmaData.eng_lemma == normalized, 7),
                (LemmaData.eng_lemma == cleaned, 8),
                (LemmaData.norm_form.startswith(normalized), 11),
                (LemmaData.normalized.startswith(normalized), 12),
                (LemmaData.form_eng.startswith(cleaned), 13),
                (LemmaData.norm_form_eng.startswith(normalized), 14),
                (LemmaData.full_eng.startswith(cleaned), 15),
                (LemmaData.eng_lemma.startswith(normalized), 16),
                (LemmaData.norm_form.contains(normalized), 21),
                (LemmaData.normalized.contains(normalized), 22),
                (LemmaData.form_eng.contains(cleaned), 23),
                (LemmaData.norm_form_eng.contains(normalized), 24),
                (LemmaData.full_eng.contains(cleaned), 25),
                (LemmaData.eng_lemma.contains(normalized), 26),
                else_=99,
            ),
            func.length(LemmaData.form).asc(),
            LemmaData.line_number.asc(),
        ).limit(500)

        results = query.all()

    if not results:
        return []

    return _word_details_from_lemmas(results)

def search_by_definition(query):
    """Returns list of (lemma_id, line_number) tuples for matching definitions"""
    exact_matches = db.session.query(
        LemmaDefinition.lemma_id,
        LemmaData.line_number
    ).join(LemmaData).filter(
        LemmaDefinition.short_definition == query
    ).all()
    
    if exact_matches:
        return exact_matches
    
    partial_matches = db.session.query(
        LemmaDefinition.lemma_id,
        LemmaData.line_number
    ).join(LemmaData).filter(
        LemmaDefinition.short_definition.contains(query)
    ).limit(12).all()
    
    return partial_matches[:300]

def get_word(lemma_id):
    """Return one surface form for a lemma_id (lemma may appear on multiple lines)."""
    lemma = LemmaData.query.filter_by(lemma_id=lemma_id).first()
    return lemma.form if lemma else None 